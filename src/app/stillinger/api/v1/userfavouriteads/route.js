import mockData from "./mock-data";

export default async function GET() {
    return Response.json(mockData);
}
