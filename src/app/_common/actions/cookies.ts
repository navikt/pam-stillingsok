"use server";
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
    const requestCookies = await cookies();
    requestCookies.delete(name);
}
