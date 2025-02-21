// src/components/AdDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./AdDetails.css";

const AdDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Запрашиваем ID объявления:", id); // Проверяем, какой ID передаётся
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${id}`);
        setAd(response.data);
      } catch (err) {
        console.error("Ошибка загрузки объявления:", err);
      }
    };
  
    fetchAd();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!ad) return <p>Объявление не найдено.</p>;

  return (
    <div className="ad-details">
      <Link to="/" className="back-button">← Назад</Link>
      <h1>{ad.title}</h1>
      <p><strong>Категория:</strong> {ad.category}</p>
      <p><strong>Описание:</strong> {ad.description}</p>
      <p><strong>Цена:</strong> {ad.price} €</p>
      <p><strong>Город:</strong> {ad.location}</p>
      <p><strong>Опубликовано:</strong> {new Date(ad.createdAt).toLocaleDateString()}</p>

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
    </div>
  );
};

export default AdDetails;
