import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const user: User | null = clerkUser
    ? {
      id: clerkUser.id,
      name: clerkUser.fullName ?? clerkUser.username ?? 'User',
      email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
      role: (clerkUser.publicMetadata?.role as UserRole) ?? UserRole.STUDENT,
      avatarUrl: clerkUser.imageUrl,
    }
    : null;

  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading: !isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};