/**
 * Format an ISO date string into a human-readable date.
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export function formatDate(date, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}

/**
 * Return a short relative-time string (e.g. "2 days ago").
 * Falls back to formatDate for older timestamps.
 */
export function timeAgo(date) {
  if (!date) return '—';
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [
    [60, 'second'],
    [3600, 'minute'],
    [86400, 'hour'],
    [604800, 'day'],
    [2592000, 'week'],
    [31536000, 'month'],
  ];
  for (let i = units.length - 1; i >= 0; i--) {
    const [threshold, unit] = units[i];
    if (seconds >= threshold) {
      const value = Math.floor(seconds / threshold);
      return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}
