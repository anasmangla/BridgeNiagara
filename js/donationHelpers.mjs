export function getDonationAmount(data) {
  if (data.amount) {
    return parseInt(data.amount, 10);
  }
  const custom = parseFloat(data.custom_amount || '0');
  return Math.round(custom * 100);
}

export function isValidAmount(amount) {
  return Number.isInteger(amount) && amount > 0;
}
