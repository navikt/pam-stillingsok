import React, { useContext } from "react";
import Illustration from "./Illustration";
import { BodyLong, Label } from "@navikt/ds-react";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../../common/environment";
import { Link as AkselLink } from "@navikt/ds-react/esm/link";
import "./EmptyState.css";
import { formatNumber } from "../../../../common/components/utils";

function EmptyState({ totalPositions }) {
    const { authenticationStatus } = useContext(AuthenticationContext);

    return (
        <div className="container-medium EmptyState">
            <Illustration />
            <BodyLong className="mt-1 text-center">
                Akkurat nå er det {formatNumber(totalPositions)} ledige stillinger
            </BodyLong>
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
