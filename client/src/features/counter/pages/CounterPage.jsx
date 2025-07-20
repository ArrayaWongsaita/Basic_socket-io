import { useEffect } from 'react';
import { useCounterStore } from '../stores/counterStore';
import SocketStatus from '../../../shared/components/SocketStatus';

export default function CounterPage() {
  const {
    count,
    counterStatus,
    counterError,
    listenCounterEvents,
    removeCounterEvents,
    increment,
    decrement,
    clearStatus,
  } = useCounterStore();

  useEffect(() => {
    listenCounterEvents();
    return () => removeCounterEvents();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <SocketStatus />
      <h2>Counter Page</h2>
      <div style={{ fontSize: 32, margin: '20px 0' }}>Count: {count}</div>
      <button
        onClick={increment}
        style={{ padding: '8px 16px', marginRight: 10 }}
      >
        Increment
      </button>
      <button onClick={decrement} style={{ padding: '8px 16px' }}>
        Decrement
      </button>
      <div style={{ marginTop: 20 }}>
        <h4>Status</h4>
        <button onClick={clearStatus} style={{ marginBottom: 10 }}>
          Clear Status
        </button>
        <div>{counterStatus && <div>Status: {counterStatus}</div>}</div>
        <div>
          {counterError && (
            <div style={{ color: 'red' }}>Error: {counterError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
