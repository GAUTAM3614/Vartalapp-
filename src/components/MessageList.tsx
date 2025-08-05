import React, { useEffect, useRef, useState } from 'react';
import { Message, User } from '../types';
import { format, isToday, isYesterday } from 'date-fns';
import { MessageReactions } from './MessageReactions';
import { MoreHorizontal, Edit, Trash2, Reply } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUser, 
  onAddReaction, 
  onRemoveReaction, 
  onEditMessage, 
  onDeleteMessage 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'HH:mm')}`;
    } else {
      return format(timestamp, 'MMM dd, HH:mm');
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = format(message.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups).map(([date, msgs]) => ({
      date: new Date(date),
      messages: msgs,
    }));
  };

  const formatDateHeader = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  const handleEditStart = (message: Message) => {
    setEditingMessage(message.id);
    setEditContent(message.content);
  };

  const handleEditSave = (messageId: string) => {
    if (editContent.trim() && editContent !== messages.find(m => m.id === messageId)?.content) {
      onEditMessage(messageId, editContent.trim());
    }
    setEditingMessage(null);
    setEditContent('');
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
    setEditContent('');
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <div className="text-lg font-medium mb-2">No messages yet</div>
          <div className="text-sm">Start a conversation by sending a message!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
      {messageGroups.map(({ date, messages: groupMessages }) => (
        <div key={format(date, 'yyyy-MM-dd')}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full font-medium">
              {formatDateHeader(date)}
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            {groupMessages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              const showAvatar = index === 0 || 
                groupMessages[index - 1].senderId !== message.senderId;

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 animate-fade-in group ${
                    isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                  onMouseEnter={() => setHoveredMessage(message.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    showAvatar ? 'visible' : 'invisible'
                  }`}>
                    {!isCurrentUser && (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700">
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg relative ${
                    isCurrentUser ? 'ml-auto' : 'mr-auto'
                  }`}>
                    {/* Sender name and time */}
                    {showAvatar && !isCurrentUser && (
                      <div className="text-sm text-gray-600 mb-1 px-1">
                        {message.senderName}
                      </div>
                    )}

                    <div className={`px-4 py-3 rounded-2xl relative ${
                      isCurrentUser
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}>
                      {editingMessage === message.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-transparent border border-gray-300 rounded px-2 py-1 text-gray-900 resize-none"
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleEditSave(message.id);
                              } else if (e.key === 'Escape') {
                                handleEditCancel();
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2 text-xs">
                            <button
                              onClick={() => handleEditSave(message.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="break-words">{message.content}</div>
                          {message.edited && (
                            <div className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                            }`}>
                              (edited)
                            </div>
                          )}
                        </>
                      )}

                      {/* Message actions */}
                      {hoveredMessage === message.id && editingMessage !== message.id && (
                        <div className={`absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isCurrentUser ? 'right-0 -translate-x-2' : 'left-0 translate-x-2'
                        } -translate-y-8`}>
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex">
                            <button
                              onClick={() => onAddReaction(message.id, '👍')}
                              className="p-1 hover:bg-gray-100 text-sm"
                              title="Add reaction"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => onAddReaction(message.id, '❤️')}
                              className="p-1 hover:bg-gray-100 text-sm"
                              title="Add reaction"
                            >
                              ❤️
                            </button>
                            <button
                              onClick={() => onAddReaction(message.id, '😂')}
                              className="p-1 hover:bg-gray-100 text-sm"
                              title="Add reaction"
                            >
                              😂
                            </button>
                            {isCurrentUser && (
                              <>
                                <button
                                  onClick={() => handleEditStart(message)}
                                  className="p-1 hover:bg-gray-100 text-gray-600"
                                  title="Edit message"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => onDeleteMessage(message.id)}
                                  className="p-1 hover:bg-gray-100 text-red-600"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <MessageReactions
                        reactions={message.reactions}
                        currentUserId={currentUser?.id || ''}
                        onAddReaction={(emoji) => onAddReaction(message.id, emoji)}
                        onRemoveReaction={(emoji) => onRemoveReaction(message.id, emoji)}
                      />
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 mt-1 px-1 ${
                      isCurrentUser ? 'text-right' : 'text-left'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};