import { METADATA_PROGRAM_ID } from '@/config/constants';
import { TokenInfo } from '@/types/airdrop';
import { getMint } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { TokenMetadata } from '@solana/spl-token-metadata';

function getMetadataPDA(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  )[0];
}

async function getTokenMetadata(connection: Connection, mint: PublicKey): Promise<TokenMetadata | null> {
  try {
    const metadataPDA = getMetadataPDA(mint);
    const accountInfo = await connection.getAccountInfo(metadataPDA);

    if (!accountInfo) {
      return null;
    }

    // console.log(unpack(accountInfo.data));

    return null;
  } catch {
    return null;
  }
}

const fetchTokenInfo = async (connection: Connection, mint: string): Promise<TokenInfo | null> => {
  try {
    const mintPk = new PublicKey(mint);

    const mintInfo = await getMint(connection, mintPk);
    const decimals = mintInfo.decimals;

    const metadata = await getTokenMetadata(connection, mintPk);

    return { decimals, address: mint, symbol: metadata?.symbol || 'Unknown', name: metadata?.name || 'Unknown' };
  } catch {
    return null;
  }
};

export const useTokenInfo = (mint: string | undefined) => {
  const { connection } = useConnection();

  return useQuery<TokenInfo | null>({
    queryKey: ['token-info', mint],
    queryFn: () => {
      if (!mint) return null;
      return fetchTokenInfo(connection, mint);
    },
    enabled: !!mint,
  });
};
