import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { signInSchema } from '../schemas/authSchemas';
import { PUBLIC_ROUTES } from '../../../shared/constants/router';
import { Button, Form, InputForm } from '../../../shared/components/ui';
import { socketService } from '../../../shared/services';
import useAuthStore from '../stores/authStore';

export default function SignInForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'jane@example.com',
      password: 'password123',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    clearError();

    try {
      const result = await signIn({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Connect to Socket.IO
        socketService.connect();

        // Redirect to the page user was trying to access or home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link
            to={PUBLIC_ROUTES.REGISTER}
            className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <InputForm
              control={form.control}
              name="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
            />

            {/* Password Field */}
            <InputForm
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...form.register('rememberMe')}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="w-full h-12"
              size="lg"
            >
              {isLoading || form.formState.isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link
          to={PUBLIC_ROUTES.HOME}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
