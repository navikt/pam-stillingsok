import React, { useContext } from "react";
import SaveSearchButton from "../../../saved-searches/components/SaveSearchButton";
import { BodyLong, Button, Heading, Panel } from "@navikt/ds-react";
import "./HowToPanel.css";
import { ClockIcon, EnterIcon } from "@navikt/aksel-icons";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";
import { CONTEXT_PATH } from "../../../../common/environment";
import { Link } from "react-router-dom";

function DoYouWantToSaveSearch({ query }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);

    return (
        <Panel className="HowToPanel arb-panel arb-secondary-bg-text mb-2">
            <div className="HowToPanel__text">
                <Heading level="3" size="small">
                    Varsel ved nye treff?
                </Heading>
                {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                    <BodyLong>Du kan motta e-post når det kommer nye treff.</BodyLong>
                ) : (
                    <BodyLong>Vil du lagre søket, må du først logge inn.</BodyLong>
                )}
            </div>
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                <React.Fragment>
                    <SaveSearchButton query={query} />
                    <Button
                        icon={<ClockIcon aria-hidden="true" />}
                        variant="tertiary"
                        as={Link}
                        to={`${CONTEXT_PATH}/lagrede-sok`}
                    >
                        Vis mine søk
                    </Button>
                </React.Fragment>
            ) : (
                <Button variant="tertiary" icon={<EnterIcon aria-hidden="true" />} onClick={login}>
                    Logg inn
                </Button>
            )}
        </Panel>
    );
}

export default DoYouWantToSaveSearch;
