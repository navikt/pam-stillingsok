"use server";
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
    cookies().delete(name);
}
