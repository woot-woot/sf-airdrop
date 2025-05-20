import BN from 'bn.js';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(content: string) {
  navigator.clipboard.writeText(content).then(() => toast.info('Copied!', { duration: 1500 }));
}

export function formatTimestamp(timestamp: number | string | undefined, formatStr: string): string {
  if (!timestamp) return '---';

  let date;
  if (typeof timestamp === 'number') date = new Date(timestamp * 1000);
  else date = new Date(parseInt(timestamp, 10) * 1000);

  return format(date, formatStr);
}

/**
 * Calculates the claimable airdrop amount at the current time using BN.js.
 */
export function getClaimableAmount(
  totalAmountStr: string,
  startTsStr: string,
  endTsStr: string,
  unlockPeriodStr: string,
): BN {
  const nowTs = Math.floor(Date.now() / 1000);

  const totalAmount = new BN(totalAmountStr);
  const startTs = new BN(startTsStr);
  const endTs = new BN(endTsStr);
  const unlockPeriod = new BN(unlockPeriodStr);
  const now = new BN(nowTs);

  if (startTs.eq(endTs) || now.gte(endTs)) {
    return totalAmount; // Fully claimable
  }

  if (now.lte(startTs)) {
    return new BN(0); // Nothing claimable yet
  }

  const totalDuration = endTs.sub(startTs);
  const elapsed = now.sub(startTs);

  const totalSteps = totalDuration.div(unlockPeriod);
  const elapsedSteps = elapsed.div(unlockPeriod);

  const claimableSteps = elapsedSteps.gt(totalSteps) ? totalSteps : elapsedSteps;

  if (totalSteps.isZero()) {
    return totalAmount;
  }

  return totalAmount.mul(claimableSteps).div(totalSteps);
}
