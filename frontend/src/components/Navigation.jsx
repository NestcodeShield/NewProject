import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import "./Navigation.css";

function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false); // Флаг для запуска поиска
  const navigate = useNavigate();

  // Эффект для выполнения поиска при изменении triggerSearch
  useEffect(() => {
    if (triggerSearch) {
      handleSearch();
      setTriggerSearch(false); // Сбрасываем флаг после выполнения поиска
    }
  }, [triggerSearch]);

  const handleSearch = () => {
    // Проверяем, пуста ли строка поиска и не выбрана ли категория
    if (!searchQuery.trim() && !selectedCategory) {
      setErrorMessage("Пожалуйста, введите запрос или выберите категорию.");
      return;
    }

    // Если строка не пуста или выбрана категория, выполняем поиск
    setErrorMessage("");
    console.log("Поиск:", { searchQuery, selectedCategory, selectedSubcategory });
    navigate(
      `/search?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}&subcategory=${selectedSubcategory}`
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(""); // Сбрасываем подкатегорию
    setTriggerSearch(true); // Устанавливаем флаг для запуска поиска
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setTriggerSearch(true); // Устанавливаем флаг для запуска поиска
  };

  return (
    <>  
      <div className="Navigation">
        <nav>
          <img alt="logo" />
          <button onClick={() => setIsModalOpen(true)}>
            <img src="/icons/Slider_03.svg" alt="Search" />
            Категории
          </button>
          <label> 
            <input
              type="search"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setErrorMessage("");
              }}
            />
            <button onClick={() => setTriggerSearch(true)}>
              Найти
            </button>
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </nav>
      </div>

      {/* Модальное окно для выбора категорий */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCategory={handleCategorySelect}
        onSelectSubcategory={handleSubcategorySelect}
      />
    </>
  );
}

export default Navigation;