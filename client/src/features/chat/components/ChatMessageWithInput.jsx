import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth';

export default function ChatMessageWitInput({ messages, onSendMessage }) {
  const { email } = useAuthStore((state) => state.user);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        Messages
        <span className="ml-auto text-sm font-normal text-gray-500">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </h3>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm">
                Start broadcasting to see messages here
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwnMessage = msg.sender === email;
            const isSystemMessage = ['error', 'system', 'alert'].includes(
              msg.type
            );

            if (isSystemMessage) {
              // System messages - centered
              return (
                <div key={i} className="flex justify-center">
                  <div
                    className={`px-3 py-2 rounded-full text-xs font-medium max-w-xs text-center ${
                      msg.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : msg.type === 'system'
                        ? 'bg-blue-100 text-blue-800'
                        : msg.type === 'alert'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.message || msg?.data || 'No content'}
                    {msg.timestamp && (
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Chat messages
            return (
              <div
                key={i}
                className={`flex ${
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    isOwnMessage ? 'order-2' : 'order-1'
                  }`}
                >
                  {/* Sender name (only for others' messages) */}
                  {!isOwnMessage && msg.sender && (
                    <div className="text-xs text-gray-500 mb-1 px-3">
                      {msg.sender}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {msg.message || msg?.data || 'No content'}
                    </p>

                    {/* Room tag */}
                    {msg.room && (
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isOwnMessage
                              ? 'bg-blue-400 text-blue-100'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          #{msg.room}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  {msg.timestamp && (
                    <div
                      className={`text-xs text-gray-500 mt-1 px-3 ${
                        isOwnMessage ? 'text-right' : 'text-left'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
