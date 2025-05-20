export enum Chain {
  SOLANA = 'SOLANA',
  APTOS = 'APTOS',
  ETHEREUM = 'ETHEREUM',
  BNB = 'BNB',
  POLYGON = 'POLYGON',
  SUI = 'SUI',
}

export type AirdropMetadata = {
  chain: Chain;
  mint: string;
  version: number;
  address: string;
  sender: string;
  name: string;
  maxNumNodes: string;
  maxTotalClaim: string;
  isActive: boolean;
  isOnChain: boolean;
  clawbackDt: string | null; // ISO 8601
  totalAmountUnlocked: string;
  totalAmountLocked: string;
  isAligned: boolean;
  isVerified: boolean;
  merkleRoot: Uint8Array;
};

export type ClaimantMetaData = {
  chain: Chain;
  distributorAddress: string;
  address: string;
  amountUnlocked: string;
  amountLocked: string;
  amountClaimed: string;
  proof: number[][];
};
