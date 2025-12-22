import React, { ReactElement } from "react";
import { Button, HStack } from "@navikt/ds-react";
import Link from "next/link";

interface FormButtonBarProps {
    id: string | undefined;
    isPending: boolean;
}

export function FormButtonBar({ id, isPending }: FormButtonBarProps): ReactElement {
    return (
        <HStack gap="4" className="mt-12">
            <Button variant="primary" type="submit" loading={isPending}>
                Send søknad
            </Button>
            {isPending && (
                <Button variant="secondary" as={Link} href={`/stillinger/stilling/${id}`}>
                    Avbryt
                </Button>
            )}
        </HStack>
    );
}
