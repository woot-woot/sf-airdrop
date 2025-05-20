'use client';

import { AirdropRow } from '@/components/airdrop-row';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IAirdrop, useAirdrops } from '@/hooks/use-airdrops';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';

export default function Home() {
  const { connected } = useWallet();

  const airdrops = useAirdrops();
  const [filter, setFilter] = useState('');

  const filteredAirdrops = useMemo(() => {
    return (
      airdrops.data?.filter((airdrop: IAirdrop) =>
        airdrop.pubkey.toString().toLowerCase().includes(filter.toLowerCase()),
      ) ?? []
    );
  }, [airdrops.data, filter]);

  if (!connected) return <h1 className="text-lg font-semibold text-center mt-4">Connect to see airdrops!</h1>;
  if (airdrops.isLoading) return <h1 className="text-lg font-semibold text-center mt-4">Loading ...</h1>;
  if (airdrops.isError)
    return <h1 className="text-lg font-semibold text-red-500 text-center mt-4">Failed to load airdrops.</h1>;
  if (!airdrops.data?.length) return <h1 className="text-lg font-semibold text-center mt-4">No airdrops</h1>;

  return (
    <>
      <Input
        placeholder="Filter by Airdrop ID"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full md:w-1/2 mb-2"
      />
      <Table>
        <TableCaption>A list of recent airdrops</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Number of recipients (claimed/total)</TableHead>
            <TableHead>Amount in tokens (claimed/Total)</TableHead>
            <TableHead>Logged-in user amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAirdrops.map((airdrop: IAirdrop) => {
            return <AirdropRow airdrop={airdrop} key={airdrop.pubkey.toString()} />;
          })}
        </TableBody>
      </Table>
    </>
  );
}
