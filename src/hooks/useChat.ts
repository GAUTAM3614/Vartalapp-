import { useState, useCallback, useEffect } from 'react';
import { ChatState, ChatRoom, Message, User, Reaction } from '../types';
import { showMessageNotification } from '../utils/notifications';

// Mock data for demonstration
const mockUser: User = {
  id: 'user-1',
  name: 'You',
  isOnline: true,
};

const mockUsers: User[] = [
  {
    id: 'user-2',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
    isOnline: true,
  },
  {
    id: 'user-3',
    name: 'Bob Smith',
    avatar: '👨‍💻',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 'user-4',
    name: 'Carol Davis',
    avatar: '👩‍🎨',
    isOnline: true,
  },
];

const mockRooms: ChatRoom[] = [
  {
    id: 'room-1',
    name: 'General',
    description: 'General discussion',
    participants: [mockUser, ...mockUsers],
    messages: [
      {
        id: 'msg-1',
        content: 'Welcome to Vartalapp! 🎉',
        senderId: 'user-2',
        senderName: 'Alice Johnson',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        reactions: [
          { emoji: '👍', users: ['user-1', 'user-3'], count: 2 },
          { emoji: '🎉', users: ['user-1'], count: 1 }
        ],
      },
      {
        id: 'msg-2',
        content: 'This looks amazing! Great work on the UI.',
        senderId: 'user-3',
        senderName: 'Bob Smith',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
      },
      {
        id: 'msg-3',
        content: 'Thanks! I love the clean design and smooth animations.',
        senderId: 'user-4',
        senderName: 'Carol Davis',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
        reactions: [
          { emoji: '❤️', users: ['user-1', 'user-2'], count: 2 }
        ],
      },
    ],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'room-2',
    name: 'Development',
    description: 'Tech discussions',
    participants: [mockUser, mockUsers[0], mockUsers[1]],
    messages: [
      {
        id: 'msg-4',
        content: 'The new React 18 features are incredible!',
        senderId: 'user-2',
        senderName: 'Alice Johnson',
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
      },
    ],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    currentUser: mockUser,
    activeRoom: mockRooms[0],
    rooms: mockRooms,
    isConnected: true,
    typingUsers: {},
    searchQuery: '',
    searchResults: [],
    isDarkMode: false,
  });

  const sendMessage = useCallback((content: string) => {
    if (!chatState.activeRoom || !chatState.currentUser || !content.trim()) {
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      senderId: chatState.currentUser.id,
      senderName: chatState.currentUser.name,
      timestamp: new Date(),
      type: 'text',
    };

    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === prev.activeRoom?.id
          ? {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: newMessage,
            }
          : room
      ),
      activeRoom: prev.activeRoom
        ? {
            ...prev.activeRoom,
            messages: [...prev.activeRoom.messages, newMessage],
            lastMessage: newMessage,
          }
        : null,
    }));
  }, [chatState.activeRoom, chatState.currentUser]);

  const selectRoom = useCallback((roomId: string) => {
    setChatState(prev => {
      const room = prev.rooms.find(r => r.id === roomId);
      return room
        ? {
            ...prev,
            activeRoom: room,
            rooms: prev.rooms.map(r =>
              r.id === roomId ? { ...r, unreadCount: 0 } : r
            ),
          }
        : prev;
    });
  }, []);

  const setUserName = useCallback((name: string) => {
    setChatState(prev => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, name: name.trim() }
        : null,
    }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setChatState(prev => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, ...updates }
        : null,
    }));
  }, []);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!chatState.currentUser || !chatState.activeRoom) return;

    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === prev.activeRoom?.id
          ? {
              ...room,
              messages: room.messages.map(message =>
                message.id === messageId
                  ? {
                      ...message,
                      reactions: updateReactions(message.reactions || [], emoji, prev.currentUser!.id, true),
                    }
                  : message
              ),
            }
          : room
      ),
      activeRoom: prev.activeRoom
        ? {
            ...prev.activeRoom,
            messages: prev.activeRoom.messages.map(message =>
              message.id === messageId
                ? {
                    ...message,
                    reactions: updateReactions(message.reactions || [], emoji, prev.currentUser!.id, true),
                  }
                : message
            ),
          }
        : null,
    }));
  }, [chatState.currentUser, chatState.activeRoom]);

  const removeReaction = useCallback((messageId: string, emoji: string) => {
    if (!chatState.currentUser || !chatState.activeRoom) return;

    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === prev.activeRoom?.id
          ? {
              ...room,
              messages: room.messages.map(message =>
                message.id === messageId
                  ? {
                      ...message,
                      reactions: updateReactions(message.reactions || [], emoji, prev.currentUser!.id, false),
                    }
                  : message
              ),
            }
          : room
      ),
      activeRoom: prev.activeRoom
        ? {
            ...prev.activeRoom,
            messages: prev.activeRoom.messages.map(message =>
              message.id === messageId
                ? {
                    ...message,
                    reactions: updateReactions(message.reactions || [], emoji, prev.currentUser!.id, false),
                  }
                : message
            ),
          }
        : null,
    }));
  }, [chatState.currentUser, chatState.activeRoom]);

  const setTyping = useCallback((isTyping: boolean) => {
    if (!chatState.activeRoom || !chatState.currentUser) return;

    setChatState(prev => ({
      ...prev,
      typingUsers: {
        ...prev.typingUsers,
        [prev.activeRoom!.id]: isTyping
          ? [...(prev.typingUsers[prev.activeRoom!.id] || []), prev.currentUser!.name]
          : (prev.typingUsers[prev.activeRoom!.id] || []).filter(name => name !== prev.currentUser!.name),
      },
    }));

    if (isTyping) {
      setTimeout(() => {
        setChatState(current => ({
          ...current,
          typingUsers: {
            ...current.typingUsers,
            [chatState.activeRoom!.id]: (current.typingUsers[chatState.activeRoom!.id] || [])
              .filter(name => name !== chatState.currentUser!.name),
          },
        }));
      }, 3000);
    }
  }, [chatState.activeRoom, chatState.currentUser]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!chatState.activeRoom) return;

    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === prev.activeRoom?.id
          ? {
              ...room,
              messages: room.messages.map(message =>
                message.id === messageId
                  ? {
                      ...message,
                      content: newContent,
                      edited: true,
                      editedAt: new Date(),
                    }
                  : message
              ),
            }
          : room
      ),
      activeRoom: prev.activeRoom
        ? {
            ...prev.activeRoom,
            messages: prev.activeRoom.messages.map(message =>
              message.id === messageId
                ? {
                    ...message,
                    content: newContent,
                    edited: true,
                    editedAt: new Date(),
                  }
                : message
            ),
          }
        : null,
    }));
  }, [chatState.activeRoom]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!chatState.activeRoom) return;

    setChatState(prev => ({
      ...prev,
      rooms: prev.rooms.map(room =>
        room.id === prev.activeRoom?.id
          ? {
              ...room,
              messages: room.messages.filter(message => message.id !== messageId),
            }
          : room
      ),
      activeRoom: prev.activeRoom
        ? {
            ...prev.activeRoom,
            messages: prev.activeRoom.messages.filter(message => message.id !== messageId),
          }
        : null,
    }));
  }, [chatState.activeRoom]);

  // Simulate receiving messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomMessages = [
          "That's a great point!",
          "I agree with that approach.",
          "Has anyone tried the new update?",
          "Looking forward to the next release.",
          "The performance improvements are noticeable.",
          "Great job on the latest features!",
          "Anyone free for a quick call?",
          "I'll take a look at that later.",
        ];
        
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          content: randomMessage,
          senderId: randomUser.id,
          senderName: randomUser.name,
          timestamp: new Date(),
          type: 'text',
        };

        setChatState(prev => ({
          ...prev,
          rooms: prev.rooms.map(room =>
            room.id === 'room-1' // Add to general room
              ? {
                  ...room,
                  messages: [...room.messages, newMessage],
                  lastMessage: newMessage,
                  unreadCount: room.id === prev.activeRoom?.id ? 0 : room.unreadCount + 1,
                }
              : room
          ),
          activeRoom: prev.activeRoom?.id === 'room-1'
            ? {
                ...prev.activeRoom,
                messages: [...prev.activeRoom.messages, newMessage],
                lastMessage: newMessage,
              }
            : prev.activeRoom,
        }));

        setChatState(current => {
          // Show notification if not in active room or window is not focused
          const room = current.rooms.find(r => r.id === 'room-1');
          if (room && (current.activeRoom?.id !== 'room-1' || document.hidden)) {
            showMessageNotification(randomUser.name, randomMessage, room.name);
          }
          return current;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...chatState,
    sendMessage,
    selectRoom,
    setUserName,
    updateUser,
    addReaction,
    removeReaction,
    setTyping,
    editMessage,
    deleteMessage,
  };
};

// Helper function to update reactions
const updateReactions = (reactions: Reaction[], emoji: string, userId: string, add: boolean): Reaction[] => {
  const existingReaction = reactions.find(r => r.emoji === emoji);
  
  if (existingReaction) {
    if (add) {
      if (!existingReaction.users.includes(userId)) {
        return reactions.map(r =>
          r.emoji === emoji
            ? { ...r, users: [...r.users, userId], count: r.count + 1 }
            : r
        );
      }
    } else {
      const newUsers = existingReaction.users.filter(id => id !== userId);
      if (newUsers.length === 0) {
        return reactions.filter(r => r.emoji !== emoji);
      }
      return reactions.map(r =>
        r.emoji === emoji
          ? { ...r, users: newUsers, count: newUsers.length }
          : r
      );
    }
  } else if (add) {
    return [...reactions, { emoji, users: [userId], count: 1 }];
  }
  
  return reactions;
};