import { useState, useCallback, useEffect } from 'react';
import { ChatState, ChatRoom, Message, User } from '../types';

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
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...chatState,
    sendMessage,
    selectRoom,
    setUserName,
  };
};