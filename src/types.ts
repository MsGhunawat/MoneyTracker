export interface Currency {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', locale: 'ar-AE' },
];

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "expense" | "income";
  paymentMethod: "cash" | "bank" | "upi";
  smsContent?: string;
  isSpend?: boolean;
  note?: string;
  billImage?: string;
};

export type CashBalance = {
  month: string; // YYYY-MM
  balance: number;
  isCarriedForward: boolean;
};

export type Bill = {
  id: string;
  amount: number;
  description: string;
  dueDate: string;
  isPaid: boolean;
};

export type AccountType = "bank" | "credit_card";

export type Account = {
  id: string;
  name: string;
  number: string;
  amount: number;
  type: AccountType;
  updatedAt: string;
  isEstimated?: boolean;
  logo?: string;
};

export type DashboardData = {
  totalSpend: number;
  cashInHand: number;
  latestTransactions: Transaction[];
  topSpendAreas: { category: string; amount: number }[];
  upcomingBills: Bill[];
};
