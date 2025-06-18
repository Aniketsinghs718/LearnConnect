import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { AdminPanel } from '../../components/features/admin/AdminPanel';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  );
}