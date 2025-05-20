import { TableCell, TableRow } from '@/components/ui/table';
import { IAirdrop } from '@/hooks/use-airdrops';
import { useRouter } from 'next/navigation';

export function AirdropRow({ airdrop }: { airdrop: IAirdrop }) {
  const router = useRouter();

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/airdrops/${airdrop.pubkey.toString()}`)}>
      <TableCell>{airdrop.distributor.startTs === airdrop.distributor.endTs ? 'Instant' : 'Vested'}</TableCell>
      <TableCell>
        {airdrop.distributor.numNodesClaimed}/{airdrop.distributor.maxNumNodes}
      </TableCell>
      <TableCell>
        {airdrop.distributor.totalAmountClaimed}/{airdrop.distributor.maxTotalClaim}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
