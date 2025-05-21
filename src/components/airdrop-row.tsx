import { ClaimButton } from '@/components/claim-button';
import { useAirdropMeta } from '@/hooks/use-airdrop-meta';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useClaimantMeta } from '@/hooks/use-claimant-meta';
import { useTokenInfo } from '@/hooks/use-token-info';
import { cn, formatBNWithDecimals, getClaimableAmount } from '@/lib/utils';
import { AirdropType, ClaimStatusType } from '@/types/airdrop';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import Link from 'next/link';
import { useMemo } from 'react';

type AirdropRowProps = {
  airdrop: IAirdrop;
};

export function AirdropRow({ airdrop }: AirdropRowProps) {
  const { connected, publicKey: userPubKey } = useWallet();

  const { data: tokenInfo, isLoading: loadingTokenInfo } = useTokenInfo(airdrop.distributor.mint);
  const { data: airdropMeta, isLoading: loadingAirdropMeta } = useAirdropMeta(airdrop.pubkey.toString());
  const { data: claimantMeta, isLoading: loadingClaimantMeta } = useClaimantMeta(
    airdrop.pubkey.toString(),
    userPubKey?.toString(),
  );

  const {
    data: claimStatus,
    isLoading: loadingClaimStatus,
    refetch: refetchClaimStatus,
  } = useClaimStatus(airdrop.pubkey.toString(), userPubKey?.toString(), claimantMeta);

  const isLoading =
    loadingTokenInfo || loadingAirdropMeta || (connected && loadingClaimantMeta) || (connected && loadingClaimStatus);

  const amountTotal = useMemo(() => {
    if (!claimantMeta) return new BN(0);

    return new BN(claimantMeta.amountLocked).add(new BN(claimantMeta.amountUnlocked));
  }, [claimantMeta]);

  const vested = getClaimableAmount(
    amountTotal.toString(),
    airdrop.distributor.startTs,
    airdrop.distributor.endTs,
    airdrop.distributor.unlockPeriod,
  );

  if (
    !tokenInfo ||
    !airdropMeta ||
    (connected && !claimantMeta) ||
    (connected && claimStatus?.status === ClaimStatusType.CLOSED) ||
    isLoading
  )
    return null;

  const claimable =
    claimStatus?.status === ClaimStatusType.OPEN ? vested.sub(new BN(claimStatus.data.lockedAmountWithdrawn)) : vested;

  return (
    <Link
      href={`/airdrops/${airdrop.pubkey.toString()}`}
      className={cn(
        'grid grid-cols-6 gap-4 items-center text-sm cursor-pointer',
        'px-2 py-4 hover:bg-muted border-b border-dashed',
      )}
    >
      <div className="truncate whitespace-nowrap overflow-hidden">{airdropMeta.name}</div>
      {/* <div>{tokenInfo.symbol}</div> */}
      <div>{airdrop.distributor.startTs === airdrop.distributor.endTs ? AirdropType.INSTANT : AirdropType.VESTED}</div>
      <div>
        {airdrop.distributor.numNodesClaimed}/{airdrop.distributor.maxNumNodes}
      </div>
      <div>
        {formatBNWithDecimals(new BN(airdrop.distributor.totalAmountClaimed), tokenInfo.decimals)}/
        {formatBNWithDecimals(new BN(airdrop.distributor.maxTotalClaim), tokenInfo.decimals)}
      </div>
      <div>
        {formatBNWithDecimals(vested, tokenInfo.decimals)}/{formatBNWithDecimals(amountTotal, tokenInfo.decimals)}
      </div>
      {!claimable.isZero() && (
        <div onClick={(e) => e.stopPropagation()}>
          <ClaimButton
            claimantMeta={claimantMeta}
            refetchClaimStatus={() => refetchClaimStatus()}
            airdropPk={airdrop.pubkey}
          />
        </div>
      )}
    </Link>
  );
}
