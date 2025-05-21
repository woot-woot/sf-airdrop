import { ClaimButton } from '@/components/claim-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAirdropDetail } from '@/hooks/use-airdrop-detail';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useClaimStatus } from '@/hooks/use-claim-status';
import { useClaimantMeta } from '@/hooks/use-claimant-meta';
import { copyToClipboard, formatBNWithDecimals, formatTimestamp, getClaimableAmount } from '@/lib/utils';
import { ClaimStatusType, TokenInfo } from '@/types/airdrop';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { Copy } from 'lucide-react';
import { useMemo } from 'react';

export const ClaimStatus = ({ airdrop, tokenInfo }: { airdrop: IAirdrop; tokenInfo: TokenInfo | null | undefined }) => {
  const { connected, publicKey: userPubKey } = useWallet();

  const { data: claimantMeta, isLoading: loadingClaimantMeta } = useClaimantMeta(
    airdrop.pubkey.toString(),
    userPubKey?.toString(),
  );

  const { refetch: refetchAirdropDetail } = useAirdropDetail(airdrop.pubkey.toString());

  const {
    data: claimStatus,
    isLoading: loadingClaimStatus,
    refetch: refetchClaimStatus,
  } = useClaimStatus(airdrop.pubkey.toString(), userPubKey?.toString(), claimantMeta);

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

  const claimable = useMemo(() => {
    if (!claimStatus || claimStatus.status !== ClaimStatusType.OPEN) return vested;
    return BN.max(vested.sub(new BN(claimStatus.data.lockedAmountWithdrawn)), new BN(0));
  }, [claimStatus, vested]);

  if (!connected || !userPubKey)
    return <div className="mt-10 text-center text-lg font-medium">Connect your wallet to view airdrop details.</div>;

  if (loadingClaimStatus || loadingClaimantMeta)
    return <div className="mt-10 text-center text-lg font-medium">Loading...</div>;

  if (!claimantMeta) return <div className="mt-10 text-center text-lg font-medium">Not eligible for airdrop</div>;

  if (claimStatus?.status === ClaimStatusType.CLOSED)
    return <div className="mt-10 text-center text-lg font-medium">Not eligible for airdrop</div>;

  const decimals = tokenInfo?.decimals || 9;

  return (
    <div className="border rounded-xl p-4 bg-background shadow">
      <div className="grid grid-cols-7 gap-4 text-sm text-muted-foreground font-semibold mb-2">
        <div>Amount</div>
        <div>Address</div>
        <div>Claimable</div>
        <div>Last Claim Date</div>
        <div>Total Claimed</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="grid grid-cols-7 gap-4 items-center text-sm">
        <div>{formatBNWithDecimals(amountTotal, decimals)}</div>
        <div className="flex items-center gap-2">
          {userPubKey.toBase58().slice(0, 6)}...{userPubKey.toBase58().slice(-4)}
          <Button size="icon" variant="ghost" onClick={() => copyToClipboard(userPubKey.toBase58())}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div>{formatBNWithDecimals(claimable, decimals)}</div>
        <div>{formatTimestamp(claimStatus?.data.lastClaimTs, 'yyyy-MM-dd HH:mm:ss')}</div>
        <div>
          {formatBNWithDecimals(new BN(claimStatus?.data?.lockedAmountWithdrawn || '0'), decimals)}/
          {formatBNWithDecimals(amountTotal, decimals)}
        </div>
        <div>
          {claimStatus?.data.claimsCount && claimStatus?.data.claimsCount > 0 ? (
            <Badge variant="secondary">Claimed</Badge>
          ) : (
            <Badge variant="secondary">Unclaimed</Badge>
          )}
        </div>
        <div>
          {!claimable.isZero() && (
            <ClaimButton
              airdropPk={airdrop.pubkey}
              claimantMeta={claimantMeta}
              refetchClaimStatus={() => {
                refetchAirdropDetail();
                refetchClaimStatus();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
