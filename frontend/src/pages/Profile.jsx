import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";
import "./Profile.css";
import AuthModal from "../components/AuthModal";

function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  // Загрузка избранных из localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const saved = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(saved);
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  // Функция загрузки профиля с сервера
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Пользователь не авторизован");
      setAuthModalOpen(true);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Ошибка при получении профиля:", err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        // Токен отсутствует, истёк или недействителен – открываем модалку авторизации
        localStorage.removeItem("token");
        setAuthModalOpen(true);
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Обработчик логина – отправляем запрос на сервер и возвращаем ответ
  const handleLogin = async ({ username, password }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      console.log("Ответ от логина:", response);
      if (!response || !response.data || !response.data.token) {
        throw new Error("Некорректный ответ от сервера при логине");
      }
      localStorage.setItem("token", response.data.token);
      setAuthModalOpen(false);
      fetchProfile(); // Повторная загрузка профиля после успешного входа
      return response; // Возвращаем ответ для AuthModal
    } catch (error) {
      console.error("Ошибка логина:", error);
      alert(error.response?.data?.message || error.message || "Ошибка при логине");
      throw error;
    }
  };

  // Обработчик регистрации – отправляем запрос на сервер и возвращаем ответ
  const handleRegister = async ({ username, email, password }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
      });
      console.log("Ответ от регистрации:", response);
      if (!response || !response.data || !response.data.token) {
        throw new Error("Некорректный ответ от сервера при регистрации");
      }
      localStorage.setItem("token", response.data.token);
      setAuthModalOpen(false);
      fetchProfile(); // Загружаем профиль после регистрации
      return response; // Возвращаем ответ для AuthModal
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert(error.response?.data?.error || error.message || "Ошибка при регистрации");
      throw error;
    }
  };

  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthModalOpen(true);
  };

  return (
    <div className="profile">
      <Header />
      <div className="profileInfo">
        <Breadcrumbs />
        <h2>Личный кабинет</h2>
        {user ? (
          <>
            <p>
              <strong>Имя пользователя:</strong> {user.username || "Неизвестный пользователь"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Неизвестный email"}
            </p>
            <p>
              <strong>Дата регистрации:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Не указана"}
            </p>
            <button onClick={handleLogout}>Выйти</button>
            <Link to="/favorites" className="favorites-btn">
              Избранные объявления ({favorites.length})
            </Link>
          </>
        ) : (
          <p>Загрузка...</p>
        )}
        {error && <p className="error">Ошибка: {error}</p>}
      </div>

      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default Profile;
