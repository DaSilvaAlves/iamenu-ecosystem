
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import StaffDashboard from './views/StaffDashboard';
import StaffShifts from './views/StaffShifts';
import ShiftDetails from './views/ShiftDetails';
import RequestTimeOff from './views/RequestTimeOff';
import Onboarding from './views/Onboarding';
import Announcements from './views/Announcements';
import ManagerDashboard from './views/ManagerDashboard';
import ManagerCreateShift from './views/ManagerCreateShift';
import ManagerOnboarding from './views/ManagerOnboarding';
import ManagerCreateAnnouncement from './views/ManagerCreateAnnouncement';
import { User, UserRole } from './types';
import { currentUser as initialUser } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser({
      ...initialUser,
      role,
      name: role === 'MANAGER' ? 'Gestor Admin' : 'João Silva'
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          {!user ? (
            <Route path="*" element={<Login />} />
          ) : (
            <>
              {user.role === 'STAFF' ? (
                <>
                  <Route path="/" element={<StaffDashboard />} />
                  <Route path="/shifts" element={<StaffShifts />} />
                  <Route path="/shift/:id" element={<ShiftDetails />} />
                  <Route path="/time-off" element={<RequestTimeOff />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/announcements" element={<Announcements />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<ManagerDashboard />} />
                  <Route path="/manager/create-shift" element={<ManagerCreateShift />} />
                  <Route path="/manager/onboarding" element={<ManagerOnboarding />} />
                  <Route path="/manager/create-announcement" element={<ManagerCreateAnnouncement />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
