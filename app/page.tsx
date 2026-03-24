"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormState, ParsedMoyoPlan, SlotMap } from "@/types";
import {
  calculateCosts,
  getDefaultFormState,
  getDefaultSlots,
} from "@/lib/calculator";
import { formatNumber, toNumber } from "@/lib/format";
import InputField from "@/components/input-field";
import Row from "@/components/row";
import SummaryCard from "@/components/summary-card";
import SlotCard from "@/components/slot-card";
import AffiliateCard from "@/components/affiliate-card";
import MoyoPlanSelector from "@/components/moyo-plan-selector";

const STORAGE_KEY = "phone-compare-slots-v1";

export default function HomePage() {
  const [form, setForm] = useState<FormState>(getDefaultFormState());
  const [slots, setSlots] = useState<SlotMap>(getDefaultSlots());
  const [slotName, setSlotName] = useState("");

  const [moyoPlans, setMoyoPlans] = useState<ParsedMoyoPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as SlotMap;
      setSlots({
        slot1: parsed.slot1 ?? null,
        slot2: parsed.slot2 ?? null,
        slot3: parsed.slot3 ?? null,
      });
    } catch {
      setSlots(getDefaultSlots());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    fetch("/api/moyo-plans")
      .then((res) => res.json())
      .then((data: ParsedMoyoPlan[]) => {
        setMoyoPlans(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setMoyoPlans([]);
      })
      .finally(() => {
        setLoadingPlans(false);
      });
  }, []);

  const selectedPlan = useMemo(() => {
    return moyoPlans.find((plan) => plan.id === form.selectedMoyoPlanId) ?? null;
  }, [moyoPlans, form.selectedMoyoPlanId]);

  const result = useMemo(() => {
    return calculateCosts(form, selectedPlan);
  }, [form, selectedPlan]);

  const diffText =
    result.diff > 0
      ? "통신사 구매가 더 저렴"
      : result.diff < 0
        ? "자급제가 더 저렴"
        : "두 방식의 총비용이 동일";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function saveToSlot(slotKey: keyof SlotMap) {
    const finalName =
      slotName.trim() ||
      `비교안 ${slotKey === "slot1" ? "1" : slotKey === "slot2" ? "2" : "3"}`;

    setSlots((prev) => ({
      ...prev,
      [slotKey]: {
        name: finalName,
        data: form,
        savedAt: new Date().toLocaleString("ko-KR"),
      },
    }));

    setSlotName("");
  }

  function loadFromSlot(slotKey: keyof SlotMap) {
    const slot = slots[slotKey];
    if (!slot) return;
    setForm(slot.data);
  }

  function deleteSlot(slotKey: keyof SlotMap) {
    setSlots((prev) => ({
      ...prev,
      [slotKey]: null,
    }));
  }

  function resetForm() {
    setForm(getDefaultFormState());
    setSlotName("");
  }

  function selectMoyoPlan(plan: ParsedMoyoPlan) {
    setForm((prev) => ({
      ...prev,
      selectedMoyoPlanId: plan.id,
      selectedMoyoPlanName: plan.name,
      selectedMoyoPlanUrl: plan.sourceUrl,
      selfMonthlyPlan: String(plan.monthlyPrice || 0),
    }));
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            휴대폰 구매 비교 계산기
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            자급제 vs 통신사 구매 비교
          </h1>
          <p className="mt-3 text-sm text-white/60 md:text-base">
            휴대폰 자급제와 통신사 구매 중 어떤 방식이 더 저렴한지 실제 총비용으로
            비교해보세요.
          </p>
        </div>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">비교안 저장 슬롯</h2>
              <p className="mt-1 text-sm text-white/55">
                현재 입력값을 저장해두고 나중에 다시 불러올 수 있어요.
              </p>
            </div>

            <div className="w-full md:w-[320px]">
              <label className="mb-2 block text-sm font-medium text-white/80">
                저장 이름
              </label>
              <input
                value={slotName}
                onChange={(e) => setSlotName(e.target.value)}
                placeholder="예: 아이폰 17 자급제안"
                className="w-full rounded-2xl border border-white/10 bg-[#111114] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-emerald-400/60"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SlotCard
              title="슬롯 1"
              slot={slots.slot1}
              onSave={() => saveToSlot("slot1")}
              onLoad={() => loadFromSlot("slot1")}
              onDelete={() => deleteSlot("slot1")}
            />
            <SlotCard
              title="슬롯 2"
              slot={slots.slot2}
              onSave={() => saveToSlot("slot2")}
              onLoad={() => loadFromSlot("slot2")}
              onDelete={() => deleteSlot("slot2")}
            />
            <SlotCard
              title="슬롯 3"
              slot={slots.slot3}
              onSave={() => saveToSlot("slot3")}
              onLoad={() => loadFromSlot("slot3")}
              onDelete={() => deleteSlot("slot3")}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={resetForm}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
            >
              기본값으로 초기화
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <h2 className="mb-4 text-lg font-semibold text-white">공통 입력</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="약정 개월 수"
              value={form.contractMonths}
              onChange={(value) => updateField("contractMonths", value)}
              suffix="개월"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 shadow-2xl shadow-cyan-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-300">Case 1</p>
                <h2 className="text-2xl font-bold text-white">자급제</h2>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
                단순 구매 방식
              </span>
            </div>

            <div className="space-y-4">
              <InputField
                label="구매 가격"
                value={form.selfPhonePrice}
                onChange={(value) => updateField("selfPhonePrice", value)}
                suffix="원"
              />

              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.useManualSelfPlan}
                  onChange={(e) =>
                    updateField("useManualSelfPlan", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                직접 입력한 월 요금제 사용
              </label>

              <InputField
                label="월 요금제(직접입력)"
                value={form.selfMonthlyPlan}
                onChange={(value) => updateField("selfMonthlyPlan", value)}
                suffix="원"
              />
            </div>

            {loadingPlans ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#101013] p-4 text-sm text-white/50">
                모요 요금제 불러오는 중...
              </div>
            ) : (
              <MoyoPlanSelector
                plans={moyoPlans}
                selectedPlanId={form.selectedMoyoPlanId}
                onSelectPlan={selectMoyoPlan}
              />
            )}

            {form.selectedMoyoPlanUrl && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-300">
                  선택한 요금제
                </p>
                <p className="mt-1 text-white">{form.selectedMoyoPlanName}</p>

                <a
                  href={form.selectedMoyoPlanUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-4 inline-flex rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black"
                >
                  모요에서 가입하러 가기
                </a>

                <p className="mt-3 text-xs leading-5 text-white/45">
                  이 링크는 제휴 링크일 수 있으며, 가입 시 일정 수익이 발생할 수
                  있습니다.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/20 p-4">
              <h3 className="mb-3 text-sm font-semibold text-cyan-200">
                계산 결과
              </h3>
              <div className="space-y-3 text-sm text-white/75">
                <Row
                  label="휴대폰 가격"
                  value={`${formatNumber(toNumber(form.selfPhonePrice))}원`}
                />
                <Row
                  label="적용 월 요금"
                  value={`${formatNumber(result.appliedSelfMonthly)}원`}
                />
                <Row
                  label="요금제 총합"
                  value={`${formatNumber(result.selfPlanTotal)}원`}
                />
                <Row
                  label="총비용"
                  value={`${formatNumber(result.selfTotal)}원`}
                  strong
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-b from-violet-500/10 to-transparent p-6 shadow-2xl shadow-violet-950/20">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-300">Case 2</p>
                <h2 className="text-2xl font-bold text-white">통신사 구매</h2>
              </div>
              <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-200">
                약정 / 혜택 포함
              </span>
            </div>

            <div className="space-y-4">
              <InputField
                label="휴대폰 가격"
                value={form.agencyPhonePrice}
                onChange={(value) => updateField("agencyPhonePrice", value)}
                suffix="원"
              />

              <InputField
                label="유지 개월 수"
                value={form.agencyMaintainMonths}
                onChange={(value) => updateField("agencyMaintainMonths", value)}
                suffix="개월"
              />

              <InputField
                label="유지 기간 월 요금제"
                value={form.agencyMaintainPlan}
                onChange={(value) => updateField("agencyMaintainPlan", value)}
                suffix="원"
              />

              <InputField
                label="유지 이후 월 요금제"
                value={form.agencyAfterPlan}
                onChange={(value) => updateField("agencyAfterPlan", value)}
                suffix="원"
              />

              <InputField
                label="통신사별 혜택 월 예상액"
                value={form.agencyBenefitPerMonth}
                onChange={(value) =>
                  updateField("agencyBenefitPerMonth", value)
                }
                suffix="원"
              />

              <InputField
                label="카드 할인"
                value={form.agencyCardDiscountPerMonth}
                onChange={(value) =>
                  updateField("agencyCardDiscountPerMonth", value)
                }
                suffix="원/월"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-violet-300/15 bg-black/20 p-4">
              <h3 className="mb-3 text-sm font-semibold text-violet-200">
                계산 결과
              </h3>
              <div className="space-y-3 text-sm text-white/75">
                <Row
                  label="유지 개월 수 반영"
                  value={`${formatNumber(result.safeMaintainMonths)}개월`}
                />
                <Row
                  label="유지 이후 개월 수"
                  value={`${formatNumber(result.agencyRemainMonths)}개월`}
                />
                <Row
                  label="요금제 총합"
                  value={`${formatNumber(result.agencyPlanTotal)}원`}
                />
                <Row
                  label="통신사 혜택 총합"
                  value={`- ${formatNumber(result.agencyBenefitTotal)}원`}
                />
                <Row
                  label="카드 할인 총합"
                  value={`- ${formatNumber(result.agencyCardDiscountTotal)}원`}
                />
                <Row
                  label="할인 전 총비용"
                  value={`${formatNumber(result.agencyBaseTotal)}원`}
                />
                <Row
                  label="총비용"
                  value={`${formatNumber(result.agencyTotal)}원`}
                  strong
                />
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/50">Summary</p>
              <h2 className="text-2xl font-bold text-white">최종 비교</h2>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {diffText}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              title="자급제 총비용"
              value={`${formatNumber(result.selfTotal)}원`}
            />
            <SummaryCard
              title="통신사 총비용"
              value={`${formatNumber(result.agencyTotal)}원`}
            />
            <SummaryCard
              title="차액"
              value={`${formatNumber(Math.abs(result.diff))}원`}
              description={diffText}
              highlight
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-gradient-to-b from-amber-500/10 to-transparent p-6 shadow-2xl shadow-amber-950/20">
          <div className="mb-5">
            <p className="text-sm text-amber-300">추가 제휴 영역</p>
            <h2 className="text-2xl font-bold text-white">추가 추천 링크</h2>
            <p className="mt-2 text-sm text-white/60">
              쿠팡 파트너스나 다른 제휴 링크를 여기에 연결할 수 있어요.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AffiliateCard
              title="자급제 아이폰 보기"
              description="아이폰 자급제 상품을 확인하는 제휴 링크 영역"
              href="https://example.com/affiliate-1"
            />
            <AffiliateCard
              title="자급제 갤럭시 보기"
              description="갤럭시 자급제 상품을 확인하는 제휴 링크 영역"
              href="https://example.com/affiliate-2"
            />
            <AffiliateCard
              title="충전기 / 액세서리 보기"
              description="함께 필요한 액세서리를 연결하는 제휴 링크 영역"
              href="https://example.com/affiliate-3"
            />
          </div>

          <p className="mt-4 text-xs leading-6 text-white/45">
            이 영역에는 제휴 링크가 포함될 수 있으며, 링크를 통해 일정 수익이
            발생할 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}