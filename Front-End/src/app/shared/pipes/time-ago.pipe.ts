import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value?: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const units: [number, string][] = [
      [60, 'second'],
      [60, 'minute'],
      [24, 'hour'],
      [7, 'day'],
      [4.345, 'week'],
      [12, 'month'],
      [Number.POSITIVE_INFINITY, 'year'],
    ];

    let unitAmount = seconds;
    let unitName = 'second';

    for (const [limit, name] of units) {
      if (unitAmount < limit) {
        unitName = name;
        break;
      }
      unitAmount = Math.floor(unitAmount / limit);
      unitName = name;
    }

    if (seconds < 45) return 'just now';

    return `${unitAmount} ${unitName}${unitAmount !== 1 ? 's' : ''} ago`;
  }
}
