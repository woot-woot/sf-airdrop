'use client';

import { useWallet } from '@solana/wallet-adapter-react';

export default function AirdropDetail() {
  const { connected } = useWallet();

  if (!connected) return <h1 className="text-lg font-semibold">Connect to see airdrops!</h1>;

  return <div>Hello</div>;
}
