import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BodyLong, Button, Heading, Panel } from "@navikt/ds-react";
import { CONTEXT_PATH } from "../../../../common/environment";
import { EnterIcon, HeartIcon } from "@navikt/aksel-icons";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";
import "./HowToPanel.css";

function HowToAddFavourites() {
    const { authenticationStatus, login } = useContext(AuthenticationContext);

    return (
        <Panel className="HowToPanel arb-panel arb-tertiary-bg-text">
            <div>
                <Heading level="3" size="small">
                    Dine favoritter
                </Heading>
                {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                    <BodyLong>Klikk på hjertet for å lagre en annsonse.</BodyLong>
                ) : (
                    <BodyLong>Vil du lagre favoritter, må du først logge inn.</BodyLong>
                )}
            </div>
            <div>
                {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                    <Button
                        variant="tertiary"
                        icon={<HeartIcon aria-hidden="true" />}
                        as={Link}
                        to={`${CONTEXT_PATH}/favoritter`}
                    >
                        Vis mine favoritter
                    </Button>
                ) : (
                    <Button variant="tertiary" icon={<EnterIcon aria-hidden="true" />} onClick={login}>
                        Logg inn
                    </Button>
                )}
            </div>
        </Panel>
    );
}

export default HowToAddFavourites;
