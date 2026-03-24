import type { ParsedMoyoPlan } from "@/types";
import { formatNumber } from "@/lib/format";

type Props = {
    plans: ParsedMoyoPlan[];
    selectedPlanId: string;
    onSelectPlan: (plan: ParsedMoyoPlan) => void;
};

export default function MoyoPlanSelector({
    plans,
    selectedPlanId,
    onSelectPlan,
}: Props) {
    return (
        <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/20 p-4">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-cyan-200">
                    자급제 요금제 선택
                </h3>
                <p className="mt-1 text-sm text-white/55">
                    모요 링크 기반 요금제를 선택하면 월 요금이 자동 반영됩니다.
                </p>
            </div>

            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                {plans.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#101013] p-4 text-sm text-white/50">
                        불러올 수 있는 요금제가 없습니다.
                    </div>
                ) : (
                    plans.map((plan) => {
                        const active = selectedPlanId === plan.id;

                        return (
                            <button
                                key={plan.id}
                                type="button"
                                onClick={() => onSelectPlan(plan)}
                                className={[
                                    "w-full rounded-2xl border p-4 text-left transition",
                                    active
                                        ? "border-cyan-400 bg-cyan-400/10"
                                        : "border-white/10 bg-[#101013] hover:border-white/20",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-base font-semibold text-white">
                                            {plan.name}
                                        </p>
                                        <p className="mt-1 text-sm text-white/60">
                                            {plan.carrierNetwork ?? "-"} · {plan.tech ?? "-"} ·{" "}
                                            {plan.dataDescription ?? "-"}
                                        </p>

                                        {!plan.parseOk && (
                                            <p className="mt-2 text-xs text-amber-300">
                                                일부 정보 확인 필요
                                            </p>
                                        )}

                                        {plan.afterMonths && plan.afterPrice ? (
                                            <p className="mt-2 text-xs text-white/45">
                                                {plan.afterMonths}개월 이후{" "}
                                                {formatNumber(plan.afterPrice)}원
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold text-cyan-300">
                                            월 {formatNumber(plan.monthlyPrice)}원
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}