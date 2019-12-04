import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import PropTypes from 'prop-types';
import './ExternalAd.less';
import { isValidUrl } from '../../utils';

export default function ExternalAd({ url }) {
    return (
        <section className="ExternalAd">
            <h2 className="ExternalAd__title">Denne annonsen er hentet fra FINN</h2>
            <p className="ExternalAd__text">
                Du kan lese hele annonseteksten og søke på stillingen på finn.no
            </p>
            {url && isValidUrl(url) && (
                <p className="ExternalAd__link">
                    <a
                        className="link"
                        href={url}
                    >
                        Åpne annonsen på FINN
                    </a>
                    <span className="ExternalAd__link__icon" aria-label="Ekstern lenke"/>
                </p>
            )}
        </section>
    );
}

ExternalAd.defaultProps = {
    url: undefined
};

ExternalAd.propTypes = {
    url: PropTypes.string
};
