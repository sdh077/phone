export type FormState = {
    contractMonths: string;

    selfPhonePrice: string;
    selfMonthlyPlan: string;
    useManualSelfPlan: boolean;

    agencyPhonePrice: string;
    agencyMaintainMonths: string;
    agencyMaintainPlan: string;
    agencyAfterPlan: string;
    agencyBenefitPerMonth: string;
    agencyCardDiscountPerMonth: string;

    selectedMoyoPlanId: string;
    selectedMoyoPlanName: string;
    selectedMoyoPlanUrl: string;

    selectedPhoneProductId: string;
    selectedPhoneProductName: string;
    selectedPhoneProductUrl: string;
};

export type SavedSlot = {
    name: string;
    data: FormState;
    savedAt: string;
};

export type SlotMap = {
    slot1: SavedSlot | null;
    slot2: SavedSlot | null;
    slot3: SavedSlot | null;
};

export type ParsedMoyoPlan = {
    id: string;
    sourceUrl: string;
    finalUrl?: string;
    name: string;
    monthlyPrice: number;
    afterMonths?: number;
    afterPrice?: number;
    carrierNetwork?: string;
    tech?: string;
    dataDescription?: string;
    parseOk: boolean;
};

export type ParsedPhoneProduct = {
    id: string;
    sourceUrl: string;
    finalUrl?: string;
    name: string;
    price: number;
    brand?: string;
    model?: string;
    parseOk: boolean;
};