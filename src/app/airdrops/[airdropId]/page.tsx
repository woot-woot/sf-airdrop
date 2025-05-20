'use client';

import { InfoCard } from '@/components/info-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserClaimStatus } from '@/components/user-claim-status';
import { useAirdropDetails } from '@/hooks/use-airdrop-details';
import { useParams } from 'next/navigation';

export default function AirdropDetail() {
  const { airdropId } = useParams();

  const { airdrop, metadata, isLoading } = useAirdropDetails(airdropId as string);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-10 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!airdrop || !metadata) return <div className="mt-10 text-center text-lg font-medium">Airdrop not found.</div>;

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
            >
              {metadata.sender.slice(0, 4)}...{metadata.sender.slice(-4)}
            </a>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
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
          value={`${airdrop.distributor.totalAmountClaimed}/${airdrop.distributor.maxTotalClaim}`}
        />
      </div>
      <UserClaimStatus airdrop={airdrop} />
    </div>
  );
}
