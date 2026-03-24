import { NextResponse } from "next/server";
import { phoneProductLinks } from "@/data/phone-links";
import { parsePhoneProduct } from "@/lib/phone-parser";

export async function GET() {
    const results = await Promise.all(
        phoneProductLinks.map((item) => parsePhoneProduct(item.id, item.url))
    );

    return NextResponse.json(results);
}