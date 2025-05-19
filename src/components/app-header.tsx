import { ModeSwitcher } from '@/components/mode-switcher';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/user-profile';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const router = useRouter();

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center gap-2 md:gap-4">
          {/* ? Navigation here */}
          <Button variant="ghost" className="cursor-pointer" onClick={() => router.push('/')}>
            AIRDROP
          </Button>
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <nav className="flex items-center gap-0.5">
              <ModeSwitcher />
            </nav>
            <div className="w-full flex-1 md:flex md:w-auto md:flex-none">
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
