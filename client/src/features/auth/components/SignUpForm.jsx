import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { signUpSchema } from '../schemas/authSchemas';
import { PUBLIC_ROUTES } from '../../../shared/constants/router';
import { Button, Form, InputForm } from '../../../shared/components/ui';

import useAuthStore from '../stores/authStore';
import { useSocketStore } from '@/shared/stores/socketStore';

export default function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data) => {
    clearError();

    const result = await signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      // Connect to Socket.IO
      useSocketStore.getState().connect();

      // Navigate to home page
      navigate('/');
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link
            to={PUBLIC_ROUTES.LOGIN}
            className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
          >
            sign in to your existing account
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
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputForm
                control={form.control}
                name="firstName"
                label="First name"
                type="text"
                placeholder="Enter your first name"
              />
              <InputForm
                control={form.control}
                name="lastName"
                label="Last name"
                type="text"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email Field */}
            <InputForm
              control={form.control}
              name="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
            />

            {/* Password Fields */}
            <InputForm
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
            />

            <InputForm
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...form.register('agreeToTerms')}
              className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded mt-1"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 block text-sm text-gray-700"
            >
              I agree to the{' '}
              <a
                href="#"
                className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
              >
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {form.formState.errors.agreeToTerms && (
            <p className="text-sm text-red-600">
              {form.formState.errors.agreeToTerms.message}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12"
              size="lg"
            >
              {form.formState.isSubmitting ? (
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
                  Creating account...
                </div>
              ) : (
                'Create account'
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
