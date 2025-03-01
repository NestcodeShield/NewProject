import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AdDetails.css";
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";

const AdDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryTranslations = {
    "real-estate": "Недвижимость",
    cars: "Автомобили",
    electronics: "Электроника",
    furniture: "Мебель",
    other: "Другие товары",
    jobs: "Работа",
    services: "Услуги",
    pets: "Животные",
    clothing: "Одежда",
    sports: "Спортивные товары",
    hobbies: "Хобби и отдых",
    beauty: "Красота и здоровье",
    education: "Образование",
  };

  const subcategoryTranslations = {
    rent: "Аренда",
    sale: "Продажа",
    new: "Новые",
    used: "Б/У",
    parts: "Запчасти",
    phones: "Телефоны",
    computers: "Компьютеры",
    appliances: "Бытовая техника",
    gaming: "Игровые приставки",
    "full-time": "Полная занятость",
    "part-time": "Частичная занятость",
    freelance: "Фриланс",
    cleaning: "Уборка",
    repair: "Ремонт",
    transportation: "Транспортные услуги",
    design: "Дизайн",
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads/${id}`);
        setAd(response.data);
      } catch (err) {
        setError("Ошибка загрузки объявления.");
        console.error("Ошибка загрузки объявления:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ad.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + ad.images.length) % ad.images.length);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!ad) return <p>Объявление не найдено.</p>;

  return (
    <div className="ad-details">
      <Header />
      <div className="Ad-information">
        <Breadcrumbs category={ad.category} />
        <h1>{ad.title || "Нет информации о названии"}</h1>
        <div className="ad-content">
          <div className="ad-images">
            {ad.images && ad.images.length > 0 ? (
              <>
                <div className="main-image-container">
                  <div className="main-image">
                    <img
                      src={`http://localhost:5000${ad.images[currentImageIndex]}`}
                      alt="Фото объявления"
                      onClick={() => openModal(currentImageIndex)}
                    />
                    {ad.images.length > 1 && (
                      <>
                        <button className="nav-button left" onClick={handlePrevImage}>
                          &lt;
                        </button>
                        <button className="nav-button right" onClick={handleNextImage}>
                          &gt;
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {ad.images.length > 1 && (
                  <div className="thumbnail-images">
                    {ad.images.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${img}`}
                        alt={`Фото ${index + 1}`}
                        className={index === currentImageIndex ? "active" : ""}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>Фото отсутствуют.</p>
            )}
          </div>
          <div className="ad-info">
            <div className="characteristics">
              <h2>Характеристики</h2>
              <p className="characteristics-item">
                <strong>Категория:</strong>{" "}
                <span className="gray-text">
                  {categoryTranslations[ad.category] || "Не указана"}
                  {ad.subcategory && `, ${subcategoryTranslations[ad.subcategory]}`}
                </span>
              </p>
              <p className="characteristics-item">
                <strong>Описание:</strong>{" "}
                <span className="gray-text">{ad.description || "Нет описания"}</span>
              </p>
              <p className="characteristics-item">
                <strong>Цена:</strong>{" "}
                <span className="gray-text">{ad.price ? `${ad.price} €` : "Цена не указана"}</span>
              </p>
              <p className="characteristics-item">
                <strong>Город:</strong>{" "}
                <span className="gray-text">{ad.location || "Город не указан"}</span>
              </p>
              <p className="characteristics-item">
                <strong>Доставка:</strong>{" "}
                <span className="gray-text">{ad.deliveryOption || "Не указано"}</span>
              </p>
              <p className="characteristics-item">
                <strong>Опубликовано:</strong>{" "}
                <span className="gray-text">
                  {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Дата не указана"}
                </span>
              </p>
              {ad.phoneNumber && (
                <p className="characteristics-item">
                  <strong>Телефон:</strong>{" "}
                  <span className="gray-text">{ad.phoneNumber}</span>
                </p>
              )}
              {ad.socialLinks && ad.socialLinks.length > 0 && (
                <div className="characteristics-item">
                  <strong>Ресурсы:</strong>{" "}
                  <div className="social-links">
                    {ad.socialLinks.map((link, index) => (
                      isValidUrl(link.url) && (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gray-text"
                        >
                          {link.type === "telegram" && "Telegram: "}
                          {link.type === "instagram" && "Instagram: "}
                          {link.type === "facebook" && "Facebook: "}
                          {link.type === "other" && "Ссылка: "}
                          {link.url}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={`http://localhost:5000${ad.images[currentImageIndex]}`}
              alt="Фото объявления"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetails;