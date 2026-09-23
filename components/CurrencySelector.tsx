'use client';

import { useEffect, useState } from 'react';
import {
  CURRENCIES,
  getStoredCurrency,
  setStoredCurrency,
  subscribeCurrency,
  type CurrencyCode,
} from '@/lib/currency';

export function useCurrency(): CurrencyCode {
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());

  useEffect(() => {
    return subscribeCurrency((code) => setCurrency(code));
  }, []);

  return currency;
}

export default function CurrencySelector() {
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());

  useEffect(() => {
    return subscribeCurrency((code) => setCurrency(code));
  }, []);

  return (
    <label className="relative flex-shrink-0 cursor-pointer" aria-label="Display currency">
      <span className="sr-only">Display currency</span>
      <svg
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" />
      </svg>
      <select
        value={currency}
        onChange={(e) => setStoredCurrency(e.target.value as CurrencyCode)}
        className="h-8 cursor-pointer appearance-none rounded-lg border border-[#C7B5F5] bg-[#F6F4FE] pl-8 pr-7 font-inter text-xs font-semibold text-[#7E6BB3] outline-none transition-colors focus:border-[#7E6BB3]"
      >
        {CURRENCIES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}