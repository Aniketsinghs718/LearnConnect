
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { SellItemForm } from '../../../components/marketplace/SellItemForm';

export default function SellItemPage() {
  return (
    <ProtectedRoute>
      <SellItemForm />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: 'Sell Item - Student Marketplace - LearnConnect',
  description: 'List your stationary items for sale',
};
