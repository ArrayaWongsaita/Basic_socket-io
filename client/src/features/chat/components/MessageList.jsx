import { useState } from 'react';
import { formatDate } from '../../../shared/utils/helpers';
import { Button } from '../../../shared/components/ui';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function MessageList({
  messages,
  currentUser,
  onEditMessage,
  onDeleteMessage,
}) {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleEditStart = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleEditSave = async (messageId) => {
    if (editContent.trim()) {
      await onEditMessage(messageId, editContent.trim());
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleKeyPress = (e, messageId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave(messageId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-500">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start the conversation by sending the first message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.userId === currentUser.id;
        const showAvatar =
          index === 0 || messages[index - 1].userId !== message.userId;
        const showTimestamp =
          index === 0 ||
          new Date(message.createdAt).getTime() -
            new Date(messages[index - 1].createdAt).getTime() >
            300000; // 5 minutes

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex space-x-2 max-w-xs lg:max-w-md ${
                isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                  {message.user
                    ? `${message.user.firstName?.[0] || ''}${
                        message.user.lastName?.[0] || ''
                      }`
                    : '?'}
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1">
                {/* Timestamp and Name */}
                {showTimestamp && (
                  <div
                    className={`text-xs text-gray-500 mb-1 ${
                      isOwnMessage ? 'text-right' : 'text-left'
                    }`}
                  >
                    {message.user && !isOwnMessage && (
                      <span className="font-medium">
                        {message.user.firstName} {message.user.lastName}
                      </span>
                    )}
                    {message.user && !isOwnMessage && ' • '}
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`group relative ${isOwnMessage ? 'ml-8' : 'mr-8'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {editingMessageId === message.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, message.id)}
                          className="w-full p-2 border border-gray-300 rounded resize-none text-gray-900 text-sm"
                          rows="2"
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(message.id)}
                            className="text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}
                  </div>

                  {/* Message Actions */}
                  {isOwnMessage && editingMessageId !== message.id && (
                    <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(message)}
                          className="h-6 w-6 p-0 hover:bg-gray-200"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteMessage(message.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edited indicator */}
                {message.updatedAt !== message.createdAt && (
                  <div
                    className={`text-xs text-gray-400 mt-1 ${
                      isOwnMessage ? 'text-right' : 'text-left'
                    }`}
                  >
                    edited
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
