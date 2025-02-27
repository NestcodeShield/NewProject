import React, { useState } from "react";
import { categories } from "../data/categories"; // Убедитесь, что путь правильный
import "./CategoryModal.css"; // Добавим стили для модального окна

function CategoryModal({ isOpen, onClose, onSelectCategory, onSelectSubcategory }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    if (!selectedCategory) return; // Не даём закрыть, если не выбрали категорию
    onSelectCategory(selectedCategory);
    onSelectSubcategory(selectedSubcategory || ""); // Если не выбрана подкатегория, передаём пустую строку
    onClose();
  };  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Выберите категорию</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Список категорий */}
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>

        {/* Список подкатегорий */}
        {selectedCategory && (
          <ul className="subcategory-list">
            {categories
              .find((cat) => cat.id === selectedCategory)
              .subcategories.map((subcat) => (
                <li
                  key={subcat.id}
                  className={`subcategory-item ${selectedSubcategory === subcat.id ? "active" : ""}`}
                  onClick={() => setSelectedSubcategory(subcat.id)}
                >
                  {subcat.name}
                </li>
              ))}
          </ul>
        )}

        {/* Кнопка "Применить" */}
        <button className="apply-button" onClick={handleApply}>
          Применить
        </button>
      </div>
    </div>
  );
}

export default CategoryModal;