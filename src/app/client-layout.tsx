'use client';

import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/sonner';
import { useWallet } from '@solana/wallet-adapter-react';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { useEffect, useMemo } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { select } = useWallet();

  useEffect(() => {
    select(PhantomWalletName);
  }, [select]);

  const content = useMemo(() => {
    return children;
  }, [children]);

  return (
    <div className="border-grid flex flex-1 flex-col min-h-screen">
      <AppHeader />
      <div className="container-wrapper flex-1 min-h-full flex">
        <div className="container flex-1 min-h-full min-w-full">
          <div className="w-full md:w-5/7 mx-auto">{content}</div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
