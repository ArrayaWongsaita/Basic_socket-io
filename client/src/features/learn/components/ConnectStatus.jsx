export default function ConnectStatus({ active, socketID }) {
  return (
    <>
      <h1
        className={`text-2xl font-bold mb-4 ${
          active ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {active ? '🟢 Connected' : '🔴 Disconnected'}
      </h1>
      <p className="text-gray-600 mb-6">
        Socket ID: <span className="font-mono">{socketID || '-'}</span>
      </p>
    </>
  );
}
