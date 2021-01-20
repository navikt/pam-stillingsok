import * as React from "react";
import Cookies from "universal-cookie";
import {NY_CV_URL} from "../../fasitProperties";
import "./NewCvLink.less";
import logAmplitudeEvent from "../../amplitudeTracker";
import {useEffect} from "react";

const NewCvLink = () => {

    useEffect(() => {
        logAmplitudeEvent('Showed New CV Link', {});
    }, []);

    const cookies = new Cookies();

    const onNewCvNavigationClick = () => () => {
        cookies.set('useNewCv', 'true', {
            path: '/',
            maxAge: (604800 * 8), // 8 weeks
            domain: '.nav.no'
        });

        logAmplitudeEvent('Use new CV', {});
    };

    if (cookies.get('newCvRolloutGroup')  !== 'true') {
        return null;
    }

    return(<a
        href={NY_CV_URL}
        onClick={onNewCvNavigationClick}
        className="Header__NewCvLenke"
    >
        <div className="Header__NewCvLenke-inner">
                <span>
                    Prøv den nye CV-løsningen
                </span>
        </div>
    </a>)
}

export default NewCvLink;