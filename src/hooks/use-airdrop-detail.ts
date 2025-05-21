'use client';

import { IAirdrop } from '@/hooks/use-airdrops';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { MerkleDistributor } from '@streamflow/distributor/solana';
import { useQuery } from '@tanstack/react-query';

export const fetchAirdrop = async (connection: Connection, airdropPubkey: string): Promise<IAirdrop | null> => {
  try {
    const pubkey = new PublicKey(airdropPubkey);

    const distributorRawData = await connection.getAccountInfo(new PublicKey(airdropPubkey));
    if (!distributorRawData) return null;

    return { distributor: MerkleDistributor.decode(distributorRawData.data).toJSON(), pubkey };
  } catch {
    return null;
  }
};

export const useAirdropDetail = (airdropPubkey: string | undefined) => {
  const { connection } = useConnection();

  return useQuery<IAirdrop | null>({
    queryKey: ['airdrop-detail', airdropPubkey],
    queryFn: () => fetchAirdrop(connection, airdropPubkey!),
    enabled: !!airdropPubkey,
  });
};
