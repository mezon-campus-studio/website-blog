import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@public/layouts/PublicLayout';
import HomePage from '@public/pages/HomePage';
import LoginPage from '@public/pages/LoginPage';
import SignUpPage from '@public/pages/SignUpPage';

export default function PublicRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with layout */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<HomePage />} />
        </Route>

        {/* Auth routes - no layout */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
