import { Button } from "@navikt/ds-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

interface FormButtonBarProps {
    id: string | undefined;
}

export function FormButtonBar({ id }: FormButtonBarProps) {
    const { pending } = useFormStatus();

    return (
        <>
            <Button type="submit" variant="primary" loading={pending}>
                Rapporter annonse
            </Button>
            {!pending && (
                <Button variant="secondary" as={Link} prefetch={false} href={`/stillinger/stilling/${id}`}>
                    Avbryt
                </Button>
            )}
        </>
    );
}
