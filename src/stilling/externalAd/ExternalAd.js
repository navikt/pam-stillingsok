import React from 'react';
import PropTypes from 'prop-types';
import './ExternalAd.less';
import { isValidUrl } from '../../utils';

export default function ExternalAd({ url }) {
        return (
            <section className="ExternalAd">
                <h2>Denne annonsen er hentet fra FINN</h2>
                <p>
                    Du kan lese hele annonseteksten og søke på stillingen på finn.no
                </p>
                <p>
                    {url && isValidUrl(url) && (
                        <a
                            className="ExternalAd__button Knapp Knapp--hoved"
                            href={url}
                        >
                            <div className="ExternalAd__button-content">
                                <span className="ExternalAd__button-icon" />Åpne annonsen på FINN
                            </div>
                        </a>
                    )}
                </p>
            </section>
        );
}

ExternalAd.defaultProps = {
    url: undefined
};

ExternalAd.propTypes = {
    url: PropTypes.string
};
