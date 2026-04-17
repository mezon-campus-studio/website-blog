import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPages';
import { SignUpPage } from '../features/auth/pages/SignUpPages';
import HomePage from "../features/home/pages/HomePages";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Chạy trang home trước khi login vào */}
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />

      </Routes>
    </BrowserRouter>
  );
};