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
          {/* Показываем только категорию, если она есть */}
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            // Проверка, если это категория (например, 'real-estate'), то не показывать /ad в хлебных крошках
            if (value === "ad") return null;

            return (
              <li key={to} style={{ marginLeft: '8px', fontSize: '15px' }}>
                {'>'}
                {/* Отображаем крошки, если это категория */}
                {index === pathnames.length - 1 ? (
                  <span>{category}</span>  // Текст категории
                ) : (
                  <Link to={to}>{value}</Link>  // Прочие ссылки на промежуточные страницы
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
