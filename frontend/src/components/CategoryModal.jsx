import React, { useState } from "react";
import { categories } from "../data/categories";
import "./CategoryModal.css";

function CategoryModal({ isOpen, onClose, onSelectCategory, onSelectSubcategory }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState("categories");

  if (!isOpen) return null;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);

    const category = categories.find((cat) => cat.id === categoryId);
    if (!category.subcategories || category.subcategories.length === 0) {
      onSelectCategory(categoryId); // Передаем выбранную категорию
      onClose();
    } else {
      setCurrentPage("subcategories");
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    onSelectSubcategory(subcategoryId); // Передаем выбранную подкатегорию
  };

  const handleApply = () => {
    onSelectCategory(selectedCategory);
    onSelectSubcategory(selectedSubcategory);
    onClose();
  };

  const handleBack = () => {
    setCurrentPage("categories");
    setSelectedSubcategory("");
  };

  const handleClose = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>

        {currentPage === "categories" ? (
          <>
            <h2>Выберите категорию</h2>
            <ul className="category-list">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="category-item"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Выберите подкатегорию</h2>
            <button className="back-button" onClick={handleBack}>
              Назад
            </button>
            <ul className="subcategory-list">
              {categories
                .find((cat) => cat.id === selectedCategory)
                .subcategories.map((subcat) => (
                  <li
                    key={subcat.id}
                    className={`subcategory-item ${
                      selectedSubcategory === subcat.id ? "active" : ""
                    }`}
                    onClick={() => handleSubcategoryClick(subcat.id)}
                  >
                    {subcat.name}
                  </li>
                ))}
            </ul>
            <button className="apply-button" onClick={handleApply}>
              Применить
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryModal;