'use client';

import { STREAMFLOW_DISTRIBUTOR_DATA_SIZE, STREAMFLOW_PROGRAM_ID } from '@/config/constants';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { MerkleDistributor, MerkleDistributorJSON } from '@streamflow/distributor/solana';
import { useQuery } from '@tanstack/react-query';

export type IAirdrop = {
  pubkey: PublicKey;
  distributor: MerkleDistributorJSON;
};

const fetchAirdrops = async (connection: Connection): Promise<IAirdrop[]> => {
  const accounts = await connection.getProgramAccounts(STREAMFLOW_PROGRAM_ID, {
    filters: [{ dataSize: STREAMFLOW_DISTRIBUTOR_DATA_SIZE }],
  });

  return accounts.map((account) => {
    const decoded = MerkleDistributor.decode(account.account.data).toJSON();
    return { distributor: decoded, pubkey: account.pubkey };
  });
};

export const useAirdrops = () => {
  const { connection } = useConnection();

  return useQuery<IAirdrop[]>({
    queryKey: ['airdrops'],
    queryFn: () => fetchAirdrops(connection),
    staleTime: 1000 * 60 * 5, // 5 minute
  });
};
