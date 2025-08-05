export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  status?: 'available' | 'busy' | 'away' | 'dnd';
  statusMessage?: string;
  isTyping?: boolean;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  editedAt?: Date;
  reactions?: Reaction[];
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  isPrivate?: boolean;
}

export interface ChatState {
  currentUser: User | null;
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  isConnected: boolean;
  typingUsers: { [roomId: string]: string[] };
  searchQuery: string;
  searchResults: Message[];
  isDarkMode: boolean;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
}