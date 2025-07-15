import { useState, useRef } from 'react';
import { Button } from '../../../shared/components/ui';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop();
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || disabled) return;

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    // Send message
    onSendMessage(message);
    setMessage('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <div className="flex-1">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              handleInputChange(e);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            onInput={adjustTextareaHeight}
            placeholder={disabled ? 'Connecting...' : 'Type a message...'}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[48px] max-h-[120px]"
            rows="1"
          />

          {/* Character count indicator */}
          {message.length > 900 && (
            <div className="absolute bottom-1 right-12 text-xs text-gray-400">
              {message.length}/1000
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled || message.length > 1000}
        className="h-12 w-12 p-0 rounded-lg flex-shrink-0"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
