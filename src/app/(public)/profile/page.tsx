import ProfilePage from '@/features/profile/components/ProfilePage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata = {
  title: 'Profile | The Curator',
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
