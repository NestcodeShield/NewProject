import { useState } from "react";
import "./Links.css";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

function Links() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {  // Убедись, что порт соответствует бэкенду
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка сервера");
      }

      console.log("✅ Вход выполнен:", data);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("🚨 Ошибка при входе:", error.message);
    }
  };

  const handleRegister = async ({ username, email, password }) => {  // Принимаем данные
    try {
      const response = await fetch("http://localhost:5000/api/register", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ошибка сервера");

      console.log("✅ Успешная регистрация:", data);
    } catch (error) {
      console.error("🚨 Ошибка при регистрации:", error.message);
    }
  };

  return (
    <>
      <div className="Links">
        <div className="container">
          <ul className="information">
            <li>Пункт 1</li>
            <li>Пункт 2</li>
            <li>Пункт 3</li>
          </ul>
          <div className="buttons">
            <button className="log" onClick={() => setIsAuthModalOpen(true)}>
              Вход | Регистрация
            </button>
            <button className="announcement">
              <Link to="/announcement">Создать объявление</Link>
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  );
}

export default Links;
