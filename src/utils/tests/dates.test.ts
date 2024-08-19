import { describe, it, expect } from 'vitest';
import {
  getToday,
  addDays,
  convertToUTC,
  convertToPDT,
  formatDate,
} from '@/utils/dates';

describe('Date Utilities', () => {
  it('should return the current date in Vancouver time at 12:00 AM', () => {
    const today = getToday();
    expect(today.toISOString()).toBe('2024-08-19T07:00:00.000Z');
  });

  it('should add days to a given date', () => {
    const date = new Date('2024-08-01T00:00:00Z');
    const newDate = addDays(date, 7);
    expect(newDate.toISOString()).toBe('2024-08-08T00:00:00.000Z');
  });

  it('should convert a PDT time to UTC time', () => {
    const pdtDate = new Date('2021-09-30T17:00:00Z');
    const utcDate = convertToUTC(pdtDate);
    expect(utcDate.toLocaleString()).toBe('9/30/2021, 10:00:00 AM');
  });

  it('should convert a UTC time to Pacific Time (PDT)', () => {
    const utcDate = new Date('2021-09-30T00:00:00Z');
    const pdtDate = convertToPDT(utcDate);
    expect(pdtDate.toLocaleString()).toBe('9/30/2021, 7:00:00 AM');
  });

  it('should format a date to "YYYY/MM/DD"', () => {
    const date = new Date('2021-09-30T17:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('2021/09/30');
  });
});
