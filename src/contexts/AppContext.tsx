import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Gender, User, Host, Caller } from '@/types';

interface AppContextType {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  currentUser: User | Host | Caller | null;
  setCurrentUser: (user: User | Host | Caller | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  registrationData: Partial<User>;
  setRegistrationData: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<User | Host | Caller | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<User>>({});

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        registrationData,
        setRegistrationData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
