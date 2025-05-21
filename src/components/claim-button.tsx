import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { claimAirdrop } from '@/lib/solana/claimAirdrop';
import { ClaimantMetaData } from '@/types/airdrop';
import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { MouseEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';

type ClaimButtonProps = {
  claimantMeta: ClaimantMetaData | null | undefined;
  refetchClaimStatus: () => void;
  airdropPk: PublicKey;
};

export const ClaimButton = ({ claimantMeta, refetchClaimStatus, airdropPk }: ClaimButtonProps) => {
  const { wallet } = useWallet();

  const handleClaim = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      setIsClaiming(true);
      try {
        if (!wallet?.adapter) throw new Error('Wallet not connected');
        if (!claimantMeta) throw new Error('User not eligible');

        const txResult = await claimAirdrop({
          airdropId: airdropPk.toBase58(),
          claimantMeta,
          wallet: wallet.adapter as SignerWalletAdapter,
        });

        if (!txResult) {
          toast.error('Failed to claim!');
          return;
        }

        toast.success('Claimed!');

        refetchClaimStatus();
      } catch (error) {
        toast.error(`Failed to claim! ${(error as Error).message}`);
      } finally {
        setIsClaiming(false);
      }
    },
    [claimantMeta, airdropPk, wallet, refetchClaimStatus],
  );

  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  return (
    <Button size="sm" variant="default" onClick={handleClaim} disabled={isClaiming}>
      {isClaiming ? <Spinner variant="secondary" size="small" /> : 'Claim'}
    </Button>
  );
};
