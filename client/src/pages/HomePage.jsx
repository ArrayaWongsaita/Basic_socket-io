import { Link } from 'react-router';
import { BoltIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline';
import { features } from '../shared/constants';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center py-20 px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white rounded-2xl mb-16 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Socket.IO <span className="text-blue-200">Learning Hub</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Master real-time web applications with hands-on Socket.IO examples.
            Chat, broadcast, and synchronize data in real-time!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/chat"
              className="px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white text-blue-800 hover:bg-blue-50"
            >
              🚀 Start Learning
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-blue-200 text-blue-100 hover:bg-blue-700 hover:border-blue-100 transition-all duration-300"
            >
              📖 About This Project
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            🎯 Interactive Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore different Socket.IO patterns and real-time communication
            concepts through these interactive demos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div
                className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800">
                Try it out →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Technology Highlights */}
      <div className="bg-gray-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          ⚡ Built with Modern Technology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BoltIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Real-time Communication
            </h3>
            <p className="text-gray-600">
              Socket.IO for instant bidirectional communication between client
              and server
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Multi-user Experience
            </h3>
            <p className="text-gray-600">
              Support for multiple users with real-time updates and
              synchronization
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Instant Updates
            </h3>
            <p className="text-gray-600">
              See changes happen in real-time across all connected clients
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-16 px-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Experience Real-time Magic?
        </h2>
        <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
          Open multiple browser tabs or share with friends to see the real-time
          synchronization in action!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/chat"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-700"
          >
            💬 Start Chatting
          </Link>
          <Link
            to="/broadcast/all"
            className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-purple-700"
          >
            📢 Try Broadcasting
          </Link>
          <Link
            to="/counter"
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-green-700"
          >
            🔢 Test Counter
          </Link>
        </div>
      </div>
    </div>
  );
}
