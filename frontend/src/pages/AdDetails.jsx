import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./AdDetails.css";
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";

const AdDetails = () => {
  const { id } = useParams(); // Извлекаем ID из параметров URL
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryTranslations = {
    "real-estate": "Недвижимость",
    "cars": "Автомобили",
    "electronics": "Электроника",
    "furniture": "Мебель",
    "other": "Другие товары",
  };

  useEffect(() => {
    console.log("Запрашиваем ID объявления:", id); // Логируем ID для отладки
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${id}`);
        console.log("Ответ от API:", response.data); // Логируем ответ от API
        setAd(response.data); // Устанавливаем данные объявления
      } catch (err) {
        setError("Ошибка загрузки объявления.");
        console.error("Ошибка загрузки объявления:", err);
      } finally {
        setLoading(false); // Загружено
      }
    };

    fetchAd();
  }, [id]); // Перезапускаем эффект при изменении ID

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>; // Показываем ошибку, если она есть
  if (!ad) return <p>Объявление не найдено.</p>; // Если объявления нет, показываем сообщение

  return (
    <div className="ad-details">
      <Header />
      <Breadcrumbs category={ad.category} /> {/* Передаем категорию в хлебные крошки */}
      {/* Фото */}
      <div className="ad-images">
        {ad.images && ad.images.length > 0 ? (
          ad.images.map((img, index) => (
            <img key={index} src={`http://localhost:5000${img}`} alt="Фото объявления" />
          ))
        ) : (
          <p>Фото отсутствуют.</p>
        )}
      </div>
      <h1>{ad.title || 'Нет информации о названии'}</h1>
      <p><strong>Категория:</strong> {categoryTranslations[ad.category] || "Не указана"}</p>
      <p><strong>Описание:</strong> {ad.description || 'Нет описания'}</p>
      <p><strong>Цена:</strong> {ad.price ? `${ad.price} €` : 'Цена не указана'}</p>
      <p><strong>Город:</strong> {ad.location || 'Город не указан'}</p>
      <p><strong>Опубликовано:</strong> {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : 'Дата не указана'}</p>
    </div>
  );
};

export default AdDetails;
