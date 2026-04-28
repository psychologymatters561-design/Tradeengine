import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatVolume(volume: number) {
  if (volume >= 10000000) return (volume / 10000000).toFixed(2) + ' Cr';
  if (volume >= 100000) return (volume / 100000).toFixed(2) + ' L';
  if (volume >= 1000) return (volume / 1000).toFixed(2) + ' K';
  return volume.toString();
}
