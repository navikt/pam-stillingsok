import React from 'react';
import PropTypes from 'prop-types';
import './FinnAd.less';

export default function FinnAd({ stilling }) {

    return (
        <section className="FinnAd">
            <h2 className="FinnAd__title">Denne annonsen er hentet fra FINN</h2>
            <p className="FinnAd__text">
                Du kan lese hele annonseteksten og søke på stillingen på finn.no
            </p>
            {stilling && stilling._source && stilling._source.reference && (
                <p className="FinnAd__link">
                    <a className="link" href={`https://www.finn.no/${stilling._source.reference}`}>
                        Åpne annonsen på FINN
                    </a>
                    <span className="FinnAd__link__icon" aria-label="Ekstern lenke"/>
                </p>
            )}
        </section>
    );
}

FinnAd.defaultProps = {
    stilling: undefined
};

FinnAd.propTypes = {
    stilling: PropTypes.shape({
        _source: PropTypes.shape({
            reference: PropTypes.string
        })
    }).isRequired
};
