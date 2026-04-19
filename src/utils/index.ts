export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace('INR', '₹');
};

export const formatPaymentMethod = (method: string) => {
  return method.charAt(0).toUpperCase() + method.slice(1);
};
