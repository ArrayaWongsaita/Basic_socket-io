import { Link } from 'react-router';
import { PUBLIC_ROUTES } from '../../constants/router';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import AuthButtons from './AuthButtons';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={PUBLIC_ROUTES.HOME}
              className="text-gray-800 text-xl font-semibold hover:text-gray-600 transition-colors"
            >
              Socket.IO
            </Link>
          </div>

          {/* Navigation */}
          <DesktopNavigation />

          {/* Action Buttons */}
          <AuthButtons />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </header>
  );
}
