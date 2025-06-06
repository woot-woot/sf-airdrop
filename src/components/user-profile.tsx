'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { copyToClipboard } from '@/lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { CopyIcon, UnplugIcon } from 'lucide-react';

export function UserProfile() {
  const { connected, connecting, connect, publicKey, disconnect } = useWallet();

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <Button variant="outline" className="rounded-full w-40" asChild>
          <DropdownMenuTrigger>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{publicKey.toString()}</span>
            </div>
          </DropdownMenuTrigger>
        </Button>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => copyToClipboard(publicKey.toString())}>
            <CopyIcon />
            Copy address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect}>
            <UnplugIcon /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <Button disabled={connecting} onClick={() => connect()}>
      Connect
    </Button>
  );
}
