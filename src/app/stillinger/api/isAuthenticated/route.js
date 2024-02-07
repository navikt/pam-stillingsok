import { cookies } from "next/headers";

export default async function GET() {
    const _todoLoggedInCookie = cookies().get("is-logged-in-hack");
    if (_todoLoggedInCookie && _todoLoggedInCookie.value === "true") {
        return new Response(undefined, {
            status: 200,
        });
    }
    return new Response(undefined, {
        status: 401,
    });
}
