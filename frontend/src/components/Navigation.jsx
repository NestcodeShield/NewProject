import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import "./Navigation.css";

function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Поиск:", { searchQuery, selectedCategory, selectedSubcategory });
    navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}&subcategory=${selectedSubcategory}`);
  };

  return (
    <>
      <div className="Navigation">
        <nav>
          <img alt="logo" />
          <button onClick={() => setIsModalOpen(true)}>Категории</button>
          <label>
            <input
              type="search"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Найти</button>
          </label>
        </nav>
      </div>

      {/* Модальное окно для выбора категорий */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCategory={(category) => setSelectedCategory(category)}
        onSelectSubcategory={(subcategory) => setSelectedSubcategory(subcategory)}
      />
    </>
  );
}

export default Navigation;