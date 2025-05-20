import { SOLANA_RPC, STREAMFLOW_DISTRIBUTOR_DATA_SIZE, STREAMFLOW_PROGRAM_ID } from '@/config/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { MerkleDistributor, MerkleDistributorJSON } from '@streamflow/distributor/solana';
import { useQuery } from '@tanstack/react-query';

export type IAirdrop = {
  pubkey: PublicKey;
  distributor: MerkleDistributorJSON;
};

const fetchAirdrops = async (): Promise<IAirdrop[]> => {
  const connection = new Connection(SOLANA_RPC, 'confirmed');

  const accounts = await connection.getProgramAccounts(STREAMFLOW_PROGRAM_ID, {
    filters: [{ dataSize: STREAMFLOW_DISTRIBUTOR_DATA_SIZE }],
  });

  return accounts.map((account) => {
    return { distributor: MerkleDistributor.decode(account.account.data).toJSON(), pubkey: account.pubkey };
  });
};

export const useAirdrops = () => {
  const { connected } = useWallet();

  return useQuery<IAirdrop[]>({
    queryKey: ['airdrops'],
    enabled: !!connected,
    queryFn: fetchAirdrops,
    staleTime: 1000 * 60, // 1 minute
  });
};
