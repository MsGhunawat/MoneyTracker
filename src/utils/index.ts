export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace('INR', '₹');
};

export const formatPaymentMethod = (paymentMethod: string) => {
  switch (paymentMethod) {
    case "cash":
      return "Cash";
    case "bank":
      return "Bank";
    case "upi":
      return "Online";
    default:
      return paymentMethod;
  }
};
