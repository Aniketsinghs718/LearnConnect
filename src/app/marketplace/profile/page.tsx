
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { UserProfile } from '../../../components/marketplace/UserProfile';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: 'My Profile - Student Marketplace - LearnConnect',
  description: 'Manage your marketplace items and view your selling history',
};
