export default function Row({
    label,
    value,
    strong = false,
}: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
            <span className="text-white/60">{label}</span>
            <span className={strong ? "font-bold text-white" : "text-white/85"}>
                {value}
            </span>
        </div>
    );
}