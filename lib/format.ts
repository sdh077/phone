export function toNumber(value: string) {
    const num = Number(String(value).replace(/[^\d.-]/g, ""));
    return Number.isNaN(num) ? 0 : num;
}

export function formatNumber(value: number) {
    return new Intl.NumberFormat("ko-KR").format(value);
}