'use client';

import { useMarketplacePreloader } from '../hooks/useMarketplaceCache';

interface MarketplacePreloaderProps {
  children: React.ReactNode;
}

export default function MarketplacePreloader({ children }: MarketplacePreloaderProps) {
  useMarketplacePreloader();
  
  return <>{children}</>;
}
