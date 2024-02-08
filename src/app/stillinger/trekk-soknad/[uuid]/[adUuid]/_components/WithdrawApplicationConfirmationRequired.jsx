import React from "react";
import { Alert, BodyLong, BodyShort, Button, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Link from "next/link";
import { CONTEXT_PATH } from "../../../../../_common/environment";
import getEmployer from "../../../../../_common/utils/getEmployer";

function WithdrawApplicationConfirmationRequired({ ad, handleWithDrawClick, isDeleting, hasError }) {
    return (
        <>
            <Heading level="1" size="large" spacing>
                Bekreft at du ønsker å trekke din søknad
            </Heading>
            <BodyLong className="mb-8">
                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres og du må søke på
                nytt dersom du ønsker det.
            </BodyLong>
            {ad && (
                <div className="mb-8">
                    <BodyShort>
                        <AkselLink as={Link} href={`${CONTEXT_PATH}/stilling/${ad._id}`}>
                            {ad._source.title}
                        </AkselLink>
                    </BodyShort>
                    <Label as="p">{getEmployer(ad._source)}</Label>
                </div>
            )}

            {hasError && (
                <Alert variant="error" className="mb-8">
                    Det oppsto dessverre en feil og vi kunne ikke trekke søknaden din. Prøv å trekk søknaden på nytt.
                </Alert>
            )}
            <Button variant="primary" onClick={handleWithDrawClick} loading={isDeleting}>
                Trekk søknad
            </Button>
        </>
    );
}

WithdrawApplicationConfirmationRequired.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        _source: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
    handleWithDrawClick: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool,
    hasError: PropTypes.bool,
};

export default WithdrawApplicationConfirmationRequired;
