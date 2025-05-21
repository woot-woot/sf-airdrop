import { ClaimStatusJSON } from '@streamflow/distributor/solana';

export enum AirdropType {
  INSTANT = 'Instant',
  VESTED = 'Vested',
}

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

export enum ClaimStatusType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
export type UserClaimStatus =
  | { status: ClaimStatusType.OPEN; data: ClaimStatusJSON }
  | { status: ClaimStatusType.CLOSED };

export type TokenInfo = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image?: string;
};

export type TokenInfoResponse = Record<string, TokenInfo>;
