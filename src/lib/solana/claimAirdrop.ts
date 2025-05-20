import { SignerWalletAdapter } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ICluster } from '@streamflow/common';
import { IClaimData, SolanaDistributorClient } from '@streamflow/distributor/solana';
import BN from 'bn.js';

interface ClaimParams {
  airdropId: string;
  userMetaData: {
    amountLocked: string;
    amountUnlocked: string;
    proof: number[][];
  };
  wallet: SignerWalletAdapter;
}

export async function claimAirdrop({ airdropId, userMetaData, wallet }: ClaimParams) {
  if (!userMetaData?.amountLocked || !userMetaData?.amountUnlocked || !userMetaData?.proof) {
    throw new Error('Invalid user metadata');
  }

  const distributorClient = new SolanaDistributorClient({
    clusterUrl: clusterApiUrl('devnet'),
    cluster: ICluster.Devnet,
  });

  const claimData: IClaimData = {
    id: airdropId,
    amountLocked: new BN(userMetaData.amountLocked),
    amountUnlocked: new BN(userMetaData.amountUnlocked),
    proof: userMetaData.proof,
  };

  return await distributorClient.claim(claimData, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoker: wallet as any,
  });
}
