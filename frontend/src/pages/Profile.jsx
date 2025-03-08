import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Profile.css';
import Header from "../components/Header";
import Breadcrumbs from "../components/Breadcrumbs";
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 // ✅ Загрузка избранных только из localStorage
useEffect(() => {
  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  };

  loadFavorites();
  window.addEventListener("storage", loadFavorites);
  return () => window.removeEventListener("storage", loadFavorites);
}, []);

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Пользователь не авторизован");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Данные профиля:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Ошибка при получении профиля:", err);
      setError(err.message);
    }
  };

  fetchProfile();
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (error) return <p>Ошибка: {error}</p>;
  if (!user) return <p>Загрузка...</p>;

  axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.expired) {
      alert("Сессия истекла, пожалуйста, войдите снова.");
      localStorage.removeItem("token"); // Удаляем старый токен
      window.location.href = "/login"; // Перенаправляем на авторизацию
    }
    return Promise.reject(error);
  }
);



  return (
    <div className="profile">
      <Header />
      <div className="profileInfo">
        <Breadcrumbs />
        <h2>Личный кабинет</h2>
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
      </div>
    </div>
  );
}

export default Profile;
