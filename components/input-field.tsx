type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    suffix?: string;
    placeholder?: string;
};

export default function InputField({
    label,
    value,
    onChange,
    suffix,
    placeholder = "숫자를 입력하세요",
}: Props) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-white/10 bg-[#111114] px-4 py-3 pr-20 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-400/60"
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}