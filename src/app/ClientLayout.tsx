'use client';

import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/sonner';
import { useMemo } from 'react';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = useMemo(() => {
    return children;
  }, [children]);

  return (
    <div className="border-grid flex flex-1 flex-col min-h-screen">
      <AppHeader />
      <div className="container-wrapper flex-1 min-h-full flex">
        <div className="container flex-1 min-h-full min-w-full">{content}</div>
      </div>
      <Toaster />
    </div>
  );
}
