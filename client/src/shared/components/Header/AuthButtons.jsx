import { Link } from 'react-router';
import { PUBLIC_ROUTES } from '../../constants/router';
import { Button } from '../ui/button';
import useAuthStore from '../../../features/auth/stores/authStore';
import UserDropdownMenu from './UserDropdownMenu';

export default function AuthButtons() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signIn = useAuthStore((state) => state.signIn);

  // Show loading state
  if (isLoading) {
    return (
      <div className="hidden md:flex items-center space-x-3">
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    );
  }

  // If user is authenticated, show user dropdown
  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center">
        <UserDropdownMenu />
      </div>
    );
  }

  function handleSignin() {
    signIn({
      email: 'random@example.com',
      password: 'password123',
    });
  }

  // If not authenticated, show login/signup buttons
  return (
    <div className="hidden md:flex items-center space-x-3">
      <Button variant="outline" size="sm" asChild onClick={handleSignin}>
        {/* <Link to={PUBLIC_ROUTES.SIGNIN}>Login</Link> */}
        <p>Login</p>
      </Button>
      {/* <Button variant="default" size="sm" asChild>
        <Link to={PUBLIC_ROUTES.SIGNUP}>Sign Up</Link>
      </Button> */}
    </div>
  );
}
