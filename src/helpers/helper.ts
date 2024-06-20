import dayjs, { Dayjs } from 'dayjs';
export function nameof<T>(key: keyof T): string {
    return key as string;
}

export function toISOStringWithoutTimezone(date: Dayjs) {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS')
}