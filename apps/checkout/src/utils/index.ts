export const formatExpiry = (val: string) => {
  const clean = val.replace(/\D/g, "").slice(0, 4);
  if (clean.length > 2) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
};

export const validateExpiry = (val: string): string | null => {
  if (!val.trim()) {
    return "Expiry date is required";
  }
  if (!/^\d{2}\/\d{2}$/.test(val.trim())) {
    return "Use MM/YY format";
  }
  const [expMonthStr, expYearStr] = val.trim().split("/");
  const expMonth = parseInt(expMonthStr, 10);
  const expYear = 2000 + parseInt(expYearStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (expMonth < 1 || expMonth > 12) {
    return "Invalid month (01-12)";
  }
  if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    return "Card has expired. Card will not work";
  }
  return null;
};
