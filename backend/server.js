import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

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
  category: String,
  subcategory: String,
  title: String,
  description: String,
  price: Number,
  rooms: Number,
  location: String,
  duration: String,
  images: [String], // Список ссылок на изображения
  createdAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model("Ad", AdSchema);

// Маршрут для добавления объявления с изображениями
app.post("/api/ads", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Не загружены файлы!" });
    }

    console.log('Получены файлы:', req.files);
    const imagePaths = req.files.map((file) => `/images/${file.filename}`); // Сохраняем путь к файлам
    console.log('Пути к изображениям:', imagePaths);

    const newAd = new Ad({ ...req.body, images: imagePaths });
    await newAd.save();
    console.log('Объявление добавлено:', newAd);
    
    res.status(201).json({ message: "✅ Объявление добавлено!", ad: newAd });
  } catch (error) {
    console.error('Ошибка при добавлении объявления:', error);
    res.status(500).json({ error: "Ошибка при добавлении объявления", message: error.message });
  }
});


// Маршрут для получения всех объявлений
app.get("/api/ads", async (req, res) => {
  try {
    const ads = await Ad.find();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении объявлений" });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
