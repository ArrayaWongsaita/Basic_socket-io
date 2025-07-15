import { Link, useLocation } from 'react-router';
import { navBarList } from '../../constants/navigation';
import { PUBLIC_ROUTES } from '../../constants/router';
import { Button } from '../ui/button';
import useAuthStore from '../../../features/auth/stores/authStore';

export default function MobileNavigation() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="md:hidden pb-4">
      <div className="flex flex-col space-y-2">
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

        {/* Authentication Section */}
        <div className="pt-2 border-t border-gray-200">
          {isLoading ? (
            <div className="flex space-x-3">
              <div className="animate-pulse bg-gray-200 h-8 flex-1 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 flex-1 rounded"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName?.[0]?.toUpperCase()}
                    {user.lastName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to={PUBLIC_ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button variant="default" size="sm" className="flex-1" asChild>
                <Link to={PUBLIC_ROUTES.REGISTER}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
