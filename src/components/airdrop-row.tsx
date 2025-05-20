import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useTokenInfo } from '@/hooks/use-token-info';
import { formatBNWithDecimals } from '@/lib/utils';
import BN from 'bn.js';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function AirdropRow({ airdrop }: { airdrop: IAirdrop }) {
  const router = useRouter();
  const { data: tokenInfo, isLoading } = useTokenInfo(airdrop.distributor.mint);

  const symbolCell = useMemo(() => {
    if (isLoading) return <Skeleton className="h-4 w-16" />;
    return tokenInfo?.symbol ?? <div>---</div>;
  }, [tokenInfo, isLoading]);

  const totalClaimCell = useMemo(() => {
    if (isLoading) return <Skeleton className="h-4 w-32" />;
    const decimals = tokenInfo?.decimals || 9;

    return (
      <>
        {formatBNWithDecimals(new BN(airdrop.distributor.totalAmountClaimed), decimals)}/
        {formatBNWithDecimals(new BN(airdrop.distributor.maxTotalClaim), decimals)}
      </>
    );
  }, [airdrop, tokenInfo, isLoading]);

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/airdrops/${airdrop.pubkey.toString()}`)}>
      <TableCell>{symbolCell}</TableCell>
      <TableCell>{airdrop.distributor.startTs === airdrop.distributor.endTs ? 'Instant' : 'Vested'}</TableCell>
      <TableCell>
        {airdrop.distributor.numNodesClaimed}/{airdrop.distributor.maxNumNodes}
      </TableCell>
      <TableCell>{totalClaimCell}</TableCell>
      <TableCell />
    </TableRow>
  );
}
