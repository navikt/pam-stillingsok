import { useFormStatus } from "react-dom";
import { Button } from "@navikt/ds-react";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

export function FormButtonBar({ id }) {
    const { pending } = useFormStatus();
    return (
        <>
            <Button type="submit" variant="primary" loading={pending}>
                Rapporter annonse
            </Button>
            {!pending && (
                <Button type="button" variant="secondary" as={Link} href={`/stilling/${id}`}>
                    Avbryt
                </Button>
            )}
        </>
    );
}
FormButtonBar.propTypes = {
    id: PropTypes.string.isRequired,
};
