import { useState } from 'react';

export default function CounterControls({ onSetValue, isLoading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSetValue = (e) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      onSetValue(value);
      setInputValue('');
    }
  };

  const quickSetButtons = [0, 10, 50, 100, -10, -50];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Advanced Controls
      </h3>

      {/* Set Specific Value */}
      <form onSubmit={handleSetValue} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Set Specific Value
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter number..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Set
          </button>
        </div>
      </form>

      {/* Quick Set Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Set Values
        </label>
        <div className="grid grid-cols-3 gap-2">
          {quickSetButtons.map((value) => (
            <button
              key={value}
              onClick={() => onSetValue(value)}
              disabled={isLoading}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
