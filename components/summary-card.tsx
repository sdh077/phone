export default function SummaryCard({
    title,
    value,
    description,
    highlight = false,
}: {
    title: string;
    value: string;
    description?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-2xl border p-5",
                highlight
                    ? "border-emerald-400/20 bg-emerald-400/10"
                    : "border-white/10 bg-[#101013]",
            ].join(" ")}
        >
            <p className="text-sm text-white/50">{title}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
            {description && (
                <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
            )}
        </div>
    );
}