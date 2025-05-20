import { fetchClaimantMetadata, fetchUserClaimStatus } from '@/services/airdrop';
import { ClaimantMetaData } from '@/types/airdrop';
import { ClaimStatusJSON } from '@streamflow/distributor/solana';
import { useQuery } from '@tanstack/react-query';

export const useUserClaimStatus = (airdropPubkey: string | undefined, walletAddress: string | undefined) => {
  const {
    data: claimStatus,
    isLoading: loadingClaimStatus,
    error: claimStatusError,
  } = useQuery<ClaimStatusJSON | null>({
    queryKey: ['user-claim-status', airdropPubkey, walletAddress],
    queryFn: () => fetchUserClaimStatus(airdropPubkey!, walletAddress!),
    enabled: !!airdropPubkey && !!walletAddress,
  });

  const {
    data: userMetaData,
    isLoading: loadingUserMetadata,
    error: userMetadataError,
  } = useQuery<ClaimantMetaData | null>({
    queryKey: ['user-metadata', airdropPubkey, walletAddress],
    queryFn: () => fetchClaimantMetadata(airdropPubkey!, walletAddress!),
    enabled: !!airdropPubkey && !!walletAddress,
  });

  return {
    claimStatus,
    userMetaData,
    isLoading: loadingClaimStatus || loadingUserMetadata,
    error: claimStatusError || userMetadataError,
  };
};
