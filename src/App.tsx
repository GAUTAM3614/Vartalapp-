import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { SearchModal } from './components/SearchModal';
import { TypingIndicator } from './components/TypingIndicator';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function ChatApp() {
  const {
    currentUser,
    activeRoom,
    rooms,
    isConnected,
    typingUsers,
    sendMessage,
    selectRoom,
    updateUser,
    addReaction,
    removeReaction,
    setTyping,
    editMessage,
    deleteMessage,
  } = useChat();
  
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const allMessages = rooms.flatMap(room => room.messages);
  const currentTypingUsers = activeRoom ? (typingUsers[activeRoom.id] || []) : [];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        currentUser={currentUser}
        isConnected={isConnected}
        onRoomSelect={selectRoom}
        onUpdateUser={updateUser}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <ChatHeader 
          activeRoom={activeRoom}
          onSearchClick={() => setShowSearchModal(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Messages */}
        <MessageList 
          messages={activeRoom?.messages || []} 
          currentUser={currentUser}
          onAddReaction={addReaction}
          onRemoveReaction={removeReaction}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
        />

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={currentTypingUsers} />

        {/* Input */}
        <MessageInput 
          onSendMessage={sendMessage} 
          disabled={!isConnected || !activeRoom}
          onTyping={setTyping}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        messages={allMessages}
        onMessageClick={(messageId) => {
          // Could implement scrolling to message here
          console.log('Navigate to message:', messageId);
        }}
      />
    </div>
  );
  }

function App() {
  return (
    <ThemeProvider>
      <ChatApp />
    </ThemeProvider>
  );
}

export default App;