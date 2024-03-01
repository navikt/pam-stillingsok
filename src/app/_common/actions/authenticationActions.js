"use server";

import { getToken, validateToken } from "@navikt/oasis";
import { headers } from "next/headers";

export async function checkIfAuthenticated() {
    return await validateToken(getToken(headers()))
        .then((token) => {
            return { isAuthenticated: token.ok };
        })
        .catch(() => {
            return { isAuthenticated: false };
        });
}
