import { METADATA_PROGRAM_ID } from '@/config/constants';
import { TokenInfo } from '@/types/airdrop';
import { getMint } from '@solana/spl-token';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

function getMetadataPDA(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  )[0];
}

const fetchTokenInfo = async (connection: Connection, mint: string): Promise<TokenInfo | null> => {
  const mintPk = new PublicKey(mint);

  const mintInfo = await getMint(connection, mintPk);
  const decimals = mintInfo.decimals;

  console.log(getMetadataPDA(mintPk));

  return { decimals, address: mint, symbol: 'TOKEN', name: 'TOKEN' };
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
