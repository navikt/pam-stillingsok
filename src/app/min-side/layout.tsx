import React from "react";
import SkulInnholdHvisIkkeTilgang from "@/app/min-side/_common/components/tilgang/SkjulInnholdHvisIkkeTilgang";

export default function StillingerLayout({ children }: { children: React.ReactNode }) {
    return <SkulInnholdHvisIkkeTilgang>{children}</SkulInnholdHvisIkkeTilgang>;
}
