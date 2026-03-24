export default function AffiliateCard({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group rounded-2xl border border-white/10 bg-[#101013] p-5 transition hover:border-amber-300/30 hover:bg-[#141419]"
        >
            <p className="text-lg font-semibold text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
            <div className="mt-4 text-sm font-medium text-amber-300 group-hover:text-amber-200">
                바로 보기 →
            </div>
        </a>
    );
}