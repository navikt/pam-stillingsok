import "./EventBanner.less";
import React, { useEffect } from "react";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../hooks/useFetchReducer";
import EventAPI from "../../../api/EventAPI";
import { captureException } from "@sentry/browser";

function EventBanner() {
    const [response, dispatch] = useFetchReducer();

    useEffect(() => {
        fetchNextEvent();
    }, []);

    function fetchNextEvent() {
        dispatch({ type: FetchAction.BEGIN });
        EventAPI.getNextEvent()
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    if (
        response.status === FetchStatus.NOT_FETCHED ||
        response.status === FetchStatus.IS_FETCHING ||
        response.status === FetchStatus.FAILURE
    ) {
        return null;
    }

    // If there is no upcoming event, the response will be empty
    if (response.data === undefined) {
        return null;
    }

    const nextEvent = response.data;
    const daysUntilNextEvent = calculateDaysUntilEvent(nextEvent);
    const daysUntilNextEventText = getDaysUntilNextEventText(daysUntilNextEvent);

    return (
        <div className="EventBanner">
            <div className="EventBanner--illustration">
                <svg
                    width="49"
                    height="41"
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 49 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect x="8.59558" y="6.45667" width="30.3121" height="25.2471" rx="2" fill="#40C1AC" />
                    <path d="M44.5468 25.3921V13.4698L31.858 19.1925L44.5468 25.3921Z" fill="#40C1AC" />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M38.8063 16.0045V22.5978L31.9138 19.1693L38.8063 16.0045Z"
                        fill="#3F868A"
                    />
                    <ellipse cx="8.43709" cy="31.6377" rx="8.43709" ry="8.3937" fill="#98F1D7" />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.874 31.7023H10.5956C9.49101 31.7023 8.59558 30.8068 8.59558 29.7023V23.244C13.1821 23.3281 16.8742 27.0532 16.8742 31.6363C16.8742 31.6583 16.8741 31.6803 16.874 31.7023Z"
                        fill="#3F868A"
                    />
                </svg>
            </div>
            <h3 className="EventBanner__title">Neste jobbtreff er {daysUntilNextEventText}:</h3>
            <p className="EventBanner--event-title-link">
                <a className="link" href={`/jobbtreff/${nextEvent.id}`}>
                    {nextEvent.title}
                </a>
            </p>
            <p className="EventBanner--events-info-link">
                <a className="link" href="/jobbtreff/hvordan-delta">
                    Les om hvordan jobbtreff fungerer
                </a>
            </p>
        </div>
    );
}

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

function calculateDaysUntilEvent(event) {
    const today = new Date();
    const eventDate = new Date(event.startTime);

    // Reset hours, since we want to know if the next event is today, tomorrow, or in xx days. Not if it is in 0.57 days or similar.
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    let millisecondsUntilNextEvent = Math.abs(eventDate - today);

    return Math.round(millisecondsUntilNextEvent / ONE_DAY_IN_MILLISECONDS);
}

function getDaysUntilNextEventText(daysUntilNextEvent) {
    switch (daysUntilNextEvent) {
        case 0:
            return "i dag";
        case 1:
            return "i morgen";
        default:
            return `om ${daysUntilNextEvent} dager`;
    }
}

export default EventBanner;
