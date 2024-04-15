export function formatDate(date: Date | string) {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const day = (date.getDate() + '').padStart(2, '0');

  return `${getDayOfWeek(date)}, ${getMonth(date)} ${day}${getDaySuffix(
    date,
  )} ${date.getFullYear()}`;
}

export function simpleDateFormat(date: Date | string) {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDate() + '').padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function relativeDateFormat(date: Date | string) {
  if (!date) return undefined;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const suffix = getSuffix(date);

  return `${simpleDateFormat(date)} ${suffix ? '(' + suffix + ')' : ''}`;
}

function getSuffix(date: Date) {
  const diffHours = Math.floor(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60),
  );
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  return rtf.format(
    Math.ceil(diffHours > 720 ? diffHours / 24 / 30 : diffHours / 24),
    Math.abs(diffHours) > 720 ? 'month' : 'day',
  );
}

export function getDaySuffix(date: Date) {
  switch (date.getDate()) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
  }
  return 'th';
}

export function getDayOfWeek(date: Date): string {
  switch (date.getDay()) {
    case 0:
      return 'Monday';
    case 1:
      return 'Tuesday';
    case 2:
      return 'Wednesday';
    case 3:
      return 'Thursday';
    case 4:
      return 'Friday';
    case 5:
      return 'Saturday';
    case 6:
      return 'Sunday';
  }
  return '';
}

export function getMonth(date: Date): string {
  switch (date.getMonth()) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
  }
  return '';
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
