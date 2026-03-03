import React from "react";
import { Button, HStack } from "@navikt/ds-react";
import Link from "next/link";

interface FormButtonBarProps {
    id: string | undefined;
    isPending: boolean;
}

export function FormButtonBar({ id, isPending }: FormButtonBarProps) {
    return (
        <HStack gap="space-16" className="mt-12">
            <Button variant="primary" type="submit" loading={isPending}>
                Send søknad
            </Button>
            {isPending && (
                <Button variant="secondary" as={Link} prefetch={false} href={`/stillinger/stilling/${id}`}>
                    Avbryt
                </Button>
            )}
        </HStack>
    );
}
