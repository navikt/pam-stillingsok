export async function GET() {
    // Todo: Replace this hack
    return Response.json({ session: { active: true, timeout_in_seconds: 9999 }, token: "" });
}
