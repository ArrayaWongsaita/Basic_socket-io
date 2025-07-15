import { useState, useEffect } from 'react';

export default function CounterHistory({ count }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Add new entry to history when count changes
    if (history.length === 0 || history[0].value !== count) {
      const newEntry = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        value: count,
        timestamp: new Date(),
      };

      setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
    }
  }, [count, history]);

  if (history.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Counter History
        </h3>
        <p className="text-sm text-gray-500 text-center">No history yet...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">
          Counter History ({history.length})
        </h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="px-6 py-3 border-b border-gray-100 last:border-b-0 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="text-lg font-mono font-medium text-gray-900">
                {entry.value}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {entry.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
