import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@admin/layouts/AdminLayout';
import AdminDashboard from '@admin/pages/AdminDashboard';

export default function AdminRoutes() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
