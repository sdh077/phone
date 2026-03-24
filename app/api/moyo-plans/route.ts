import { NextResponse } from "next/server";
import { moyoAdLinks } from "@/data/moyo-links";
import { parseMoyoPlan } from "@/lib/moyo-parser";

export async function GET() {
    const results = await Promise.all(
        moyoAdLinks.map((item) => parseMoyoPlan(item.id, item.url))
    );

    return NextResponse.json(results);
}