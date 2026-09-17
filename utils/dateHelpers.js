import { format } from "date-fns";

export const toLocalNoon = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
};

export const formatDateForApi = (value) => {
  if (!value) return "";
  return format(toLocalNoon(value), "yyyy-MM-dd");
};

export const formatDateForDisplay = (value) => {
  if (!value) return "";
  return format(toLocalNoon(value), "dd-MM-yyyy");
};
