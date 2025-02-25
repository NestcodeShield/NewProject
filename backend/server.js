import express from "express"; 
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

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
});

const Ad = mongoose.model("Ad", AdSchema);

// Маршрут для добавления объявления с изображениями
app.post("/api/ads", upload.array("images", 10), async (req, res) => {
  try {
    // Проверка наличия файлов
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Не загружены файлы!" });
    }

    const { category, subcategory, title, description, price, rooms, location, duration } = req.body;
    
    // Преобразование пути изображений
    const imagePaths = req.files.map(file => `/images/${file.filename}`);

    // Создание объявления
    const newAd = new Ad({
      category,
      subcategory,
      title,
      description,
      price: parseFloat(price), // Преобразование цены
      rooms: rooms ? parseInt(rooms, 10) : undefined, // Преобразование количества комнат
      location,
      duration,
      images: imagePaths,
    });

    // Сохранение объявления в базе данных
    await newAd.save();
    
    // Отправка ответа
    res.status(201).json({
      message: "✅ Объявление добавлено!",
      ad: newAd, // Возвращаем объявление с ID
    });
  } catch (error) {
    console.error("Ошибка при добавлении объявления:", error);
    res.status(500).json({ error: "Ошибка при добавлении объявления", message: error.message });
  }
});

// Маршрут для получения всех объявлений
app.get("/api/ads", async (req, res) => {
  try {
    const ads = await Ad.find();
    if (!ads) {
      throw new Error("Объявления не найдены");
    }
    res.json(ads);
    } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
});

// Пример маршрута для получения объявления по ID
app.get("/api/ads/:id", async (req, res) => {
  const { id } = req.params;

  // Проверяем, является ли id валидным ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Некорректный ID объявления" });
  }

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

// Маршрут для поиска объявлений
app.get("/api/ads/search", async (req, res) => {
  try {
    const { query, category, subcategory } = req.query;

    // Создаём фильтр для поиска
    const filter = {};

    if (query) {
      // Ищем по названию или описанию
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category; // Фильтр по категории
    }

    if (subcategory) {
      filter.subcategory = subcategory; // Фильтр по подкатегории
    }

    // Ищем объявления в базе данных
    const ads = await Ad.find(filter);

    if (!ads || ads.length === 0) {
      return res.status(404).json({ message: "Объявления не найдены" });
    }

    res.json(ads); // Отправляем результаты клиенту
  } catch (error) {
    console.error("Ошибка при поиске объявлений:", error);
    res.status(500).json({ message: "Ошибка при поиске объявлений", error: error.message });
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
