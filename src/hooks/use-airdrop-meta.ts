import { AirdropMetadata } from '@/types/airdrop';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

export const useAirdropMeta = (airdropPubkey: string | undefined) => {
  return useQuery<AirdropMetadata | null>({
    queryKey: ['airdrop-metadata', airdropPubkey],
    queryFn: () => fetchAirdropMetadata(airdropPubkey!),
    enabled: !!airdropPubkey,
  });
};
