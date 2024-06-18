import { httpRequests } from "@/metrics";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

export async function POST(request) {
    const data = await request.json();
    // There's no good way to get the dynamic path in Next with app router, so we're removing the ID's manually from the path,
    // to avoid having 20k+ different paths in the metrics.
    const path = data.path.replaceAll(UUID_PATTERN, "[id]");
    httpRequests.inc({ method: data.method, path });
    return new Response();
}
