'use client';

import { AirdropRow } from '@/components/airdrop-row';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { IAirdrop, useAirdrops } from '@/hooks/use-airdrops';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';

export default function Home() {
  const { connected } = useWallet();

  const airdrops = useAirdrops();

  const [filter, setFilter] = useState('');

  const filteredAirdrops = useMemo(() => {
    const filtered = airdrops.data
      ?.filter((airdrop: IAirdrop) => airdrop.pubkey.toString().toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => Number(b.distributor.startTs) - Number(a.distributor.startTs));

    if (connected) return filtered || [];

    return filtered?.slice(0, 50) || [];
  }, [airdrops.data, filter, connected]);

  if (airdrops.isLoading) return <Spinner />;
  if (airdrops.isError)
    return <h1 className="text-lg font-semibold text-red-500 text-center mt-4">Failed to load airdrops.</h1>;
  if (!airdrops.data?.length) return <h1 className="text-lg font-semibold text-center mt-4">No airdrops</h1>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-center my-4">
        {connected ? 'User Airdrops' : 'Recently created airdrops'}{' '}
      </h1>
      <Input
        placeholder="Filter by Airdrop ID"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full md:w-1/2 mb-4"
      />

      <div className="grid grid-cols-7 gap-4 text-sm text-muted-foreground font-semibold mb-2">
        <div>Name</div>
        <div>Token</div>
        <div>Type</div>
        <div>No.Recipients</div>
        <div>Amount In Tokens</div>
        <div>User amount</div>
        <div />
      </div>

      {filteredAirdrops.map((airdrop: IAirdrop) => {
        return <AirdropRow airdrop={airdrop} key={airdrop.pubkey.toString()} />;
      })}
    </div>
  );
}
