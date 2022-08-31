import React, { useEffect } from "react";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../hooks/useFetchReducer";
import InterestAPI from "../../../api/InterestAPI";
import { captureException } from "@sentry/browser";
import "./Requirements.less";

function Requirements({uuid}) {
    const [{ data, status }, dispatch] = useFetchReducer();

    useEffect(() => {
        dispatch({ type: FetchAction.BEGIN });

        InterestAPI.getRequirements(uuid)
            .then((data) => {
                dispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }, []);

    return (
        <div className="Requirements">
            {status === FetchStatus.SUCCESS && (
                <div>
                    <h2 className="Requirements__h2">Bedriftens krav til stillingen</h2>
                    <ul className="Requirements__list">
                        {data.hardRequirements.map((it) => (
                            <li key={it.label}>{it.label}</li>
                        ))}
                    </ul>

                    <h2 className="Requirements__h2">Bedriftens ønskede kompetanser til stillingen</h2>
                    <ul className="Requirements__list">
                        {data.softRequirements.map((it) => (
                            <li key={it.label}>{it.label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

Requirements.propTypes = {}

export default Requirements;
