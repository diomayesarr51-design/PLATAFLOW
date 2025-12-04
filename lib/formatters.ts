export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateInput: string | Date, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };

  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date);
};

export const formatRelativeTime = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) return "à l'instant";
  if (Math.abs(diffInSeconds) < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (Math.abs(diffInSeconds) < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  if (Math.abs(diffInSeconds) < 604800) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  
  return formatDate(date); // Fallback to absolute date if too old
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};