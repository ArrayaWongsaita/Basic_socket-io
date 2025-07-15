import { Link, useLocation } from 'react-router';
import { navBarList } from '../../constants/navigation';

export default function DesktopNavigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="hidden md:flex space-x-8">
      {navBarList.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isActive(item.path)
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
