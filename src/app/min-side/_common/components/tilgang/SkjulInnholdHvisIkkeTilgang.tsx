"use client";

import React, { useContext } from "react";
import { isPersonaliaSuccess, PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import UngIkkeTilgang from "@/app/min-side/_common/components/tilgang/UngIkkeTilgang";

type Props = Readonly<{
    children: React.ReactNode;
}>;

export default function SkulInnholdHvisIkkeTilgang({ children }: Props) {
    const personalia = useContext(PersonaliaContext);
    if (!isPersonaliaSuccess(personalia)) {
        return <>{children}</>;
    }

    if (personalia.data && personalia.data.erUnderFemten === true) {
        return <UngIkkeTilgang />;
    }

    if (personalia.data && personalia.data.kanLoggePaa === false) {
        return <></>;
    }

    return <>{children}</>;
}
