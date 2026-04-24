import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './modules/admin/pages/AdminLogin';
import AdminDashboard from './modules/admin/pages/AdminDashboard';
import AdminVendorList from './modules/admin/pages/AdminVendorList';
import AdminSubscriptionList from './modules/admin/pages/AdminSubscriptionList';
import VendorLogin from './modules/vendor/pages/VendorLogin';
import VendorDashboard from './modules/vendor/pages/VendorDashboard';
import VendorAITraining from './modules/vendor/pages/VendorAITraining';
import VendorLeads from './modules/vendor/pages/VendorLeads.jsx';
import LeadDetails from './modules/vendor/pages/LeadDetails.jsx';
import VendorAutomationRules from './modules/vendor/pages/VendorAutomationRules.jsx';
import useAuthStore from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/vendor/login'} replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminVendorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminSubscriptionList />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/ai-training"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorAITraining />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/rules"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorAutomationRules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/leads"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorLeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/leads/:id"
          element={
            <ProtectedRoute allowedRole="vendor">
              <LeadDetails />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
