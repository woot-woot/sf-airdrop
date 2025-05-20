import { SOLANA_RPC, STREAMFLOW_CLOSEDCLAIM_DATA_SIZE, STREAMFLOW_PROGRAM_ID } from '@/config/constants';
import { IAirdrop } from '@/hooks/use-airdrops';
import { AirdropMetadata, ClaimantMetaData, ClaimStatusType, UserClaimStatus } from '@/types/airdrop';
import { Connection, PublicKey } from '@solana/web3.js';
import { ClaimStatus, getClaimantStatusPda, MerkleDistributor } from '@streamflow/distributor/solana';
import axios from 'axios';

export const fetchAirdrop = async (airdropPubkey: string): Promise<IAirdrop | null> => {
  try {
    const pubkey = new PublicKey(airdropPubkey);

    const connection = new Connection(SOLANA_RPC);

    const distributorRawData = await connection.getAccountInfo(new PublicKey(airdropPubkey));
    if (!distributorRawData) return null;

    return { distributor: MerkleDistributor.decode(distributorRawData.data).toJSON(), pubkey };
  } catch {
    return null;
  }
};

export const fetchAirdropMetadata = async (airdropPubkey: string): Promise<AirdropMetadata | null> => {
  try {
    const resp = await axios.get<AirdropMetadata>(
      `${process.env.NEXT_PUBLIC_STREAMLINE_API_URL}/v2/api/airdrops/${airdropPubkey}`,
    );
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status === 404) {
        console.warn(`fetchAirdropDetails -> 404 Not Found:`, data?.detail || 'Claimant does not exist');
      } else if (status === 422) {
        console.warn(`fetchAirdropDetails -> 422 Validation Error:`, data?.detail);
      } else {
        console.error(`fetchAirdropDetails -> Unhandled error:`, data);
      }
    } else {
      console.error('fetchAirdropDetails -> Unknown error', error);
    }
    return null;
  }
};

export const fetchClaimantMetadata = async (
  airdropPubkey: string,
  claimant: string,
): Promise<ClaimantMetaData | null> => {
  try {
    const resp = await axios.get<ClaimantMetaData>(
      `${process.env.NEXT_PUBLIC_STREAMLINE_API_URL}/v2/api/airdrops/${airdropPubkey}/claimants/${claimant}`,
    );
    return resp.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      if (status === 404) {
        console.warn(`fetchClaimantMetadata -> 404 Not Found:`, data?.detail || 'Claimant does not exist');
      } else if (status === 422) {
        console.warn(`fetchClaimantMetadata -> 422 Validation Error:`, data?.detail);
      } else {
        console.error(`fetchClaimantMetadata -> Unhandled error:`, data);
      }
    } else {
      console.error('fetchClaimantMetadata -> Unknown error', error);
    }
    return null;
  }
};

export const fetchUserClaimStatus = async (
  airdropPubkey: string,
  walletAddress: string,
): Promise<UserClaimStatus | null> => {
  try {
    const distributor = new PublicKey(airdropPubkey);
    const claimant = new PublicKey(walletAddress);

    const connection = new Connection(SOLANA_RPC);

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
