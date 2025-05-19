import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(content: string) {
  navigator.clipboard.writeText(content).then(() => toast.info('Copied!', { duration: 1500 }));
}
