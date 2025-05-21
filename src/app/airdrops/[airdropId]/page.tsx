'use client';

import { InfoCard } from '@/components/info-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAirdropDetail } from '@/hooks/use-airdrop-detail';
import { useAirdropMeta } from '@/hooks/use-airdrop-meta';
import { useTokenInfo } from '@/hooks/use-token-info';
import { copyToClipboard, formatBNWithDecimals } from '@/lib/utils';
import BN from 'bn.js';
import { useParams } from 'next/navigation';
import { ClaimStatus } from './claim-status';

export default function AirdropDetail() {
  const { airdropId } = useParams();

  const { data: airdrop, isLoading: loadingAirdrop } = useAirdropDetail(airdropId as string);
  const { data: metadata, isLoading: loadingAirdropMeta } = useAirdropMeta(airdropId as string);
  const { data: tokenInfo, isLoading: loadingTokenInfo } = useTokenInfo(airdrop?.distributor.mint);

  if (loadingAirdrop || loadingAirdropMeta || loadingTokenInfo) {
    return (
      <div className="max-w-5xl mx-auto mt-10 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!airdrop || !metadata) return <div className="mt-10 text-center text-lg font-medium">Airdrop not found.</div>;

  const decimals = tokenInfo?.decimals || 9;

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{metadata.name}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            {metadata.chain} • Sender:{' '}
            <a
              href={`https://solscan.io/account/${metadata.sender}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              title="View sender on Solscan"
            >
              {metadata.sender.slice(0, 4)}...{metadata.sender.slice(-4)}
            </a>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(window.location.href)}>
            Copy link
          </Button>
        </div>
      </div>

      {/* Airdrop Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          desc="Airdrop Type"
          value={airdrop.distributor.startTs === airdrop.distributor.endTs ? 'Instant' : 'Vested'}
        />
        <InfoCard desc="Recipients" value={airdrop.distributor.maxNumNodes} />
        <InfoCard desc="Claimed" value={`${airdrop.distributor.numNodesClaimed}/${airdrop.distributor.maxNumNodes}`} />
        <InfoCard
          desc="Amount Claimed / Total"
          value={`${formatBNWithDecimals(
            new BN(airdrop.distributor.totalAmountClaimed),
            decimals,
          )}/${formatBNWithDecimals(new BN(airdrop.distributor.maxTotalClaim), decimals)}`}
        />
      </div>
      <ClaimStatus airdrop={airdrop} tokenInfo={tokenInfo} />
    </div>
  );
}
