import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { TopBar, BottomNav } from './components/Navigation';
import { Home } from './pages/Home';
import { Report } from './pages/Report';
import { ItemDetail } from './pages/ItemDetail';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Notifications } from './pages/Notifications';
import { StaffDashboard } from './pages/StaffDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserRole } from './types';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Hide TopBar on ItemDetail for immersive view and Report page for cleanliness
  const hideTopBar = location.pathname.startsWith('/item/') || location.pathname === '/report' || location.pathname === '/login';
  const hideNav = location.pathname === '/login';
  // Hide Footer on Login because it has its own, and maybe ItemDetail
  const hideFooter = location.pathname === '/login';

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 flex justify-center transition-colors duration-300">
      <div className="w-full  min-h-screen bg-gray-50/50 dark:bg-gray-950 shadow-2xl relative transition-colors duration-300 flex flex-col">
        {!hideTopBar && <TopBar />}
        <main className="w-full flex-1">
            {children}
        </main>
        
        {!hideFooter && (
          <div className="py-6 text-center pb-28 md:pb-6">
             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                Google Developer Groups on Campus - USTP
             </p>
          </div>
        )}

        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role?: UserRole }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute role={UserRole.STAFF}><StaffDashboard /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;