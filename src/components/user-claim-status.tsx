import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useUserClaimStatus } from '@/hooks/use-user-claim-status';
import { claimAirdrop } from '@/lib/solana/claimAirdrop';
import { copyToClipboard, formatBNWithDecimals, formatTimestamp, getClaimableAmount } from '@/lib/utils';
import { ClaimStatusType, TokenInfo } from '@/types/airdrop';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { Copy } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

export const UserClaimStatus = ({
  airdrop,
  tokenInfo,
}: {
  airdrop: IAirdrop;
  tokenInfo: TokenInfo | null | undefined;
}) => {
  const { connected, publicKey, wallet } = useWallet();
  const { userMetaData, claimStatus, isLoading } = useUserClaimStatus(airdrop.pubkey.toString(), publicKey?.toString());
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const handleClaim = useCallback(async () => {
    setIsClaiming(true);
    try {
      if (!wallet?.adapter) throw new Error('Wallet not connected');
      if (!userMetaData) throw new Error('User not eligible');

      const txResult = await claimAirdrop({
        airdropId: airdrop.pubkey.toBase58(),
        userMetaData,
        wallet: wallet.adapter as SignerWalletAdapter,
      });

      if (!txResult) {
        toast.error('Failed to claim!');
        return;
      }

      toast.success('Claimed!');
    } catch (error) {
      toast.error(`Failed to claim! ${(error as Error).message}`);
    } finally {
      setIsClaiming(false);
    }
  }, [userMetaData, airdrop.pubkey, wallet]);

  const amountTotal = useMemo(() => {
    if (!userMetaData) return new BN(0);
    return new BN(userMetaData.amountLocked).add(new BN(userMetaData.amountUnlocked));
  }, [userMetaData]);

  const claimable = getClaimableAmount(
    amountTotal.toString(),
    airdrop.distributor.startTs,
    airdrop.distributor.endTs,
    airdrop.distributor.unlockPeriod,
  );

  if (!connected || !publicKey)
    return <div className="mt-10 text-center text-lg font-medium">Connect your wallet to view airdrop details.</div>;

  if (isLoading) return <div className="mt-10 text-center text-lg font-medium">Loading...</div>;

  if (!userMetaData) return <div className="mt-10 text-center text-lg font-medium">Not eligible for airdrop</div>;

  if (claimStatus?.status === ClaimStatusType.CLOSED)
    return <div className="mt-10 text-center text-lg font-medium">Not eligible for airdrop</div>;

  const decimals = tokenInfo?.decimals || 9;

  return (
    <div className="border rounded-xl p-4 bg-background shadow">
      <div className="grid grid-cols-7 gap-4 text-sm text-muted-foreground font-semibold mb-2">
        <div>Amount</div>
        <div>Address</div>
        <div>Explorer</div>
        <div>Last Claim Date</div>
        <div>Total Claimed</div>
        <div>Status</div>
        <div></div>
      </div>

      <div className="grid grid-cols-7 gap-4 items-center text-sm">
        <div>{formatBNWithDecimals(amountTotal, decimals)}</div>
        <div className="flex items-center gap-2">
          {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
          <Button size="icon" variant="ghost" onClick={() => copyToClipboard(publicKey.toBase58())}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <a
            className="underline"
            href={`https://solscan.io/account/${publicKey.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </div>
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
          {claimable.gt(new BN(0)) && (
            <Button size="sm" variant="default" onClick={() => handleClaim()} disabled={isClaiming}>
              {isClaiming ? <Spinner variant="secondary" size="small" /> : 'Claim'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
