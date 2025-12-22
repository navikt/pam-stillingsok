"use client";

import React, { useContext } from "react";
import { PersonaliaContext } from "@/app/(nonce)/min-side/_common/components/context/PersonaliaContext.js";
import UngIkkeTilgang from "@/app/(nonce)/min-side/_common/components/tilgang/UngIkkeTilgang.jsx";

// TODO: Konverter til TSX og fjern eslint-disable når props er typesikret i TypeScript.
// eslint-disable-next-line react/prop-types
export default function SkulInnholdHvisIkkeTilgang({ children }) {
    const personalia = useContext(PersonaliaContext);

    if (personalia.data && personalia.data.erUnderFemten === true) {
        return <UngIkkeTilgang />;
    }

    if (personalia.data && personalia.data.kanLoggePaa === false) {
        return <></>;
    }

    return <>{children}</>;
}
