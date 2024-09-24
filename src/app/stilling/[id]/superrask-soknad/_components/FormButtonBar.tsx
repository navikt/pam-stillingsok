import React, { ReactElement } from "react";
import { Button } from "@navikt/ds-react";
import Link from "next/link";

interface FormButtonBarProps {
    id: string;
    isPending: boolean;
}

export function FormButtonBar({ id, isPending }: FormButtonBarProps): ReactElement {
    return (
        <>
            <Button variant="primary" type="submit" loading={isPending}>
                Send søknad
            </Button>
            {isPending && (
                <Button type="button" variant="secondary" as={Link} href={`/stilling/${id}`}>
                    Avbryt
                </Button>
            )}
        </>
    );
}
