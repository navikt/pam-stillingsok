"use client";
import type React from "react";
import PersonaliaProvider from "@/app/min-side/_common/components/context/PersonaliaContext";
import SkulInnholdHvisIkkeTilgang from "@/app/min-side/_common/components/tilgang/SkjulInnholdHvisIkkeTilgang";

export default function StillingerLayout({ children }: { children: React.ReactNode }) {
    return (
        <PersonaliaProvider>
            <SkulInnholdHvisIkkeTilgang>{children}</SkulInnholdHvisIkkeTilgang>
        </PersonaliaProvider>
    );
}
