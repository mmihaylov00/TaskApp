import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { simpleDateFormat } from '../utils/date-formatter.util';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }

  override format(date: Date, displayFormat: Object): string {
    return simpleDateFormat(date);
  }
}
