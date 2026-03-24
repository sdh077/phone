import * as cheerio from "cheerio";
import type { ParsedPhoneProduct } from "@/types";

function extractNumber(value?: string | null) {
    if (!value) return 0;
    const only = value.replace(/[^\d]/g, "");
    return only ? Number(only) : 0;
}

export async function parsePhoneProduct(
    id: string,
    sourceUrl: string
): Promise<ParsedPhoneProduct> {
    try {
        const res = await fetch(sourceUrl, {
            redirect: "follow",
            cache: "no-store",
            headers: {
                "user-agent": "Mozilla/5.0",
                "accept-language": "ko-KR,ko;q=0.9,en;q=0.8",
            },
        });

        const finalUrl = res.url;
        const html = await res.text();
        const $ = cheerio.load(html);

        const bodyText = $("body").text().replace(/\s+/g, " ").trim();

        const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
        const pageTitle = $("title").first().text().trim();

        const name =
            ogTitle ||
            bodyText.match(/#\s*([^#]+?)\s+\d[\d,]*\s*개\s*상품평/)?.[1]?.trim() ||
            pageTitle.split("-")[0]?.trim() ||
            "상품명 확인 필요";

        const priceFromMeta =
            $('meta[property="product:price:amount"]').attr("content")?.trim() || "";

        const priceFromText =
            bodyText.match(/(\d[\d,]*)원\s+이 상품은 내일 도착/)?.[1] ||
            bodyText.match(/(\d[\d,]*)원/)?.[1] ||
            "";

        const price = extractNumber(priceFromMeta || priceFromText);

        return {
            id,
            sourceUrl,
            finalUrl,
            name,
            price,
            parseOk: price > 0,
        };
    } catch {
        return {
            id,
            sourceUrl,
            name: "상품 확인 필요",
            price: 0,
            parseOk: false,
        };
    }
}