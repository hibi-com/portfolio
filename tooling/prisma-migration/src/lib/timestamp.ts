function padZero(n: number, length = 2): string {
    return String(n).padStart(length, "0");
}

export function getTimestamp(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = padZero(date.getMonth() + 1);
    const d = padZero(date.getDate());
    const h = padZero(date.getHours());
    const min = padZero(date.getMinutes());
    const s = padZero(date.getSeconds());
    return `${y}${m}${d}${h}${min}${s}`;
}
