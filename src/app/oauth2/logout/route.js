import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GET() {
    // Todo: Replace this hack
    cookies().delete("is-logged-in-hack");
    redirect("/stillinger");
}
