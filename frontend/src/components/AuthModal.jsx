import React, { useState } from "react";

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
      
      console.log("Ответ сервера:", response);
      
      
      // Если токен успешно получен, поля формы очищаются и модалка закрывается.
      setUsername("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message || "Ошибка при авторизации. Проверьте данные.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
      <button onClick={onClose} className="close-button">
        &times;
      </button>
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
        <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: "pointer", color: "blue" }}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
