import React, { useEffect, useRef } from 'react';
import { Message, User } from '../types';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
                  className={`flex items-end gap-3 animate-fade-in ${
                    isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
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
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    isCurrentUser ? 'ml-auto' : 'mr-auto'
                  }`}>
                    {/* Sender name and time */}
                    {showAvatar && !isCurrentUser && (
                      <div className="text-sm text-gray-600 mb-1 px-1">
                        {message.senderName}
                      </div>
                    )}

                    <div className={`px-4 py-3 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}>
                      <div className="break-words">{message.content}</div>
                      {message.edited && (
                        <div className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          (edited)
                        </div>
                      )}
                    </div>

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