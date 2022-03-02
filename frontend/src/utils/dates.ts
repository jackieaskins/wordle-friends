import { Dayjs } from "dayjs";

const ISO_DATE_FORMAT = "YYYY-MM-DD";

export function formatDateString(date: Dayjs): string {
  return date.format(ISO_DATE_FORMAT);
}
