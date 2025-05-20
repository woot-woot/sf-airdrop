import { TokenInfo, TokenInfoResponse } from '@/types/airdrop';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTokenInfo = async (mint: string): Promise<TokenInfo | null> => {
  try {
    const response = await axios.post<TokenInfoResponse>(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}`, {
      cluster: 'devnet',
      addresses: [mint],
    });

    return response.data[mint];
  } catch {
    return null;
  }
};

export const useTokenInfo = (mint: string | undefined) => {
  return useQuery<TokenInfo | null>({
    queryKey: ['tokenInfo', mint],
    queryFn: () => {
      if (!mint) throw new Error('No mint provided');
      return fetchTokenInfo(mint);
    },
    enabled: !!mint,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
