"use client";

import { useEffect, useState } from "react";
import { getUserActionTakenValue } from "@navikt/arbeidsplassen-react";

import Umami from "@/app/_common/umami/Umami";

type UmamiGateProps = {
    readonly children?: never;
};

export default function UmamiGate(_: UmamiGateProps) {
    const [userActionTaken, setUserActionTaken] = useState<boolean>(false);

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const cookieString: string = document.cookie ?? "";

        if (cookieString.length === 0) {
            setUserActionTaken(false);
            return;
        }

        const value = getUserActionTakenValue(cookieString) ?? false;
        setUserActionTaken(value);
    }, []);

    if (!userActionTaken) {
        return null;
    }

    return <Umami />;
}
