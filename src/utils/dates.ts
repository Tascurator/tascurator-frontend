/**
 * Returns the offset in hours between the Pacific Daylight Time (PDT) time zone and UTC based on the given date.
 *
 * @param date - The date to check for Daylight Saving Time
 *
 * @credits
 *   - https://stackoverflow.com/a/11888430
 *   - https://medium.com/make-it-heady/javascript-handle-date-in-any-timezone-with-daylight-saving-check-182657009310
 */
const getPDTOffset = (date: Date): number => {
  const stdTimezoneOffset = () => {
    const jan = new Date(0, 1);
    const jul = new Date(6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  const isDstObserved = (today: Date) => {
    return today.getTimezoneOffset() < stdTimezoneOffset();
  };

  // PDT is UTC-7 during Daylight Saving Time, and UTC-8 otherwise
  if (isDstObserved(date)) {
    return -7;
  }
  return -8;
};

/**
 * Get current date in the Pacific Daylight Time (PDT) time zone.
 */
export const getToday = (): Date => {
  return convertToPDT(new Date());
};

/**
 * Add a specified number of days to a given date.
 *
 * @param date - The initial date (startDate)
 * @param days - The number of days to add
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Convert Pacific Time to UTC+0 time.
 *
 * @param date - The date to convert
 * @example
 * const pdtDate = new Date('2021-09-30T17:00:00Z');
 * const utcDate = convertToUTC(pdtDate);
 * console.log(utcDate); // 2021-10-01T00:00:00.000Z
 *
 */
export const convertToUTC = (date: Date): Date => {
  const pdtOffset = getPDTOffset(date);
  const utcTime = date.getTime() - pdtOffset * 60 * 60 * 1000;
  return new Date(utcTime);
};

/**
 * Convert UTC+0 time to Pacific Time.
 *
 * @param date - The date to convert
 * @example
 *  const utcDate = new Date('2021-10-01T00:00:00Z');
 *  const pdtDate = convertToPDT(utcDate);
 *  console.log(pdtDate); // 2021-09-30T17:00:00.000Z
 */
export const convertToPDT = (date: Date): Date => {
  const pdtOffset = getPDTOffset(date);
  const pdtTime = date.getTime() + pdtOffset * 60 * 60 * 1000;
  return new Date(pdtTime);
};

/**
 * Format a date as a string in the format "YYYY/MM/DD".
 *
 * @param date - The date to format
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};
