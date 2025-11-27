// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Scanner from '../Scanner';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/scanner" element={<Scanner />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
