import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Łączy klasy Tailwinda i rozwiązuje konflikty.
 * `cn('px-3', condition && 'pl-10')` → `'pl-10'` (twMerge wybiera ostatnią
 * wygrywającą), więc użytkownik komponentu może bezpiecznie nadpisywać klasy
 * przez prop `className` bez niespodzianek.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
