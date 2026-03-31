import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import AdminOrders from './pages/AdminOrders'
import ProductionView from './pages/ProductionView'
import FinanceDashboard from './pages/FinanceDashboard'
import PaymentScreen from './pages/PaymentScreen'
import Login from './pages/Login'
import Register from './pages/Register'

// Simple Auth Protection
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }
        }}
      />
      
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        <Route path="/production" element={<ProtectedRoute><ProductionView /></ProtectedRoute>} />
        <Route path="/finance" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentScreen /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
