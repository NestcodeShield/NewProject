import express from "express"; 
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express(); // Создаем экземпляр Express

// Разрешаем доступ с фронтенда
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Статическое обслуживание изображений
app.use("/images", express.static("public/images"));

// Настройка Multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Имя файла
  },
});

const upload = multer({ storage });

// Подключение к MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/montenegro_ads")
  .then(() => console.log("✅ Успешное подключение к MongoDB"))
  .catch((error) => console.error("Ошибка подключения к MongoDB", error));

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
  phoneNumber: String, // Номер телефона
  socialLinks: [       // Ссылки на соц. сети
    {
      type: { type: String }, // Тип ссылки (например, "telegram", "instagram")
      url: { type: String }   // URL ссылки
    }
  ],
});

const Ad = mongoose.model("Ad", AdSchema);

// Маршрут для добавления объявления с изображениями
app.post("/api/ads", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Не загружены файлы!" });
    }

    const { category, subcategory, title, description, price, rooms, location, duration, phoneNumber, socialLinks } = req.body;
    
    const imagePaths = req.files.map(file => `/images/${file.filename}`);

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
      phoneNumber, // ✅ Добавляем номер телефона
      socialLinks: socialLinks ? JSON.parse(socialLinks) : [], // ✅ Добавляем ссылки
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


// Маршрут для получения всех объявлений
app.get("/api/ads", async (req, res) => {
  try {
    const { query, category, subcategory } = req.query;
    let filter = {};

    if (query) {
      filter.title = { $regex: query, $options: "i" }; // Поиск по названию (регистронезависимо)
    }
    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    console.log("🔍 Фильтр поиска:", filter);

    const ads = await Ad.find(filter);
    res.json(ads);
  } catch (error) {
    console.error("Ошибка поиска объявлений:", error);
    res.status(500).json({ error: "Ошибка при поиске объявлений" });
  }
});


// Пример маршрута для получения объявления по ID

// Маршрут для поиска объявлений
app.get("/api/ads/search", async (req, res) => {
  const { query, category, subcategory } = req.query;
  const filter = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" }; // Поиск по названию (регистронезависимый)
  }
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;

  try {
    const ads = await Ad.find(filter);
    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


// Маршрут для получения объявления по ID
app.get("/api/ads/:id", async (req, res) => {
  const { id } = req.params;
  try {
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




// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
