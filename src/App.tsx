// ... existing code ...
import { useChat } from './hooks/useChat';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

function App() {
  const {
    currentUser,
    activeRoom,
    rooms,
    isConnected,
    sendMessage,
    selectRoom,
  } = useChat();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        currentUser={currentUser}
        isConnected={isConnected}
        onRoomSelect={selectRoom}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <ChatHeader activeRoom={activeRoom} />

        {/* Messages */}
        <MessageList 
          messages={activeRoom?.messages || []} 
          currentUser={currentUser} 
        />

        {/* Input */}
        <MessageInput 
          onSendMessage={sendMessage} 
          disabled={!isConnected || !activeRoom} 
        />
      </div>
    </div>
  );
}

export default App;