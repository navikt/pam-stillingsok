import React from "react";
import { cookies } from "next/headers";
import type { ExperimentKey, VariantKey } from "./types";
import { getExperimentCookieName, parseExperimentCookieValue } from "./cookies";

export type ExperimentClientBoundaryProps = Readonly<{
    readonly experiment: ExperimentKey;
    readonly render: (variant: VariantKey) => React.ReactElement;
}>;

export async function ExperimentClientBoundary(props: ExperimentClientBoundaryProps) {
    const cookieStore = await cookies();
    const raw = cookieStore.get(getExperimentCookieName(props.experiment))?.value;
    const parsed = parseExperimentCookieValue(raw);

    const chosen: VariantKey = parsed?.variant ?? "standard";

    return props.render(chosen);
}
