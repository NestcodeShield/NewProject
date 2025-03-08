import React, { useState } from "react";
import axios from "axios";

function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isRegister) {
        response = await onRegister({ username, email, password });
      } else {
        response = await onLogin({ username, password });
      }

      localStorage.setItem("token", response.data.token); // Сохранение токена

      // Сброс полей формы
      setUsername("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (error) {
      console.error("Ошибка:", error.message);
      alert(error.message); // Покажите ошибку пользователю
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {isRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Необходима авторизация");
        return;
      }

      const response = await axios.get("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
    } catch (error) {
      console.error("Ошибка при получении профиля:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <button onClick={fetchProfile}>Загрузить профиль</button>
      {profile && (
        <div>
          <h3>Профиль</h3>
          <p>Имя пользователя: {profile.username}</p>
          <p>ID: {profile.id}</p>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
