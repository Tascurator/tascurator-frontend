import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * The timezone for Vancouver, British Columbia.
 */
export const VANCOUVER_TIMEZONE = 'America/Vancouver';

/**
 * Get the current date in the Pacific Time Zone (Vancouver).
 *
 * @returns
 * The current date in Vancouver time
 *
 * @example
 * const today = getToday();
 * console.log(today); // 2021-10-01T07:00:00.000Z
 * it considers the daylight saving time (PDT) and returns the date in Vancouver time.
 *
 * const pdt = dayjs.tz('2024-03-10T10:00:00', 'America/Vancouver');
 * console.log(pdt.format()); // 2024-03-10T10:00:00-07:00
 * const pst = dayjs.tz('2024-11-03T10:00:00', 'America/Vancouver');
 * console.log(pst.format()); // 2024-11-03T10:00:00-08:00
 *
 * @see
 *  - https://day.js.org/docs/en/timezone/timezone
 */
export const getToday = (): Date => {
  return dayjs().tz(VANCOUVER_TIMEZONE).startOf('day').toDate();
};

/**
 * Add a specified number of days to a given date.
 *
 * @param date - The initial date (startDate)
 * @param days - The number of days to add
 *
 * @returns
 * The new date after adding the specified number of days
 *
 * @example
 * const date = dayjs('2021-10-01T00:00:00Z').toDate();
 * const newDate = addDays(date, 7);
 * console.log(newDate); // 2021-10-08T00:00:00.000Z
 *
 * @see
 *  - https://day.js.org/docs/en/manipulate/add#docsNav
 */
export const addDays = (date: Date, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

/**
 * Convert a date to UTC time.
 *
 * @param date - The date to convert
 *
 * @returns
 * The date in UTC time
 *
 * @example
 * const pdtDate = new Date('2021-09-30T17:00:00Z');
 * const utcDate = convertToUTC(pdtDate);
 * console.log(utcDate); // 2021-10-01T00:00:00.000Z
 *
 * @see
 * - https://day.js.org/docs/en/manipulate/utc#docsNav
 */
export const convertToUTC = (date: Date): Dayjs => {
  return dayjs(date).utc();
};

/**
 * Convert a date to Pacific Time (PDT).
 *
 * @param date - The date to convert
 *
 * @returns
 * The date in Pacific Time (PDT)
 *
 * @example
 * const utcDate = new Date('2021-10-01T00:00:00Z');
 * const pdtDate = convertToPDT(utcDate);
 * console.log(pdtDate); // 2021-09-30T17:00:00.000Z
 *
 * @see
 * - https://day.js.org/docs/en/plugin/timezone#docsNav
 */
export const convertToPDT = (date: Date): Dayjs => {
  return dayjs.utc(date).tz(VANCOUVER_TIMEZONE);
};

/**
 *
 * @param date
 *
 * @returns
 * The formatted date in the format "YYYY/MM/DD"
 *
 * @example
 * const date = new Date('2021-10-01T00:00:00Z');
 * const formattedDate = formatDate(date);
 * console.log(formattedDate); // 2021/10/01
 *
 * @see
 * - https://day.js.org/docs/en/display/format#docsNav
 */
export const formatDate = (date: Dayjs): string => {
  return date.format('YYYY/MM/DD');
};
