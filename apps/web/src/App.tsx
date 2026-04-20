import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import CalendarPage from './pages/CalendarPage';
import InboxPage from './pages/InboxPage';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';
import AdminTheme from './pages/AdminTheme';
import AdminSubscription from './pages/AdminSubscription';
import AdminApprovals from './pages/AdminApprovals';
import AdminLanguages from './pages/AdminLanguages';
import AdminContactMessages from './pages/AdminContactMessages';
import ContactSupport from './pages/ContactSupport';
import ChatBot from './components/ChatBot';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuthStore();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, loading, isAdmin } = useAuthStore();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuthStore();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter basename="/newswalla">
      <Toaster position="top-right" />
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactSupport />} />

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/theme" element={<AdminRoute><AdminTheme /></AdminRoute>} />
          <Route path="/admin/subscription" element={<AdminRoute><AdminSubscription /></AdminRoute>} />
          <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
          <Route path="/admin/languages" element={<AdminRoute><AdminLanguages /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminContactMessages /></AdminRoute>} />
        </Route>
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}
