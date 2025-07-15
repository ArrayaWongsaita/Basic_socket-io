import { useState } from 'react';
import { Button } from '../../../shared/components/ui';
import {
  SpeakerWaveIcon,
  UserIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const broadcastTypes = [
  { value: 'info', label: 'Info', color: 'bg-blue-500' },
  { value: 'success', label: 'Success', color: 'bg-green-500' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-500' },
  { value: 'error', label: 'Error', color: 'bg-red-500' },
];

export default function BroadcastPanel({
  onlineUsers,
  onSendToAll,
  onSendToUser,
  onSendToUsers,
  onSendToRoom,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('info');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;

    const messageTitle = title.trim() || getDefaultTitle();

    switch (activeTab) {
      case 'all':
        onSendToAll(message, type, messageTitle);
        break;
      case 'user':
        if (targetUserId) {
          onSendToUser(targetUserId, message, type, messageTitle);
        }
        break;
      case 'users':
        if (selectedUsers.length > 0) {
          onSendToUsers(selectedUsers, message, type, messageTitle);
        }
        break;
      case 'room':
        if (roomId.trim()) {
          onSendToRoom(roomId.trim(), message, type, messageTitle);
        }
        break;
    }

    // Reset form
    setMessage('');
    setTitle('');
    setSelectedUsers([]);
    setTargetUserId('');
    setRoomId('');
  };

  const getDefaultTitle = () => {
    switch (activeTab) {
      case 'all':
        return 'Broadcast to All';
      case 'user':
        return 'Private Message';
      case 'users':
        return 'Group Message';
      case 'room':
        return 'Room Alert';
      default:
        return 'Broadcast';
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const tabs = [
    { id: 'all', label: 'All Users', icon: SpeakerWaveIcon },
    { id: 'user', label: 'Single User', icon: UserIcon },
    { id: 'users', label: 'Multiple Users', icon: UserGroupIcon },
    { id: 'room', label: 'Room', icon: BuildingOfficeIcon },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Broadcast Center
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Send alerts and messages to users via Socket.IO
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Message Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <div className="flex space-x-2">
            {broadcastTypes.map((broadcastType) => (
              <button
                key={broadcastType.value}
                onClick={() => setType(broadcastType.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                  type === broadcastType.value
                    ? `${broadcastType.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    type === broadcastType.value
                      ? 'bg-white'
                      : broadcastType.color
                  }`}
                />
                <span>{broadcastType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={getDefaultTitle()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Target Selection */}
        {activeTab === 'user' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a user...</option>
              {onlineUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Users ({selectedUsers.length} selected)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
              {onlineUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-900">
                    {user.firstName} {user.lastName} ({user.email})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID (e.g., general, random, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your broadcast message..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length}/1000 characters
          </p>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={
            !message.trim() ||
            (activeTab === 'user' && !targetUserId) ||
            (activeTab === 'users' && selectedUsers.length === 0) ||
            (activeTab === 'room' && !roomId.trim()) ||
            message.length > 1000
          }
          className="w-full"
        >
          Send {getDefaultTitle()}
        </Button>
      </div>
    </div>
  );
}
