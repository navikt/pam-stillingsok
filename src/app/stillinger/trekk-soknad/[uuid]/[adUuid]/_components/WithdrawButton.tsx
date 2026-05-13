"use client";

import { Button } from "@navikt/ds-react";
import { useFormStatus } from "react-dom";

export function WithdrawButton() {
    const { pending } = useFormStatus();

    return (
        <Button variant="primary" type="submit" loading={pending}>
            Trekk søknad
        </Button>
    );
}
