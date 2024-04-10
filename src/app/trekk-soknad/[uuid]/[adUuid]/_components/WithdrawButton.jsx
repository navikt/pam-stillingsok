import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@navikt/ds-react";

export function WithdrawButton() {
    const { pending } = useFormStatus();

    return (
        <Button variant="primary" type="submit" loading={pending}>
            Trekk søknad
        </Button>
    );
}
