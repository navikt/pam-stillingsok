import mockData from "./mock-data";

export async function GET() {
    return Response.json(mockData);
}
