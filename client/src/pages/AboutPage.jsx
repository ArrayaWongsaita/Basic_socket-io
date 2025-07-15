import { Link } from 'react-router';
import {
  CodeBracketIcon,
  AcademicCapIcon,
  BoltIcon,
  CpuChipIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { technologies, learningTopics } from '../shared/constants';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <AcademicCapIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Socket.IO Learning Platform
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
          A comprehensive educational platform designed to teach real-time web
          development concepts through hands-on Socket.IO examples and
          interactive demonstrations.
        </p>
      </div>

      {/* Learning Topics Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🎓 What You'll Learn
          </h2>
          <p className="text-lg text-gray-600">
            Explore real-time web development through interactive examples
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {learningTopics.map((topic, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {topic.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {topic.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={topic.link}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Try it out →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🛠️ Built with Modern Technology
          </h2>
          <p className="text-lg text-gray-600">
            Learn industry-standard tools and frameworks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}
                >
                  {tech.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{tech.name}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Purpose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
          <div className="flex items-center mb-6">
            <CodeBracketIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Educational Purpose
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            This platform is designed as a comprehensive learning resource for
            developers who want to understand real-time web applications using
            Socket.IO.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Hands-on interactive examples
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Real-time multi-client testing
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Complete source code access
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              Production-ready patterns
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border border-green-100">
          <div className="flex items-center mb-6">
            <RocketLaunchIcon className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Key Features</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <BoltIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <span className="text-gray-700 font-medium">
                Real-time Communication
              </span>
            </div>
            <div className="flex items-center">
              <CpuChipIcon className="h-6 w-6 text-blue-500 mr-3" />
              <span className="text-gray-700 font-medium">
                Scalable Architecture
              </span>
            </div>
            <div className="flex items-center">
              <GlobeAltIcon className="h-6 w-6 text-green-500 mr-3" />
              <span className="text-gray-700 font-medium">
                Cross-platform Support
              </span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            Experience real-time features by opening multiple browser tabs or
            sharing the URL with friends to see live synchronization in action.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-12 rounded-2xl text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Your Real-time Journey
        </h2>
        <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
          Dive into the world of real-time web development. Each feature is
          designed to teach you important Socket.IO concepts through practical
          examples.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chat"
            className="px-8 py-4 bg-white text-blue-800 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            💬 Start with Chat
          </Link>
          <Link
            to="/broadcast"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg border-2 border-purple-400"
          >
            � Try Broadcasting
          </Link>
          <Link
            to="/counter"
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors duration-200 shadow-lg border-2 border-green-400"
          >
            � Test Synchronization
          </Link>
        </div>
      </div>
    </div>
  );
}
