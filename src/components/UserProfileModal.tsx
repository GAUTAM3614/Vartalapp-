import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { X, Edit3, Check, AlertCircle } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (updates: Partial<User>) => void;
}

const STATUS_OPTIONS = [
  { value: 'available', label: '🟢 Available', color: 'text-green-600' },
  { value: 'busy', label: '🔴 Busy', color: 'text-red-600' },
  { value: 'away', label: '🟡 Away', color: 'text-yellow-600' },
  { value: 'dnd', label: '⛔ Do not disturb', color: 'text-gray-600' },
] as const;

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus] = useState<'available' | 'busy' | 'away' | 'dnd'>('available');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const statusInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setStatusMessage(user.statusMessage || '');
      setStatus(user.status || 'available');
    }
  }, [user]);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingName]);

  useEffect(() => {
    if (editingStatus && statusInputRef.current) {
      statusInputRef.current.focus();
    }
  }, [editingStatus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSaveName = () => {
    if (name.trim() && name !== user?.name) {
      onUpdateUser({ name: name.trim() });
    }
    setEditingName(false);
  };

  const handleSaveStatus = () => {
    onUpdateUser({ 
      status,
      statusMessage: statusMessage.trim() 
    });
    setEditingStatus(false);
  };

  const handleStatusChange = (newStatus: typeof status) => {
    setStatus(newStatus);
    onUpdateUser({ status: newStatus });
  };

  if (!isOpen || !user) return null;

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold relative">
              {user.avatar || user.name.charAt(0).toUpperCase()}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${
                user.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveName();
                    } else if (e.key === 'Escape') {
                      setName(user.name);
                      setEditingName(false);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{user.name}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    status === option.value
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className={`font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Message
            </label>
            {editingStatus ? (
              <div className="flex items-center gap-2">
                <input
                  ref={statusInputRef}
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveStatus();
                    } else if (e.key === 'Escape') {
                      setStatusMessage(user.statusMessage || '');
                      setEditingStatus(false);
                    }
                  }}
                  placeholder="What's your status?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveStatus}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className={statusMessage ? 'text-gray-900' : 'text-gray-500 italic'}>
                  {statusMessage || 'No status message'}
                </span>
                <button
                  onClick={() => setEditingStatus(true)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Online Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {user.isOnline ? 'Online' : `Last seen ${user.lastSeen?.toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};