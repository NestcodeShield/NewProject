import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import { FaUserCircle } from "react-icons/fa"; // Импортируем иконку
import "./Links.css"; // Убедитесь, что стили подключены

function Links() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
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
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true); // Обновляем состояние авторизации
      setIsAuthModalOpen(false); // Закрываем модалку
    } catch (error) {
      console.error("🚨 Ошибка при входе:", error.message);
      alert(error.message);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Ошибка сервера");
      }

      console.log("✅ Успешная регистрация:", data);
      await handleLogin({ username, password }); // Автоматический вход после регистрации
    } catch (error) {
      console.error("🚨 Ошибка при регистрации:", error.message);
      alert(error.message);
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
            {isLoggedIn ? (
              <Link to="/profile" className="user-icon">
                <FaUserCircle size={24} /> {/* Иконка пользователя */}
              </Link>
            ) : (
              <button className="log" onClick={() => setIsAuthModalOpen(true)}>
                Вход | Регистрация
              </button>
            )}
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
