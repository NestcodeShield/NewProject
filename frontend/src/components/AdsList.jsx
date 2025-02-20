// src/components/AdsList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdsList.css";

const AdsList = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ads");
        setAds(response.data);
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
      }
    };

    fetchAds();
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
                <img src={`http://localhost:5000${ad.images[0]}`} alt="Объявление" width="150" />
              )}
              <h2>{ad.title}</h2>
              <p> {ad.location}</p>
              <p className="price"> {ad.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdsList;