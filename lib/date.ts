import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function formatRu(date: number | Date | string, _format: string) {
  return format(new Date(date), _format, { locale: ru });
}
