import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Статическое обслуживание изображений
app.use("/images", express.static("public/images"));

// Настройка Multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Подключение к MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/montenegro_ads", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Успешное подключение к MongoDB"))
  .catch((error) =>
    console.error("Ошибка подключения к MongoDB", error)
  );

// --- МОДЕЛИ ---

// Модель объявления
const AdSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rooms: { type: Number },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  images: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  phoneNumber: String,
  socialLinks: [
    {
      type: { type: String },
      url: { type: String },
    },
  ],
  deliveryOption: { type: String, required: true },
});
const Ad = mongoose.model("Ad", AdSchema);

// Модель пользователя
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt:{ type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

// --- ЭНДПОИНТЫ ---

// Добавление объявления с изображениями
app.get("/api/test", (req, res) => {
  res.json({ message: "Сервер работает!" });
});


app.post("/api/ads", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Не загружены файлы!" });
    }
    const {
      category,
      subcategory,
      title,
      description,
      price,
      rooms,
      location,
      duration,
      phoneNumber,
      socialLinks,
      deliveryOption,
    } = req.body;

    const imagePaths = req.files.map((file) => `/images/${file.filename}`);

    const newAd = new Ad({
      category,
      subcategory,
      title,
      description,
      price: parseFloat(price),
      rooms: rooms ? parseInt(rooms, 10) : undefined,
      location,
      duration,
      images: imagePaths,
      phoneNumber,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : [],
      deliveryOption,
    });

    await newAd.save();
    res.status(201).json({
      message: "✅ Объявление добавлено!",
      ad: newAd,
    });
  } catch (error) {
    console.error("Ошибка при добавлении объявления:", error);
    res.status(500).json({ error: "Ошибка при добавлении объявления", message: error.message });
  }
});

// Получение всех объявлений
app.get("/api/ads", async (req, res) => {
  try {
    const { query, category, subcategory } = req.query;
    let filter = {};

    if (query && query.trim() !== "") {
      filter.title = { $regex: query, $options: "i" };
    }
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    console.log("🔍 Фильтр поиска:", filter);
    const ads = await Ad.find(filter);
    res.json(ads);
  } catch (error) {
    console.error("Ошибка поиска объявлений:", error);
    res.status(500).json({ error: "Ошибка при поиске объявлений" });
  }
});


// Получение объявления по ID
app.get("/api/ads/:id", async (req, res) => {
  console.log("🔎 Запрос объявления с ID:", req.params.id);
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Некорректный ID" });
    }
    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({ message: "Объявление не найдено" });
    }
    res.json(ad);
  } catch (error) {
    console.error("Ошибка при получении объявления:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Регистрация пользователя



app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Все поля обязательны" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }
    
    // Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: error.message });
  }
});




// Логин пользователя
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("📥 Получены данные для входа:", { username });

    if (!username || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный пароль" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("✅ Успешный вход:", user.username);
    res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("🚨 Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Маршрут для получения информации о пользователе (профиля)
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Пользователь не авторизован", reauthenticate: true });
    }
    
    // Расшифровываем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Срок действия токена истёк", expired: true, reauthenticate: true });
    }
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});


app.post("/api/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Токен отсутствует", reauthenticate: true });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Недействительный refresh-токен", reauthenticate: true });
  }
});



// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
