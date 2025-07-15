export default function ChatWelcome() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to Chat
        </h2>
        <p className="text-gray-600 mb-4">
          Select a room from the sidebar to start chatting
        </p>
        <p className="text-sm text-gray-500">
          You can create a new room or join an existing one
        </p>
      </div>
    </div>
  );
}
