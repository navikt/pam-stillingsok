import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';

export const tilpassEmail = (email) => {
    if (email.includes('@') && !email.includes('mailto:')) {
        return `mailto:${email}`;
    }
    return email;
};

export default function ContactPerson({ properties }) {
    if (properties.contactperson || properties.contactpersontitle
        || properties.contactpersonphone || properties.contactpersonemail) {
        return (
            <div className="ContactPerson detail-section">
                <Undertittel className="ContactPerson__head detail-section__head">Kontaktperson for stillingen</Undertittel>
                <dl className="dl-flex typo-normal">
                    {properties.contactperson && [
                        <dt key="dt">Kontaktperson:</dt>,
                        <dd key="dd">{properties.contactperson}</dd>
                    ]}
                    {properties.contactpersontitle && [
                        <dt key="dt">Stillingstittel:</dt>,
                        <dd key="dd">{properties.contactpersontitle}</dd>
                    ]}
                    {properties.contactpersonphone && [
                        <dt key="dt">Telefon:</dt>,
                        <dd key="dd">{properties.contactpersonphone}</dd>
                    ]}
                    {properties.contactpersonemail && [
                        <dt key="dt">Epost:</dt>,
                        <dd key="dd">
                            <a
                                href={tilpassEmail(properties.contactpersonemail)}
                                className="lenke"
                            >
                                {properties.contactpersonemail}
                            </a>
                        </dd>
                    ]}
                </dl>
            </div>
        );
    }
    return null;
}

ContactPerson.propTypes = {
    properties: PropTypes.shape({
        contactperson: PropTypes.string,
        contactpersontitle: PropTypes.string,
        contactpersonphone: PropTypes.string,
        contactpersonemail: PropTypes.string
    }).isRequired
};

