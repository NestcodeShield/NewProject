import { useState } from "react";
import "./DynamicForm.css"

const categoryOptions = {
  "Квартира": {
    "Сдам": ["Количество комнат", "Цена аренды в месяц"],
    "Продам": ["Количество комнат", "Цена продажи"]
  },
  "Авто": {
    "Продам": ["Марка", "Год выпуска", "Цена"],
    "Сдам в аренду": ["Марка", "Цена за день", "Состояние"]
  },
  "Электроника": {
    "Смартфоны": ["Бренд", "Состояние", "Цена"],
    "Ноутбуки": ["Бренд", "Оперативная память", "Цена", "Состояние"]
  }
};

function DynamicForm() {
  const [title, setTitle] = useState(""); // Заголовок объявления
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [fields, setFields] = useState([]);
  const [description, setDescription] = useState(""); // Описание объявления
  const [condition, setCondition] = useState(""); // Состояние (Новый / БУ)

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory("");
    setFields([]);
    setCondition("");
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setFields(categoryOptions[category][e.target.value] || []);
    setCondition("");
  };

  return (
    <div className="DynamicForm">
      <h2>Создание объявления</h2>

      {/* Поле заголовка */}
      <label>Заголовок объявления:</label>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Введите заголовок" 
      />

      {/* Выбор категории */}
      <label>Категория:</label>
      <select value={category} onChange={handleCategoryChange}>
        <option value="">Выберите категорию</option>
        {Object.keys(categoryOptions).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Выбор подкатегории */}
      {category && (
        <>
          <label>Подкатегория:</label>
          <select value={subCategory} onChange={handleSubCategoryChange}>
            <option value="">Выберите подкатегорию</option>
            {Object.keys(categoryOptions[category]).map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </>
      )}

      {/* Динамические поля */}
      {fields.length > 0 && (
        <div>
          <h3>Дополнительные параметры</h3>
          {fields.map((field, index) => (
            <div key={index}>
              <label>{field}:</label>

              {/* Радиокнопки для "Состояние" */}
              {field === "Состояние" ? (
                <div>
                  <label>
                    <input 
                      type="radio" 
                      name="condition" 
                      value="Новый" 
                      checked={condition === "Новый"} 
                      onChange={(e) => setCondition(e.target.value)}
                    /> Новый
                  </label>

                  <label>
                    <input 
                      type="radio" 
                      name="condition" 
                      value="БУ" 
                      checked={condition === "БУ"} 
                      onChange={(e) => setCondition(e.target.value)}
                    /> БУ
                  </label>
                </div>
              ) : (
                <input type="text" placeholder={field} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Поле для описания */}
      {subCategory && (
        <>
          <label>Описание объявления:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Введите описание..." 
            rows="4"
          />
        </>
      )}
    </div>
  );
}

export default DynamicForm;
