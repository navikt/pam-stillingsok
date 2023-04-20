import React, { useContext } from "react";
import Illustration from "./Illustration";
import { BodyLong, Label } from "@navikt/ds-react";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../../common/environment";
import { Link as AkselLink } from "@navikt/ds-react/esm/link";
import "./EmptyState.css";

function EmptyState({ totalPositions }) {
    const { authenticationStatus } = useContext(AuthenticationContext);

    return (
        <div className="EmptyState">
            <Illustration />
            <Label as="p" className="mt-1 mb-0_25 text-center">
                Akkurat nå er det {totalPositions.toLocaleString()} ledige stillinger
            </Label>
            <BodyLong className="text-center">Fyll inn sted, yrke og andre filter for å søke.</BodyLong>
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                <BodyLong className="text-center mt-1">
                    <Link to={`${CONTEXT_PATH}/favoritter`}>
                        <AkselLink>Dine favoritter</AkselLink>
                    </Link>
                </BodyLong>
            )}
        </div>
    );
}

export default EmptyState;
