export const CURRENCIES = [
  { code: 'GBP', label: 'GBP £', symbol: '£', rate: 1 },
  { code: 'USD', label: 'USD $', symbol: '$', rate: 1.27 },
  { code: 'EUR', label: 'EUR €', symbol: '€', rate: 1.17 },
  { code: 'ZAR', label: 'ZAR R', symbol: 'R', rate: 23.2 },
  { code: 'NGN', label: 'NGN ₦', symbol: '₦', rate: 1900 },
  { code: 'GHS', label: 'GHS ₵', symbol: '₵', rate: 15.9 },
  { code: 'KES', label: 'KES KSh', symbol: 'KSh', rate: 168 },
  { code: 'TZS', label: 'TZS TSh', symbol: 'TSh', rate: 3300 },
  { code: 'UGX', label: 'UGX USh', symbol: 'USh', rate: 4800 },
  { code: 'EGP', label: 'EGP E£', symbol: 'E£', rate: 61 },
  { code: 'MAD', label: 'MAD MAD', symbol: 'MAD', rate: 12.4 },
  { code: 'TND', label: 'TND DT', symbol: 'DT', rate: 3.9 },
  { code: 'DZD', label: 'DZD DA', symbol: 'DA', rate: 170 },
  { code: 'INR', label: 'INR ₹', symbol: '₹', rate: 106 },
  { code: 'PKR', label: 'PKR ₨', symbol: '₨', rate: 350 },
  { code: 'BDT', label: 'BDT ৳', symbol: '৳', rate: 150 },
  { code: 'LKR', label: 'LKR SLR', symbol: 'SLR', rate: 380 },
  { code: 'AED', label: 'AED د.إ', symbol: 'د.إ', rate: 4.7 },
  { code: 'SAR', label: 'SAR ﷼', symbol: '﷼', rate: 4.8 },
  { code: 'QAR', label: 'QAR QR', symbol: 'QR', rate: 4.6 },
  { code: 'KWD', label: 'KWD KD', symbol: 'KD', rate: 0.39 },
  { code: 'ILS', label: 'ILS ₪', symbol: '₪', rate: 4.6 },
  { code: 'AUD', label: 'AUD A$', symbol: 'A$', rate: 1.94 },
  { code: 'NZD', label: 'NZD NZ$', symbol: 'NZ$', rate: 2.12 },
  { code: 'CAD', label: 'CAD C$', symbol: 'C$', rate: 1.75 },
  { code: 'JPY', label: 'JPY ¥', symbol: '¥', rate: 192 },
  { code: 'KRW', label: 'KRW ₩', symbol: '₩', rate: 1700 },
  { code: 'CNY', label: 'CNY CN¥', symbol: 'CN¥', rate: 9.1 },
  { code: 'HKD', label: 'HKD HK$', symbol: 'HK$', rate: 9.9 },
  { code: 'SGD', label: 'SGD S$', symbol: 'S$', rate: 1.71 },
  { code: 'MYR', label: 'MYR RM', symbol: 'RM', rate: 5.6 },
  { code: 'THB', label: 'THB ฿', symbol: '฿', rate: 44 },
  { code: 'IDR', label: 'IDR Rp', symbol: 'Rp', rate: 19900 },
  { code: 'PHP', label: 'PHP ₱', symbol: '₱', rate: 71 },
  { code: 'VND', label: 'VND ₫', symbol: '₫', rate: 31500 },
  { code: 'NOK', label: 'NOK kr', symbol: 'kr', rate: 14.2 },
  { code: 'SEK', label: 'SEK kr', symbol: 'kr', rate: 13.6 },
  { code: 'DKK', label: 'DKK kr', symbol: 'kr', rate: 8.9 },
  { code: 'CHF', label: 'CHF CHF', symbol: 'CHF', rate: 1.12 },
  { code: 'PLN', label: 'PLN zł', symbol: 'zł', rate: 5.1 },
  { code: 'CZK', label: 'CZK Kč', symbol: 'Kč', rate: 29.5 },
  { code: 'HUF', label: 'HUF Ft', symbol: 'Ft', rate: 470 },
  { code: 'RON', label: 'RON lei', symbol: 'lei', rate: 6.4 },
  { code: 'TRY', label: 'TRY ₺', symbol: '₺', rate: 43 },
  { code: 'UAH', label: 'UAH ₴', symbol: '₴', rate: 52 },
  { code: 'BRL', label: 'BRL R$', symbol: 'R$', rate: 7.0 },
  { code: 'MXN', label: 'MXN MX$', symbol: 'MX$', rate: 25 },
  { code: 'ARS', label: 'ARS AR$', symbol: 'AR$', rate: 1180 },
  { code: 'COP', label: 'COP COP$', symbol: 'COP$', rate: 5300 },
  { code: 'CLP', label: 'CLP CLP$', symbol: 'CLP$', rate: 1200 },
  { code: 'PEN', label: 'PEN S/', symbol: 'S/', rate: 4.8 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

const STORAGE_KEY = 'wondlo.currency';

const REGION_CURRENCY: Record<string, CurrencyCode> = {
  GB: 'GBP',
  US: 'USD',
  AU: 'AUD',
  NZ: 'NZD',
  CA: 'CAD',
  JP: 'JPY',
  KR: 'KRW',
  CN: 'CNY',
  HK: 'HKD',
  SG: 'SGD',
  MY: 'MYR',
  TH: 'THB',
  ID: 'IDR',
  PH: 'PHP',
  VN: 'VND',
  IN: 'INR',
  PK: 'PKR',
  BD: 'BDT',
  LK: 'LKR',
  ZA: 'ZAR',
  NG: 'NGN',
  GH: 'GHS',
  KE: 'KES',
  TZ: 'TZS',
  UG: 'UGX',
  EG: 'EGP',
  MA: 'MAD',
  TN: 'TND',
  DZ: 'DZD',
  NO: 'NOK',
  SE: 'SEK',
  DK: 'DKK',
  CH: 'CHF',
  PL: 'PLN',
  CZ: 'CZK',
  HU: 'HUF',
  RO: 'RON',
  TR: 'TRY',
  UA: 'UAH',
  BR: 'BRL',
  MX: 'MXN',
  AR: 'ARS',
  CO: 'COP',
  CL: 'CLP',
  PE: 'PEN',
  AE: 'AED',
  SA: 'SAR',
  QA: 'QAR',
  KW: 'KWD',
  IL: 'ILS',
  FR: 'EUR',
  DE: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
};

const listeners = new Set<() => void>();

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value);
}

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'GBP';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && isCurrencyCode(stored) ? stored : 'GBP';
  } catch {
    return 'GBP';
  }
}

export function detectCurrency(): CurrencyCode {
  if (typeof navigator === 'undefined') return 'GBP';
  try {
    const region = (navigator.language || '').split('-')[1]?.toUpperCase() ?? '';
    if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region];
  } catch {
    return 'GBP';
  }
  return 'GBP';
}

export function getSnapshot(): CurrencyCode {
  if (typeof window === 'undefined') return 'GBP';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isCurrencyCode(stored)) return stored;
  } catch {
    return 'GBP';
  }
  return detectCurrency();
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
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    return;
  }
  listeners.forEach((callback) => callback());
}

export function convertPence(pence: number, currency: CurrencyCode): number {
  const config = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  return (pence / 100) * config.rate;
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

export const COUNTRIES: { code: string; name: string }[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'MA', name: 'Morocco' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'LK', name: 'Sri Lanka' },
];

export function currencyForCountry(countryCode: string): CurrencyCode {
  return REGION_CURRENCY[countryCode] ?? 'GBP';
}