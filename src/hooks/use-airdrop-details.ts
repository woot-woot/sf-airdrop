import { IAirdrop } from '@/hooks/use-airdrops';
import { fetchAirdrop, fetchAirdropMetadata } from '@/services/airdrop';
import { AirdropMetadata } from '@/types/airdrop';
import { useQuery } from '@tanstack/react-query';

export const useAirdropDetails = (airdropPubkey: string | undefined) => {
  const {
    data: airdrop,
    isLoading: loadingDetail,
    error: detailError,
  } = useQuery<IAirdrop | null>({
    queryKey: ['airdrop-detail', airdropPubkey],
    queryFn: () => fetchAirdrop(airdropPubkey!),
    enabled: !!airdropPubkey,
  });

  const {
    data: metadata,
    isLoading: loadingMeta,
    error: metaError,
  } = useQuery<AirdropMetadata | null>({
    queryKey: ['airdrop-metadata', airdropPubkey],
    queryFn: () => fetchAirdropMetadata(airdropPubkey!),
    enabled: !!airdropPubkey,
  });

  return {
    airdrop,
    metadata,
    isLoading: loadingMeta || loadingDetail,
    error: metaError || detailError,
  };
};
