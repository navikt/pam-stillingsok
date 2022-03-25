import React from 'react';
import PropTypes from 'prop-types';
import {Flatknapp} from "@navikt/arbeidsplassen-knapper";
import './PrintButton.less';

export default function PrintButton({ onClick }) {
    return (
        <Flatknapp
            className="PrintButton"
            onClick={onClick}
            aria-label="Skriv ut"
        >
            <span className="PrintButton__inner">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" role="img"><path fillRule="evenodd" clipRule="evenodd" d="M20 0v5a4 4 0 014 4v10h-4v5H4v-5H0V9a4 4 0 014-4V0h16zm-2 12H6v10h12V12zm-2 2v2H8v-2h8zm-2 4v2H8v-2h6zm6-11H4a2 2 0 00-1.995 1.85L2 9v8h2v-7h16v7h2V9a2 2 0 00-1.85-1.995L20 7zm-2-5H6v3h12V2z" fill="currentColor"></path></svg>
                Skriv ut
            </span>
        </Flatknapp>
    );
}

PrintButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

