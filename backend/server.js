import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express(); // Создаем экземпляр Express


app.use(cors({
  origin: 'http://localhost:5173',  // Разрешаем доступ с фронтенда
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Статическое обслуживание изображений
app.use("/images", express.static("public/images"));

// Настройка Multer для сохранения файлов в папку public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Указываем папку для хранения изображений
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

// ID автоматически добавляется с помощью _id от MongoDB
const Ad = mongoose.model("Ad", AdSchema);


// Маршрут для добавления объявления с изображениями
app.post("/api/ads", upload.array("images", 10), async (req, res) => {
  try {
    // Проверяем, что изображения были загружены
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Не загружены файлы!" });
    }

    // Преобразуем данные формы в корректный формат
    const { category, subcategory, title, description, price, rooms, location, duration } = req.body;
    
    // Обрабатываем пути к изображениям
    const imagePaths = req.files.map(file => `/images/${file.filename}`);

    // Создаем новое объявление
    const newAd = new Ad({
      category,
      subcategory,
      title,
      description,
      price: parseFloat(price),  // Преобразуем цену в число
      rooms: rooms ? parseInt(rooms, 10) : undefined,  // Преобразуем количество комнат, если оно есть
      location,
      duration,
      images: imagePaths,
    });

    // Сохраняем объявление в базе
    await newAd.save();
    
    // Отправляем ответ с добавленным объявлением
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


// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
