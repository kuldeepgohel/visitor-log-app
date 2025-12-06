// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Scanner from '../Scanner';
import Login from '../pages/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import Register from '../pages/Register';
import ProtectedAdmin from '../components/ProtectedAdmin';
export default function AppRouter() {
  return (
    <Routes>
      <Route path='/register' element={<ProtectedAdmin><Register/></ProtectedAdmin>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>}/>
      <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
