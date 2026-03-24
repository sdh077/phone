import * as cheerio from "cheerio";
import type { ParsedMoyoPlan } from "@/types";

function extractNumber(value?: string | null) {
    if (!value) return 0;
    const only = value.replace(/[^\d]/g, "");
    return only ? Number(only) : 0;
}

function findTextByRegex($: cheerio.CheerioAPI, regex: RegExp) {
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const match = bodyText.match(regex);
    return match?.[1]?.trim();
}

export async function parseMoyoPlan(
    id: string,
    sourceUrl: string
): Promise<ParsedMoyoPlan> {
    try {
        const res = await fetch(sourceUrl, {
            redirect: "follow",
            cache: "no-store",
            headers: {
                "user-agent": "Mozilla/5.0",
            },
        });

        const finalUrl = res.url;
        const html = await res.text();
        const $ = cheerio.load(html);

        const title = $("title").first().text().trim();

        const name =
            $('meta[property="og:title"]').attr("content")?.trim() ||
            $('meta[name="twitter:title"]').attr("content")?.trim() ||
            title.split("|")[0]?.trim() ||
            "요금제 확인 필요";

        const bodyText = $("body").text().replace(/\s+/g, " ").trim();

        const monthlyPriceMatch = bodyText.match(/월\s*([\d,]+)\s*원/);
        const monthlyPrice = extractNumber(monthlyPriceMatch?.[1]);

        const afterMatch = bodyText.match(/(\d+)\s*개월\s*이후\s*([\d,]+)\s*원/);
        const afterMonths = afterMatch ? Number(afterMatch[1]) : undefined;
        const afterPrice = afterMatch ? extractNumber(afterMatch[2]) : undefined;

        const carrierNetwork =
            findTextByRegex($, /통신망\s*([A-Za-z가-힣0-9+ ]+)/) || undefined;

        const tech =
            findTextByRegex($, /통신\s*기술\s*([A-Za-z0-9가-힣+ ]+)/) || undefined;

        const dataDescription =
            findTextByRegex($, /데이터\s*제공량\s*([A-Za-z0-9가-힣+./ ]+)/) ||
            undefined;

        return {
            id,
            sourceUrl,
            finalUrl,
            name,
            monthlyPrice,
            afterMonths,
            afterPrice,
            carrierNetwork,
            tech,
            dataDescription,
            parseOk: monthlyPrice > 0,
        };
    } catch {
        return {
            id,
            sourceUrl,
            name: "요금제 확인 필요",
            monthlyPrice: 0,
            parseOk: false,
        };
    }
}