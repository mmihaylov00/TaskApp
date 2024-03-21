export function formatDate(date: Date | string) {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDate() + '').padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
export function formatDateTime(date: Date | string) {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const hour = (date.getHours() + '').padStart(2, '0');
  const minutes = (date.getMinutes() + '').padStart(2, '0');
  const seconds = (date.getSeconds() + '').padStart(2, '0');

  return `${formatDate(date)} ${hour}:${minutes}:${seconds}`;
}
