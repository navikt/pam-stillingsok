import { NextResponse } from "next/server";
import { fetchLocations } from "@/app/_common/geografi/fetchLocations";

export async function GET(): Promise<NextResponse> {
    const result = await fetchLocations();

    // Ikke lek sensitive detaljer ut til client – her returnerer vi kun strukturen og error-typer
    return NextResponse.json(result, { status: result.errors.length > 0 ? 502 : 200 });
}
