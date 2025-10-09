import { removeUuid } from "@/app/_common/utils/removeUuid";
import { httpRequests } from "@/metrics";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
    const data = await request.json();
    // There's no good way to get the dynamic path in Next with app router, so we're removing the ID's manually from the path,
    // to avoid having 20k+ different paths in the metrics.
    const path = removeUuid(data.path);
    httpRequests.inc({ method: data.method, path, cookieConsent: data.cookieConsent });
    return new Response();
}
