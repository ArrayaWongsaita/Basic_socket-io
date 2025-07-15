import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-gray-700"
          >
            🏠 Go Back Home
          </Link>

          <Link
            to="/chat"
            className="inline-block w-full px-6 py-3 border-2 border-gray-600 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            💬 Start Chatting
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
