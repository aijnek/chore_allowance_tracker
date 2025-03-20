import { format, parse } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd');
};

export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'MMMM');
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getMonthOptions = (): string[] => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
};

export const getYearOptions = (): number[] => {
  const currentYear = getCurrentYear();
  return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
};

export const parseISODate = (dateString: string): Date => {
  return parse(dateString, 'yyyy-MM-dd', new Date());
};
