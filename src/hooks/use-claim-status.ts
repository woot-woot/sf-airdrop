'use client';

import { STREAMFLOW_CLOSEDCLAIM_DATA_SIZE, STREAMFLOW_PROGRAM_ID } from '@/config/constants';
import { ClaimantMetaData, ClaimStatusType, UserClaimStatus } from '@/types/airdrop';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { ClaimStatus, getClaimantStatusPda } from '@streamflow/distributor/solana';
import { useQuery } from '@tanstack/react-query';

export const fetchUserClaimStatus = async (
  connection: Connection,
  airdropPubkey: string,
  walletAddress: string,
): Promise<UserClaimStatus | null> => {
  try {
    const distributor = new PublicKey(airdropPubkey);
    const claimant = new PublicKey(walletAddress);

    const claimStatusPda = await getClaimantStatusPda(STREAMFLOW_PROGRAM_ID, distributor, claimant);
    const claimRawData = await connection.getAccountInfo(claimStatusPda);

    if (claimRawData === null) return null;

    if (claimRawData.data.byteLength === STREAMFLOW_CLOSEDCLAIM_DATA_SIZE) {
      return { status: ClaimStatusType.CLOSED };
    }

    return { status: ClaimStatusType.OPEN, data: ClaimStatus.decode(claimRawData.data).toJSON() };
  } catch (error) {
    console.error('fetchUserClaimStatus -> failed', error);
    return null;
  }
};

export const useClaimStatus = (
  airdropPubkey: string | undefined,
  walletAddress: string | undefined,
  claimantMeta: ClaimantMetaData | null | undefined,
) => {
  const { connection } = useConnection();

  return useQuery<UserClaimStatus | null>({
    queryKey: ['user-claim-status', airdropPubkey, walletAddress],
    queryFn: () => fetchUserClaimStatus(connection, airdropPubkey!, walletAddress!),
    enabled: !!airdropPubkey && !!walletAddress && !!claimantMeta,
  });
};
