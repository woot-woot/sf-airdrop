import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useUserClaimStatus } from '@/hooks/use-user-claim-status';
import { copyToClipboard, formatTimestamp, getClaimableAmount } from '@/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from 'bn.js';
import { Copy } from 'lucide-react';

export const UserClaimStatus = ({ airdrop }: { airdrop: IAirdrop }) => {
  const { connected, publicKey } = useWallet();
  const { userMetaData, claimStatus, isLoading } = useUserClaimStatus(airdrop.pubkey.toString(), publicKey?.toString());

  if (!connected || !publicKey)
    return <div className="mt-10 text-center text-lg font-medium">Connect your wallet to view airdrop details.</div>;

  if (isLoading) return <div className="mt-10 text-center text-lg font-medium">Loading...</div>;

  if (!userMetaData) return <div className="mt-10 text-center text-lg font-medium">Not eligible for airdrop</div>;

  // const amountLocked = new BN(userData.amountLocked);
  const amountTotal = new BN(userMetaData.amountLocked).add(new BN(userMetaData.amountUnlocked));
  const claimable = getClaimableAmount(
    amountTotal.toString(),
    airdrop.distributor.startTs,
    airdrop.distributor.endTs,
    airdrop.distributor.unlockPeriod,
  );

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
        <div>{claimable.toString()}</div>
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
        <div>{formatTimestamp(claimStatus?.lastClaimTs, 'yyyy-MM-dd HH:mm:ss')}</div>
        <div>{claimStatus?.lockedAmountWithdrawn}</div>
        <div>
          {claimStatus?.claimsCount && claimStatus?.claimsCount > 0 ? (
            <Badge variant="secondary">Claimed</Badge>
          ) : (
            <Badge variant="secondary">Unclaimed</Badge>
          )}
        </div>
        <div>
          {claimable.gt(new BN(0)) && (
            <Button size="sm" variant="default">
              Claim
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
