import { TableCell, TableRow } from '@/components/ui/table';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useRouter } from 'next/navigation';

export function SingleAirdrop({ airdrop }: { airdrop: IAirdrop }) {
  const router = useRouter();

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/airdrops/${airdrop.pubkey.toString()}`)}>
      <TableCell>{airdrop.distributor.startTs.eq(airdrop.distributor.endTs) ? 'Instant' : 'Vested'}</TableCell>
      <TableCell>
        {airdrop.distributor.numNodesClaimed.toNumber()}/{airdrop.distributor.maxNumNodes.toNumber()}
      </TableCell>
      <TableCell>
        {airdrop.distributor.totalAmountClaimed.toString()}/{airdrop.distributor.maxTotalClaim.toString()}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
