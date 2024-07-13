/**
 * Returns the offset in hours from UTC for the Pacific Daylight Time (PDT) time zone.
 *
 * @credits
 *   - https://stackoverflow.com/a/11888430
 *   - https://medium.com/make-it-heady/javascript-handle-date-in-any-timezone-with-daylight-saving-check-182657009310
 */
const getPDTOffset = (): number => {
  const stdTimezoneOffset = () => {
    const jan = new Date(0, 1);
    const jul = new Date(6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  const today = new Date();

  const isDstObserved = (today: Date) => {
    return today.getTimezoneOffset() < stdTimezoneOffset();
  };

  // PDT is UTC-7 during Daylight Saving Time, and UTC-8 otherwise
  if (isDstObserved(today)) {
    return -7;
  }
  return -8;
};

/**
 * Get current date in the Pacific Daylight Time (PDT) time zone.
 *
 * @credits https://medium.com/make-it-heady/javascript-handle-date-in-any-timezone-with-daylight-saving-check-182657009310
 */
export const getToday = (): Date => {
  const d = new Date();

  // Convert to milliseconds since Jan 1, 1970
  const localTime = d.getTime();

  // Obtain local UTC offset and convert to milliseconds
  const localOffset = d.getTimezoneOffset() * 60 * 1000;

  // Obtain UTC time in milliseconds
  const utcTime = localTime + localOffset;

  // Get PDT offset
  const pdtOffset = getPDTOffset();
  const pdtTime = utcTime + 60 * 60 * 1000 * pdtOffset;

  return new Date(pdtTime);
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
