import React from "react";
import { Button } from "@navikt/ds-react";
import Link from "next/link";
import PropTypes from "prop-types";

export function FormButtonBar({ id, isPending }) {
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
FormButtonBar.propTypes = {
    id: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired,
};
