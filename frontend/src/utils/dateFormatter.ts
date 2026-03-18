/**
 * Formats an ISO date string for display.
 * @example formatDate('2024-01-15') // 'January 15, 2024'
 */
const toValidDate = (value: string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export function formatDate(isoString: string | null | undefined): string {
  const date = toValidDate(isoString);
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns a short date: 'Jan 15, 2024'
 */
export function formatShortDate(isoString: string | null | undefined): string {
  const date = toValidDate(isoString);
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns a relative label like "3 days ago" or "in 2 weeks".
 */
export function timeAgo(isoString: string | null | undefined): string {
  const date = toValidDate(isoString);
  if (!date) {
    return 'Unknown time';
  }

  const now = Date.now();
  const then = date.getTime();
  const diff = Math.round((then - now) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const abs = Math.abs(diff);
  if (abs < 60)   return rtf.format(diff, 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
  if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
  return rtf.format(Math.round(diff / 31536000), 'year');
}
