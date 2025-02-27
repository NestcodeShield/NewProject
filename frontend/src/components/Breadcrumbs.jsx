import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

function Breadcrumbs({ category }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="Breadcrumbs">
      <nav>
        <ul style={{ display: 'flex', listStyleType: 'none' }}>
          <li>
            <Link to="/">Home</Link> {/* Первая ссылка на главную */}
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            // Если находимся на странице создания объявления, показываем соответствующий текст
            if (value === "ad" && index === pathnames.length - 1) {
              return (
                <li key={to} style={{ marginLeft: '8px', fontSize: '15px' }}>
                  {'>'} <span>Создание объявления</span>
                </li>
              );
            }

            // Пропускаем "ad", если он не последний
            if (value === "ad") return null;

            return (
              <li key={to} style={{ fontSize: '15px', gap: 10 }}>
                {'>'}
                {index === pathnames.length - 1 ? (
                  <span>{category}</span> // Текст категории
                ) : (
                  <Link to={to}>{value}</Link> // Прочие ссылки на промежуточные страницы
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Breadcrumbs;
