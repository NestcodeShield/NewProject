import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdsList.css";

const AdsList = () => {
  const [ads, setAds] = useState([]); // Инициализируем с пустым массивом

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("/api/ads");
        console.log(response.data); // Для проверки получаемых данных
        setAds(response.data);
        localStorage.setItem("ads", JSON.stringify(response.data)); 
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
        alert("Ошибка при загрузке объявлений, пожалуйста, попробуйте позже.");
      }
    };
  
    fetchAds(); // Выполняем загрузку данных при монтировании компонента
  }, []);
  

  return (
    <div className="Ads-container">
      {ads.length === 0 ? (
        <p>🔍 Объявлений пока нет.</p>
      ) : (
        <ul className="ads-list">
          {ads.map((ad) => (
            <li key={ad._id} className="ad-card">
              {ad.images && ad.images.length > 0 && (
                <img
                  src={`http://localhost:5000${ad.images[0]}`}
                  alt="Объявление"
                  width="150"
                />
              )}
              <h2>{ad.title}</h2>
              <p>{ad.location}</p>
              <p className="price">{ad.price} €</p>
              <Link to={`/ad/${ad._id}`}>Подробнее</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdsList;
