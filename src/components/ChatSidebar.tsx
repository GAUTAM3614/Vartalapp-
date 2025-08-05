import React from 'react';
import { ChatRoom, User } from '../types';
import { Users, Hash, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  currentUser: User | null;
  isConnected: boolean;
  onRoomSelect: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  activeRoom,
  currentUser,
  isConnected,
  onRoomSelect,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Vartalapp</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        
        {/* Current User */}
        {currentUser && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser.avatar || currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{currentUser.name}</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Channels
          </h2>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                  activeRoom?.id === room.id
                    ? 'bg-primary-50 border border-primary-200 text-primary-900'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-md ${
                      activeRoom?.id === room.id
                        ? 'bg-primary-100'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Hash className={`w-4 h-4 ${
                        activeRoom?.id === room.id
                          ? 'text-primary-600'
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{room.name}</div>
                      {room.lastMessage && (
                        <div className="text-sm text-gray-500 truncate">
                          {room.lastMessage.senderName}: {room.lastMessage.content}
                        </div>
                      )}
                    </div>
                  </div>
                  {room.unreadCount > 0 && (
                    <div className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                    </div>
                  )}
                </div>
                {room.lastMessage && (
                  <div className="text-xs text-gray-400 mt-1 ml-11">
                    {formatDistanceToNow(room.lastMessage.timestamp, { addSuffix: true })}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Online Users */}
        {activeRoom && (
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online ({activeRoom.participants.filter(u => u.isOnline).length})
            </h3>
            <div className="space-y-2">
              {activeRoom.participants
                .filter(user => user.isOnline)
                .map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-700 relative">
                      {user.avatar || user.name.charAt(0).toUpperCase()}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};