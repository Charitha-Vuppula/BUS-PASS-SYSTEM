import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardLayout from './components/DashboardLayout';
import UserDashboard from './pages/UserDashboard';
import ApplyPassPage from './pages/ApplyPassPage';
import PaymentPage from './pages/PaymentPage';
import DigitalPassPage from './pages/DigitalPassPage';
import RenewPassPage from './pages/RenewPassPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ReportProblemPage from './pages/ReportProblemPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    if (role === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/apply" element={<ApplyPassPage />} />
          <Route path="/payment/:passId" element={<PaymentPage />} />
          <Route path="/pass" element={<DigitalPassPage />} />
          <Route path="/renew" element={<RenewPassPage />} />
          <Route path="/profile" element={<ProfileSettingsPage />} />
          <Route path="/report" element={<ReportProblemPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute role="admin"><AdminDashboard view="analytics" /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute role="admin"><AdminDashboard view="requests" /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
