import { ClaimantMetaData } from '@/types/airdrop';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export const useClaimantMeta = (airdropPubkey: string | undefined, walletAddress: string | undefined) => {
  return useQuery<ClaimantMetaData | null>({
    queryKey: ['user-metadata', airdropPubkey, walletAddress],
    queryFn: () => fetchClaimantMetadata(airdropPubkey!, walletAddress!),
    enabled: !!airdropPubkey && !!walletAddress,
  });
};
