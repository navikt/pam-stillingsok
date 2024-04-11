import React, { useState } from "react";
import { BodyLong, BodyShort, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Link from "next/link";
import getEmployer from "@/app/_common/utils/getEmployer";
import { WithdrawButton } from "./WithdrawButton";
import ApiErrorMessage from "@/app/_common/components/ApiErrorMessage";

function WithdrawApplicationConfirmationRequired({ ad, submitForm, hasError }) {
    const [state, setState] = useState({ error: hasError });

    const onSubmit = async (e) => {
        e.preventDefault();

        let result, fetchSuccess;

        try {
            result = await submitForm();
            fetchSuccess = true;
        } catch (err) {
            fetchSuccess = false;
        }

        if (fetchSuccess) {
            setState(result);
        } else {
            setState((prevState) => ({
                ...prevState,
                error: "offline",
            }));
        }
    };

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
                        <AkselLink as={Link} href={`/stilling/${ad._id}`}>
                            {ad._source.title}
                        </AkselLink>
                    </BodyShort>
                    <Label as="p">{getEmployer(ad._source)}</Label>
                </div>
            )}

            {state?.error && <ApiErrorMessage apiErrorCode={state.error} errorHeading="Søknaden ble ikke trukket" />}

            <form onSubmit={onSubmit}>
                <WithdrawButton />
            </form>
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
    submitForm: PropTypes.func.isRequired,
    hasError: PropTypes.bool,
};

export default WithdrawApplicationConfirmationRequired;
