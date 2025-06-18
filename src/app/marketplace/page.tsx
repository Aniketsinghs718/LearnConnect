
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { MarketplaceHome } from '../../components/marketplace/MarketplaceHome';

export default function MarketplacePage() {
  return (
    <ProtectedRoute>
      <MarketplaceHome />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: 'Student Marketplace - LearnConnect',
  description: 'Buy and sell stationary items with fellow students',
};
