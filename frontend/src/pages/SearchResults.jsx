import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css";
import Header from "../components/Header";

function SearchResults() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const searchQuery = queryParams.get("query") || "";
  const category = queryParams.get("category") || "";
  const subcategory = queryParams.get("subcategory") || "";

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("/api/ads/search", {
          params: { query: searchQuery, category, subcategory },
        });
        setAds(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке объявлений:", error);
        setError("Ошибка при загрузке объявлений");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [searchQuery, category, subcategory]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="Ads-container">
      <Header />
      <h2>Результаты поиска</h2>
      {ads.length === 0 ? (
        <p>Ничего не найдено.</p>
      ) : (
        <ul className="ads-list">
          {ads.map((ad) => (
            <li key={ad._id} className="ad-card">
              {ad.images && ad.images.length > 0 && (
                <img src={`http://localhost:5000${ad.images[0]}`} alt={ad.title} />
              )}
              <h2>
                <a href={`/ad/${ad._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {ad.title}
                </a>
              </h2>
              <p>{ad.location}</p>
              <p className="price">{ad.price} €</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;