import { describe, it, expect } from 'vitest';
import {
  getToday,
  addDays,
  convertToUTC,
  convertToPDT,
  formatDate,
  VANCOUVER_TIMEZONE,
} from '@/utils/dates';
import dayjs from 'dayjs';

describe('Date Utilities', () => {
  it('should have the correct timezone, "America/Vancouver"', () => {
    expect(VANCOUVER_TIMEZONE).toBe('America/Vancouver');
  });

  it('should return the current date in Vancouver time at 12:00 AM', () => {
    const expectedDate = dayjs().tz(VANCOUVER_TIMEZONE).startOf('day').toDate();
    const today = getToday();
    expect(today).toStrictEqual(expectedDate);
  });

  it('should add days to a given date', () => {
    const date = new Date('2024-08-01T00:00:00Z');
    const newDate = addDays(date, 7);
    expect(newDate.toISOString()).toBe('2024-08-08T00:00:00.000Z');
  });

  it('should handle already UTC dates correctly', () => {
    const utcDate = new Date('2024-08-01T00:00:00Z');
    const result = convertToUTC(utcDate);
    expect(result).toEqual(utcDate);
  });

  describe('should convert a PDT time to UTC time (-7 hrs)', () => {
    it('should convert 2024/03/10 10:00:00 PDT to 2024/03/10 17:00:00 UTC', () => {
      const pdtDate = new Date('2024-03-10T10:00:00-07:00');
      const utcDate = convertToUTC(pdtDate);
      expect(utcDate.toISOString()).toBe('2024-03-10T17:00:00.000Z');
    });
  });

  describe('should convert a PST time to UTC time (-8 hrs)', () => {
    it('should convert 2024/11/03 10:00:00 PST to 2024/11/03 18:00:00 UTC', () => {
      const pstDate = new Date('2024-11-03T10:00:00-08:00');
      const utcDate = convertToUTC(pstDate);
      expect(utcDate.toISOString()).toBe('2024-11-03T18:00:00.000Z');
    });
  });

  describe('should convert a UTC time to PDT time (-7 hrs)', () => {
    it('should convert 2024/11/03 00:00:00 UTC to 2024/11/02 17:00:00 PST', () => {
      const utcDate = new Date('2024-11-03T00:00:00Z');
      const pstDate = convertToPDT(utcDate);
      expect(pstDate.toLocaleString()).toBe('11/2/2024, 5:00:00 PM');
    });
  });

  describe('should convert a UTC time to PST time (-8 hrs)', () => {
    it('should convert 2024/03/10 00:00:00 UTC to 2024/03/09 16:00:00 PDT', () => {
      const utcDate = new Date('2024-03-10T00:00:00Z');
      const pdtDate = convertToPDT(utcDate);
      expect(pdtDate.toLocaleString()).toBe('3/9/2024, 4:00:00 PM');
    });
  });

  it('should format a date to "YYYY/MM/DD"', () => {
    const date = new Date('2021-09-30T17:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('2021/09/30');
  });
});
