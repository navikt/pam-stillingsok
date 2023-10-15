import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    // Todo: Replace this hack
    cookies().set("is-logged-in-hack", "true");
    redirect("/stillinger");
}
