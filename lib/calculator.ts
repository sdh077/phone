import type { FormState, ParsedMoyoPlan } from "@/types";
import { toNumber } from "./format";

export function getDefaultFormState(): FormState {
    return {
        contractMonths: "24",

        selfPhonePrice: "1200000",
        selfMonthlyPlan: "60000",
        useManualSelfPlan: false,

        agencyPhonePrice: "900000",
        agencyMaintainMonths: "6",
        agencyMaintainPlan: "95000",
        agencyAfterPlan: "55000",
        agencyBenefitPerMonth: "15000",
        agencyCardDiscountPerMonth: "10000",

        selectedMoyoPlanId: "",
        selectedMoyoPlanName: "",
        selectedMoyoPlanUrl: "",

        selectedPhoneProductId: "",
        selectedPhoneProductName: "",
        selectedPhoneProductUrl: "",
    };
}

export function getDefaultSlots() {
    return {
        slot1: null,
        slot2: null,
        slot3: null,
    };
}

export function calculateCosts(
    form: FormState,
    selectedPlan?: ParsedMoyoPlan | null
) {
    const months = Math.max(toNumber(form.contractMonths), 0);

    const selfPhonePrice = toNumber(form.selfPhonePrice);
    const manualSelfMonthly = toNumber(form.selfMonthlyPlan);

    let appliedSelfMonthly = manualSelfMonthly;
    let selfPlanTotal = manualSelfMonthly * months;

    if (!form.useManualSelfPlan && selectedPlan && selectedPlan.monthlyPrice > 0) {
        appliedSelfMonthly = selectedPlan.monthlyPrice;

        if (selectedPlan.afterMonths && selectedPlan.afterPrice) {
            const promoMonths = Math.min(months, selectedPlan.afterMonths);
            const normalMonths = Math.max(months - promoMonths, 0);

            selfPlanTotal =
                selectedPlan.monthlyPrice * promoMonths +
                selectedPlan.afterPrice * normalMonths;
        } else {
            selfPlanTotal = selectedPlan.monthlyPrice * months;
        }
    }

    const selfTotal = selfPhonePrice + selfPlanTotal;

    const agencyPhonePrice = toNumber(form.agencyPhonePrice);
    const agencyMaintainMonths = Math.max(toNumber(form.agencyMaintainMonths), 0);
    const safeMaintainMonths = Math.min(agencyMaintainMonths, months);
    const agencyRemainMonths = Math.max(months - safeMaintainMonths, 0);

    const agencyMaintainPlan = toNumber(form.agencyMaintainPlan);
    const agencyAfterPlan = toNumber(form.agencyAfterPlan);
    const agencyBenefitPerMonth = toNumber(form.agencyBenefitPerMonth);
    const agencyCardDiscountPerMonth = toNumber(form.agencyCardDiscountPerMonth);

    const agencyPlanTotal =
        agencyMaintainPlan * safeMaintainMonths +
        agencyAfterPlan * agencyRemainMonths;

    const agencyBenefitTotal = agencyBenefitPerMonth * months;
    const agencyCardDiscountTotal = agencyCardDiscountPerMonth * months;

    const agencyBaseTotal = agencyPhonePrice + agencyPlanTotal;
    const agencyTotal = Math.max(
        agencyBaseTotal - agencyBenefitTotal - agencyCardDiscountTotal,
        0
    );

    const diff = selfTotal - agencyTotal;

    return {
        months,
        appliedSelfMonthly,
        selfPlanTotal,
        selfTotal,
        safeMaintainMonths,
        agencyRemainMonths,
        agencyPlanTotal,
        agencyBenefitTotal,
        agencyCardDiscountTotal,
        agencyBaseTotal,
        agencyTotal,
        diff,
    };
}