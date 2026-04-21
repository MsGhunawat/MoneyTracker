import { Currency, SUPPORTED_CURRENCIES } from '../types';

export const formatCurrency = (amount: number, currency: Currency = SUPPORTED_CURRENCIES[0]) => {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount).replace(currency.code, currency.symbol);
};

export const formatPaymentMethod = (method: string) => {
  return method.charAt(0).toUpperCase() + method.slice(1);
};
