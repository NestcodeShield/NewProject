import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css"; // Используем те же стили, что и для списка объявлений
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(saved);
      } catch (error) {
        console.error("Ошибка чтения избранных:", error);
      }
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const handleRemoveFromFavorites = (adId) => {
    const updated = favorites.filter(ad => ad._id !== adId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="ads-container">
      <Header />
      <Breadcrumbs />
      <h2 style={{ padding: "20px 0" }}>Избранные объявления</h2>
      {favorites.length === 0 ? (
        <p style={{ textAlign: "center" }}>Нет избранных объявлений</p>
      ) : (
        <ul className="ads-list">
          {favorites.map((ad) => (
            <li key={ad._id} className="ad-card">
              {/* Слайдер изображений */}
              {ad.images && ad.images.length > 0 && (
              <div className="image-preview">
                <img 
                  src={`http://localhost:5000${ad.images[0]}`} 
                  alt="Объявление" 
                  className="ad-image"
                />
              </div>
              )}

              {/* Ссылка на полное объявление */}
              <Link to={`/ad/${ad._id}`} className="ad-link">
                <h2>{ad.title}</h2>
              </Link>

              {/* Информация об объявлении */}
              <div className="ad-info">
                <p className="price">{ad.price} €</p>
                <p className="location">{ad.location}</p>
                <div className="ad-meta">
                  <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Кнопка удаления */}
              <button
                onClick={() => handleRemoveFromFavorites(ad._id)}
                className="remove-favorite-btn"
              >
                Удалить из избранного
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;