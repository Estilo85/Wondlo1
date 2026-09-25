import { currencySymbol, type CurrencyCode } from './currency';

export type PlanKey = 'free_trial' | 'pay_as_you_go' | 'starter';

export type PlanConfig = {
  name: string;
  cadence: string;
  pricePence: number;
};

export const PLANS: Record<PlanKey, PlanConfig> = {
  free_trial: { name: 'Free Trial', cadence: '3 searches', pricePence: 0 },
  pay_as_you_go: { name: 'Pay As You Go', cadence: '/search', pricePence: 300 },
  starter: { name: 'Starter Plan', cadence: '/month', pricePence: 1500 },
};

export const FREE_TRIAL_SEARCHES = 3;
export const STARTER_SEARCHES = 7;

export const PLAN_KEYS: PlanKey[] = ['free_trial', 'pay_as_you_go', 'starter'];

export function isPaidPlan(plan: string): boolean {
  return plan === 'pay_as_you_go' || plan === 'starter';
}

export type BillingUser = {
  plan: string;
  searchAllowance: number;
  searchAllowanceUsed: number;
  freeSearchesUsed: number;
  cycleEndsAt: Date | null;
};

export function planInfo(user: BillingUser) {
  const key = (PLAN_KEYS.includes(user.plan as PlanKey) ? user.plan : 'free_trial') as PlanKey;
  const paid = isPaidPlan(key);
  const allowance = paid ? user.searchAllowance : FREE_TRIAL_SEARCHES;
  const used = paid ? user.searchAllowanceUsed : user.freeSearchesUsed;
  const left = Math.max(0, allowance - used);
  const config = PLANS[key];
  return {
    plan: key,
    label: config.name,
    cadence: config.cadence,
    pricePence: config.pricePence,
    allowance,
    used,
    left,
    limited: used >= allowance,
    cycleEndsAt: user.cycleEndsAt,
  };
}

export function formatMoney(pence: number, currency = 'GBP'): string {
  return `${currencySymbol(currency as CurrencyCode)}${(pence / 100).toFixed(2)}`;
}

export function formatCardBrand(brand: string): string {
  const map: Record<string, string> = {
    Visa: 'Visa',
    Mastercard: 'Mastercard',
    Amex: 'American Express',
    Discover: 'Discover',
  };
  return map[brand] ?? brand;
}

export type BillingAddress = { line1: string; city: string; postal: string; country: string };

export function sanitizeBillingAddress(input: unknown): BillingAddress | null {
  if (!input || typeof input !== 'object') return null;
  const a = input as Record<string, unknown>;
  const country = typeof a.country === 'string' && a.country.trim() ? a.country.trim().slice(0, 2) : '';
  const line1 = typeof a.line1 === 'string' && a.line1.trim() ? a.line1.trim().slice(0, 120) : '';
  const city = typeof a.city === 'string' && a.city.trim() ? a.city.trim().slice(0, 80) : '';
  const postal = typeof a.postal === 'string' && a.postal.trim() ? a.postal.trim().slice(0, 20) : '';
  if (!line1 || !country) return null;
  return { line1, city, postal, country };
}