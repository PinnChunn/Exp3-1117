import React from 'react';
import { User, LogOut } from 'lucide-react';

interface UserProfileProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function UserProfile({ isAuthenticated, onLogin, onLogout }: UserProfileProps) {
  if (!isAuthenticated) {
    return (
      <button
        onClick={onLogin}
        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
          <User className="w-4 h-4" />
        </div>
        <span className="text-gray-700">Account</span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}