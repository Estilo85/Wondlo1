export type CurrencyCode = 'GBP' | 'USD' | 'EUR';

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string; rate: number }[] = [
  { code: 'GBP', label: 'GBP £', symbol: '£', rate: 1 },
  { code: 'USD', label: 'USD $', symbol: '$', rate: 1.27 },
  { code: 'EUR', label: 'EUR €', symbol: '€', rate: 1.17 },
];

const STORAGE_KEY = 'wondlo.currency';

const listeners = new Set<() => void>();

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'GBP';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return CURRENCIES.some((c) => c.code === stored) ? (stored as CurrencyCode) : 'GBP';
}

export function getSnapshot(): CurrencyCode {
  return getStoredCurrency();
}

export function getServerSnapshot(): CurrencyCode {
  return 'GBP';
}

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function setStoredCurrency(code: CurrencyCode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, code);
  listeners.forEach((callback) => callback());
}

export function convertPence(pence: number, currency: CurrencyCode): number {
  const currencyConfig = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  return (pence / 100) * currencyConfig.rate;
}

export function currencySymbol(currency: CurrencyCode): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol ?? '£';
}

export function formatConverted(pence: number, currency: CurrencyCode): string {
  const value = convertPence(pence, currency);
  const rounded = Math.round(value * 100) / 100;
  const formatted = Number.isInteger(rounded)
    ? rounded.toString()
    : rounded.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currencySymbol(currency)}${formatted}`;
}