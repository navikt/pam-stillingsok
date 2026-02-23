"use client";

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";

const personaliaSchema = z
    .object({
        navn: z.string().optional(),
        erUnderFemten: z.boolean().optional(),
        kanLoggePaa: z.boolean().optional(),
    })
    .loose();

type PersonaliaData = z.infer<typeof personaliaSchema>;

type PersonaliaState =
    | Readonly<{ status: "not-fetched" }>
    | Readonly<{ status: "pending" }>
    | Readonly<{ status: "success"; data: PersonaliaData }>
    | Readonly<{ status: "error" }>;

type PersonaliaContextValue = PersonaliaState;

export function isPersonaliaSuccess(
    state: PersonaliaState,
): state is Readonly<{ status: "success"; data: PersonaliaData }> {
    return state.status === "success";
}
export const PersonaliaContext = React.createContext<PersonaliaContextValue>({ status: "not-fetched" });

type Props = Readonly<{ children: React.ReactNode }>;

function redirectToLogin(): void {
    const current = `${window.location.pathname}${window.location.search}`;
    const to = encodeURIComponent(current);
    window.location.assign(`/oauth2/login?redirect=${to}`);
}

export default function PersonaliaProvider({ children }: Props) {
    const [personalia, setPersonalia] = useState<PersonaliaState>({ status: "not-fetched" });

    useEffect(() => {
        let isMounted = true;

        async function fetchPersonalia() {
            setPersonalia({ status: "pending" });

            try {
                const response = await fetch("/min-side/api/aduser/api/v1/personalia", {
                    credentials: "same-origin",
                    cache: "no-store",
                });

                if (response.status === 401) {
                    // Token mangler/utløpt/ugyldig: send til login
                    redirectToLogin();
                    return;
                }

                if (!response.ok) {
                    if (isMounted) {
                        setPersonalia({ status: "error" });
                    }
                    return;
                }

                const json: unknown = await response.json();
                const parsed = personaliaSchema.safeParse(json);

                if (!parsed.success) {
                    if (isMounted) {
                        setPersonalia({ status: "error" });
                    }
                    return;
                }

                if (isMounted) {
                    setPersonalia({ status: "success", data: parsed.data });
                }
            } catch {
                if (isMounted) {
                    setPersonalia({ status: "error" });
                }
            }
        }

        fetchPersonalia();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = useMemo(() => {
        return personalia;
    }, [personalia]);

    return <PersonaliaContext.Provider value={value}>{children}</PersonaliaContext.Provider>;
}
