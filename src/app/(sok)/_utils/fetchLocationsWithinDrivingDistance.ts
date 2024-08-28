import { getDefaultHeaders } from "@/app/_common/utils/fetch";

export interface Locations {
    postcodes: string[];
    municipals: string[];
    counties: string[];
}

interface AvstandApiDto {
    postnummer: string[];
    kommuner: string[];
    fylker: string[];
}

export async function fetchLocationsWithinDrivingDistance(
    referencePostCode: string,
    distance: number,
): Promise<Locations> {
    const res = await fetch(
        `${process.env.PAM_GEOGRAFI_API_URL}/innen-avstand/${referencePostCode}?avstand=${distance}`,
        {
            headers: getDefaultHeaders(),
        },
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch within distance data: ${res.status} ${res.statusText}`);
    }

    const data: AvstandApiDto = await res.json();

    return {
        postcodes: data.postnummer,
        municipals: data.kommuner,
        counties: data.fylker,
    };
}
