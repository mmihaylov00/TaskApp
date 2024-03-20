export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDate() + '').padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
