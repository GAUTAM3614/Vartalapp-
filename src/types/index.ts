export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
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
}

export interface ChatState {
  currentUser: User | null;
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  isConnected: boolean;
}