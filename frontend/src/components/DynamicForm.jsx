import React, { useState } from "react";
import "./DynamicForm.css";

function DynamicForm() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [images, setImages] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryOption, setDeliveryOption] = useState(""); // Новое состояние для доставки
  const cities = ["Подгорица", "Будва", "Котор", "Бар", "Тиват", "Никшич"];

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory("");
  };

  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // Максимальный размер 5MB

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`Файл ${file.name} слишком большой! Максимальный размер — 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length + images.length <= 5) {
      setImages([...images, ...validFiles]);
    } else {
      alert("Вы можете загрузить не более 5 фото.");
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const validateForm = () => {
    const errors = {};

    if (!category) errors.category = "Пожалуйста, выберите категорию.";
    if (!title) errors.title = "Пожалуйста, укажите заголовок.";
    if (!description) errors.description = "Пожалуйста, укажите описание.";
    if (!selectedDuration) errors.selectedDuration = "Пожалуйста, выберите время действия объявления.";
    if (!location) errors.location = "Пожалуйста, укажите населённый пункт.";

    if (category !== "furniture" && !price) {
      errors.price = "Пожалуйста, укажите цену.";
    }

    if (category === "real-estate" && subcategory === "rent" && !rooms) {
      errors.rooms = "Пожалуйста, укажите количество комнат.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
    setError(errors);
  
    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
  
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("rooms", rooms);
      formData.append("location", location);
      formData.append("duration", selectedDuration);
      formData.append("phoneNumber", phoneNumber);
      formData.append("deliveryOption", deliveryOption); // Добавляем возможность доставки
  
      // Добавляем ссылки на соц. сети
      if (socialLink) {
        const socialLinks = [{ type: "other", url: socialLink }];
        formData.append("socialLinks", JSON.stringify(socialLinks));
      }
  
      images.forEach((image) => {
        formData.append("images", image);
      });
  
      try {
        const response = await fetch("http://localhost:5000/api/ads", {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          alert("✅ Объявление опубликовано! ID: " + result.ad._id);
        } else {
          alert("❌ Ошибка при отправке данных");
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
        alert("❌ Ошибка соединения с сервером");
      }
    } else {
      alert("⚠️ Пожалуйста, заполните все обязательные поля.");
    }
  };

  return (
    <div className="dynamic-form-container">
      <h2>Создание объявления</h2>
      <form className="dynamic-form" onSubmit={handleSubmit}>
        {/* Заголовок */}
        <input
          className="dynamic-input"
          type="text"
          placeholder="Введите заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error.title && <div className="dynamic-error">{error.title}</div>}

        {/* Категория */}
        <select
          className="dynamic-select"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Выберите категорию</option>
          <option value="real-estate">Недвижимость</option>
          <option value="cars">Автомобили</option>
          <option value="electronics">Электроника</option>
          <option value="furniture">Мебель</option>
          <option value="other">Другие товары</option>
          <option value="jobs">Работа</option>
          <option value="services">Услуги</option>
          <option value="pets">Животные</option>
          <option value="clothing">Одежда</option>
          <option value="sports">Спортивные товары</option>
          <option value="hobbies">Хобби и отдых</option>
          <option value="beauty">Красота и здоровье</option>
          <option value="education">Образование</option>
        </select>
        {error.category && <div className="dynamic-error">{error.category}</div>}

        {/* Подкатегория */}
        {category === "real-estate" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="rent">Аренда</option>
            <option value="sale">Продажа</option>
          </select>
        )}
        {category === "cars" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="new">Новые автомобили</option>
            <option value="used">Б/У автомобили</option>
            <option value="parts">Автозапчасти</option>
            <option value="parts">Другое</option>
          </select>
        )}
        {category === "electronics" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="phones">Телефоны</option>
            <option value="computers">Компьютеры</option>
            <option value="appliances">Бытовая техника</option>
            <option value="gaming">Игровые приставки</option>
            <option value="gaming">Другое</option>
          </select>
        )}
        {category === "furniture" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="used">Б/У</option>
            <option value="new">Новый</option>
          </select>
        )}
        {category === "jobs" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="full-time">Полная занятость</option>
            <option value="part-time">Частичная занятость</option>
            <option value="freelance">Фриланс</option>
          </select>
        )}
        {category === "services" && (
          <select
            className="dynamic-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Выберите подкатегорию</option>
            <option value="cleaning">Уборка</option>
            <option value="repair">Ремонт</option>
            <option value="transportation">Транспортные услуги</option>
            <option value="design">Дизайн</option>
          </select>
        )}

        {/* Описание */}
        <textarea
          className="dynamic-textarea"
          placeholder="Введите описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error.description && <div className="dynamic-error">{error.description}</div>}

        {/* Время действия объявления */}
        <select
          className="dynamic-select"
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
        >
          <option value="">Выберите время действия объявления</option>
          <option value="7">7 дней</option>
          <option value="14">14 дней</option>
          <option value="30">30 дней</option>
        </select>
        {error.selectedDuration && <div className="dynamic-error">{error.selectedDuration}</div>}

        {/* Цена */}
        <input
          className="dynamic-input"
          type="number"
          placeholder="Введите цену"
          value={price}
          onChange={(e) => {
            const value = e.target.value;
            if (value >= 0) {
              setPrice(value);
            }
          }}
        />
        <span className="currency-label">€</span>
        {error.price && <div className="dynamic-error">{error.price}</div>}

        {/* Количество комнат (для недвижимости) */}
        {category === "real-estate" && subcategory === "rent" && (
          <>
            <input
              className="dynamic-input"
              type="number"
              placeholder="Количество комнат"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
            {error.rooms && <div className="dynamic-error">{error.rooms}</div>}
          </>
        )}
        {/* Возможность доставки */}
        <select
          className="dynamic-select"
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
        >
          <option value="">Доставка</option>
          <option value="yes">Возможна</option>
          <option value="no">Отсутствует</option>
        </select>

        {/* Ссылка на соц. сети */}
        <input
          className="dynamic-input"
          type="text"
          placeholder="Ссылка на Instagram, Telegram или Facebook"
          value={socialLink}
          onChange={(e) => setSocialLink(e.target.value)}
        />
        {error.socialLink && <div className="dynamic-error">{error.socialLink}</div>}

        {/* Населённый пункт */}
        <select
          className="dynamic-select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Выберите населённый пункт</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
        {error.location && <div className="dynamic-error">{error.location}</div>}

        {/* Телефон */}
        <input
          className="dynamic-input"
          type="text"
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {error.phoneNumber && <div className="dynamic-error">{error.phoneNumber}</div>}

        {/* Фото */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="dynamic-image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(image)} alt="preview" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => removeImage(index)}
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>

        {/* Кнопка отправки */}
        <button className="dynamic-button" type="submit">
          Опубликовать объявление
        </button>
      </form>
    </div>
  );
}

export default DynamicForm;