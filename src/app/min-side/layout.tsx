import React from "react";
import SkulInnholdHvisIkkeTilgang from "@/app/min-side/components/tilgang/SkjulInnholdHvisIkkeTilgang";

export default function StillingerLayout({ children }: { children: React.ReactNode }) {
    return <SkulInnholdHvisIkkeTilgang>{children}</SkulInnholdHvisIkkeTilgang>;
}
