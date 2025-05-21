import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ICluster } from '@streamflow/common';
import { IClaimData, SolanaDistributorClient } from '@streamflow/distributor/solana';
import BN from 'bn.js';

interface ClaimParams {
  airdropId: string;
  claimantMeta: {
    amountLocked: string;
    amountUnlocked: string;
    proof: number[][];
  };
  wallet: SignerWalletAdapter;
}

export async function claimAirdrop({ airdropId, claimantMeta, wallet }: ClaimParams) {
  if (!claimantMeta?.amountLocked || !claimantMeta?.amountUnlocked || !claimantMeta?.proof) {
    throw new Error('Invalid user metadata');
  }

  const distributorClient = new SolanaDistributorClient({
    clusterUrl: clusterApiUrl('devnet'),
    cluster: ICluster.Devnet,
  });

  const claimData: IClaimData = {
    id: airdropId,
    amountLocked: new BN(claimantMeta.amountLocked),
    amountUnlocked: new BN(claimantMeta.amountUnlocked),
    proof: claimantMeta.proof,
  };

  return await distributorClient.claim(claimData, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoker: wallet as any,
  });
}
