// Expiration values are in MINUTES to support sub-hour options (e.g. 30 minutes)
export const EXPIRATION_OPTIONS = [
  { value: 30,    label: '30 Minutes' },
  { value: 60,    label: '1 Hour' },
  { value: 360,   label: '6 Hours' },
  { value: 720,   label: '12 Hours' },
  { value: 1440,  label: '24 Hours' },
  { value: 4320,  label: '3 Days' },
  { value: 10080, label: '7 Days' },
  { value: 21600, label: '15 Days' },
  { value: 43200, label: '30 Days' },
];

export const DEFAULT_EXPIRATION_MINUTES = 1440; // 24 hours

/**
 * Returns a highly-polished human-readable expiration string.
 * Matches: "Expires in 28 Minutes", "Expires in 5 Hours", "Expires Tomorrow", "Expires in 6 Days".
 */
export function formatExpiresIn(expiresAt) {
  if (!expiresAt) return '';
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diffMs = expiry - now;

  if (diffMs <= 0) return 'Expired';

  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(diffMs / 3600000);
  const totalDays = Math.floor(diffMs / 86400000);

  if (totalMinutes < 60) {
    return `Expires in ${totalMinutes} ${totalMinutes === 1 ? 'Minute' : 'Minutes'}`;
  }
  if (totalHours < 24) {
    return `Expires in ${totalHours} ${totalHours === 1 ? 'Hour' : 'Hours'}`;
  }
  if (totalDays === 1) {
    return 'Expires Tomorrow';
  }
  return `Expires in ${totalDays} Days`;
}

/**
 * Returns a simple countdown badge format.
 */
export function formatCountdownBadge(expiresAt) {
  if (!expiresAt) return '';

  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diffMs = expiry - now;

  if (diffMs <= 0) return 'Expired';

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days >= 1) return `${days}d left`;
  if (hours >= 1) return `${hours}h left`;
  if (minutes >= 1) return `${minutes}m left`;
  return '<1m left';
}

export function isNoteExpired(note) {
  if (!note?.expiresAt) return false;
  return new Date(note.expiresAt).getTime() <= Date.now();
}
