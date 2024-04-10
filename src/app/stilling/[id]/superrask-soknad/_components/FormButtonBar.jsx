import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@navikt/ds-react";
import Link from "next/link";
import PropTypes from "prop-types";

export function FormButtonBar({ id }) {
    const { pending } = useFormStatus();
    return (
        <>
            <Button variant="primary" type="submit" loading={pending}>
                Send søknad
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
