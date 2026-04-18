import AdminLayout from '@admin/layouts/AdminLayout';
import AdminDashboard from '@admin/pages/AdminDashboard';

export default function AdminApp() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
