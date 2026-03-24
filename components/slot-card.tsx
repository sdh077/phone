import type { SavedSlot } from "@/types";

export default function SlotCard({
    title,
    slot,
    onSave,
    onLoad,
    onDelete,
}: {
    title: string;
    slot: SavedSlot | null;
    onSave: () => void;
    onLoad: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#101013] p-5">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-white">{title}</h3>
                <span className="text-xs text-white/35">
                    {slot ? "저장됨" : "비어있음"}
                </span>
            </div>

            {slot ? (
                <div className="mb-4 space-y-1 text-sm text-white/65">
                    <p className="font-medium text-white">{slot.name}</p>
                    <p>저장 시간: {slot.savedAt}</p>
                    <p>약정: {slot.data.contractMonths}개월</p>
                </div>
            ) : (
                <div className="mb-4 text-sm text-white/40">
                    현재 저장된 비교안이 없습니다.
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onSave}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
                >
                    저장
                </button>
                <button
                    onClick={onLoad}
                    disabled={!slot}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    불러오기
                </button>
                <button
                    onClick={onDelete}
                    disabled={!slot}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    삭제
                </button>
            </div>
        </div>
    );
}