import type { ParsedPhoneProduct } from "@/types";
import { formatNumber } from "@/lib/format";

type Props = {
    products: ParsedPhoneProduct[];
    selectedProductId: string;
    onSelectProduct: (product: ParsedPhoneProduct) => void;
};

export default function PhoneSelector({
    products,
    selectedProductId,
    onSelectProduct,
}: Props) {
    return (
        <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/20 p-4">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-cyan-200">휴대폰 선택</h3>
                <p className="mt-1 text-sm text-white/55">
                    등록한 쿠팡 링크에서 상품명과 가격을 읽어와 선택할 수 있어요.
                </p>
            </div>

            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                {products.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#101013] p-4 text-sm text-white/50">
                        불러올 수 있는 휴대폰이 없습니다.
                    </div>
                ) : (
                    products.map((product) => {
                        const active = selectedProductId === product.id;

                        return (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => onSelectProduct(product)}
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
                                            {product.name}
                                        </p>
                                        {product.brand ? (
                                            <p className="mt-1 text-sm text-white/60">
                                                브랜드: {product.brand}
                                            </p>
                                        ) : null}
                                        {!product.parseOk && (
                                            <p className="mt-2 text-xs text-amber-300">
                                                일부 정보 확인 필요
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold text-cyan-300">
                                            {formatNumber(product.price)}원
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