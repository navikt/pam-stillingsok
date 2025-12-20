"use client";
import React from "react";
import SkulInnholdHvisIkkeTilgang from "@/app/(nonce)/min-side/_common/components/tilgang/SkjulInnholdHvisIkkeTilgang";
import PersonaliaProvider from "@/app/(nonce)/min-side/_common/components/context/PersonaliaContext";

export default function StillingerLayout({ children }: { children: React.ReactNode }) {
    return (
        <PersonaliaProvider>
            <SkulInnholdHvisIkkeTilgang>{children}</SkulInnholdHvisIkkeTilgang>
        </PersonaliaProvider>
    );
}
