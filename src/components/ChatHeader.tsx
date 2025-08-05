import React from 'react';
import { ChatRoom } from '../types';
import { Hash, Users, MoreHorizontal, Search, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  activeRoom: ChatRoom | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ activeRoom }) => {
  if (!activeRoom) {
    return (
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-center">
        <div className="text-gray-500">Select a channel to start chatting</div>
      </div>
    );
  }

  const onlineCount = activeRoom.participants.filter(p => p.isOnline).length;

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Room info */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Hash className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{activeRoom.name}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {onlineCount} online
            </div>
            {activeRoom.description && (
              <div className="hidden sm:block">
                {activeRoom.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Search messages"
        >
          <Search className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voice call"
        >
          <Phone className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Video call"
        >
          <Video className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};