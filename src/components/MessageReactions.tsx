import React, { useState } from 'react';
import { Reaction } from '../types';
import { Plus } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

interface MessageReactionsProps {
  reactions: Reaction[];
  currentUserId: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: (emoji: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReactionClick = (reaction: Reaction) => {
    const userHasReacted = reaction.users.includes(currentUserId);
    if (userHasReacted) {
      onRemoveReaction(reaction.emoji);
    } else {
      onAddReaction(reaction.emoji);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(emoji);
  };

  if (reactions.length === 0 && !showEmojiPicker) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2 relative">
      {reactions.map((reaction) => {
        const userHasReacted = reaction.users.includes(currentUserId);
        return (
          <button
            key={reaction.emoji}
            onClick={() => handleReactionClick(reaction)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              userHasReacted
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
            title={`${reaction.users.length} reaction${reaction.users.length !== 1 ? 's' : ''}`}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span className="font-medium">{reaction.count}</span>
          </button>
        );
      })}
      
      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          title="Add reaction"
        >
          <Plus className="w-3 h-3" />
        </button>
        
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          position="top"
        />
      </div>
    </div>
  );
};