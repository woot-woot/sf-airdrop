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
