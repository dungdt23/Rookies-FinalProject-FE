import dayjs from "dayjs";

export function toStandardFormat(date: string): string {
    return dayjs(date).format('DD/MM/YYYY')
}