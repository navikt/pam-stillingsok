import * as React from "react";
import Cookies from "universal-cookie";
import {NavLink} from "react-router-dom";
import {NY_CV_URL} from "../../fasitProperties";

const NewCvLink = () => {
    const cookies = new Cookies();

    const onNewCvNavigationClick = () => () => {
        cookies.set('useNewCv', 'true', {
            path: '/',
            maxAge: (604800 * 8) // 8 weeks
        })
    };

    if (cookies.get('newCvRolloutGroup')  !== 'true') {
        return null;
    }

    return(<NavLink
        to={NY_CV_URL}
        onClick={onNewCvNavigationClick()}
        className="Header__AktivitetsplanLenke"
    >
        <div className="Header__AktivitetsplanLenke-inner">
                <span className="Header__AktivitetsplanLenke__text">
                    Prøv den nye CV-løsningen
                </span>
        </div>
    </NavLink>)
}

export default NewCvLink;