// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Import các page cũ của bạn (Auth)
import LoginPages from '../features/auth/pages/LoginPages';
import SignUpPages from '../features/auth/pages/SignUpPages';

// 2. Import các page mới vừa tạo (Home & Admin)
import { HomePage } from '../features/home/pages/HomePage';
import { DashboardPage } from '../features/admin/pages/DashboardPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (normal User) --- */}
      <Route path="/" element={<HomePage />} />

      {/* --- AUTH ROUTES (Phần code cũ của bạn, giữ nguyên) --- */}
      <Route path="/login" element={<LoginPages />} />
      <Route path="/signup" element={<SignUpPages />} />

      {/* --- PROTECTED ROUTES (Writer/Admin --- */}
      <Route path="/admin" element={<DashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;