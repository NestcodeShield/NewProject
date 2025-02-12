import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div>
      <nav>
        <ul style={{ display: 'flex', listStyleType: 'none' }}>
          <li>
            <Link to="/">Home</Link> {/* Первая ссылка на главную */}
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return (
              <li key={to} style={{ marginLeft: '8px' }}>
                {'>'}
                <Link to={to}>{value}</Link> {/* Показ всех промежуточных страниц */}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Breadcrumbs;