// src/pages/Home.jsx
import React from "react";
import AdsList from "../components/AdsList";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="Home">
      <Header />
      <h1>Объявления</h1>
      {/* Вставляем компонент с объявлениями */}
      <AdsList />
    </div>
  );
};

export default Home;