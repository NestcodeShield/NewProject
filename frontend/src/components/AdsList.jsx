import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdsList.css";

const AdsList = () => {
  const [ads, setAds] = useState([]);

  React.useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ads");
        setAds(response.data);
        localStorage.setItem("ads", JSON.stringify(response.data));
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
        alert("Ошибка при загрузкеa объявлений, пожалуйста, попробуйте позже.");
      }
    };

    fetchAds();
  }, []);

  const handleAddToFavorites = (ad) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    // Проверка на дубликат
    if (favorites.some(fav => fav._id === ad._id)) {
      alert("Уже в избранном!");
      return;
    }
  
    // Обновляем и сохраняем
    const updatedFavorites = [...favorites, ad];
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
    // Уведомляем другие компоненты
    window.dispatchEvent(new Event("storage"));
    alert("Добавлено в избранное!");
  };

  return (
    <div className="Ads-container">
      {ads.length === 0 ? (
        <p>Объявлений пока нет.</p>
      ) : (
        <ul className="ads-list">
          {ads.map((ad) => (
            <li key={ad._id} className="ad-card">
              {ad.images && ad.images.length > 0 && <ImageSlider images={ad.images} />}
              <h2>
                <Link to={`/ad/${ad._id}`}>
                  {ad.title}
                </Link>
              </h2>
              <p className="price">{ad.price} €</p>
              <p className="location">{ad.location}</p>
              <button onClick={() => handleAddToFavorites(ad)}>
                Добавить в избранное
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Компонент слайдера с индикаторами, которые появляются только при наведении на фото
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="image-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`http://localhost:5000${images[currentIndex]}`}
        alt="Объявление"
        className="slider-image"
      />
      {isHovered && (
        <div className="indicator-container">
          {images.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onMouseEnter={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>

    
  );
};

export default AdsList;
