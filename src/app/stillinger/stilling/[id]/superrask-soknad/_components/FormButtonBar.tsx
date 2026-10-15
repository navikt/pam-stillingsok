import { Button, HStack } from "@navikt/ds-react";
import Link from "next/link";

type FormButtonBarProps = {
    id?: string;
    isPending: boolean;
};

export function FormButtonBar({ id, isPending }: FormButtonBarProps) {
    return (
        <HStack gap="space-16">
            <Button variant="primary" type="submit" loading={isPending}>
                Fortsett
            </Button>
            <Button variant="secondary" as={Link} prefetch={false} href={`/stillinger/stilling/${id}`}>
                Avbryt
            </Button>
        </HStack>
    );
}
