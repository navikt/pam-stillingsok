import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Undertittel } from 'nav-frontend-typografi';
import './EmployerDetails.less';

export const tilpassLenke = (lenke) => {
    if (!lenke.startsWith('http')) {
        return `https://${lenke}`;
    }
    return lenke;
};

export default function EmployerDetails({ properties }) {
    return (
        <div className="EmployerDetails detail-section">
            <Undertittel className="EmployerDetails__head detail-section__head">Om arbeidsgiveren</Undertittel>
            <dl className="dl-flex typo-normal">
                {properties.employer && [
                    <dt key="dt">Arbeidsgiver:</dt>,
                    <dd key="dd">{properties.employer}</dd>
                ]}
                {properties.address && [
                    <dt key="dt">Adresse:</dt>,
                    <dd key="dd">{properties.address}</dd>
                ]}
                {properties.employerhomepage && [
                    <dt key="dt">Hjemmeside:</dt>,
                    <dd key="dd">
                        <a
                            href={tilpassLenke(properties.employerhomepage)}
                            className="lenke"
                        >
                            {properties.employerhomepage}
                        </a>
                    </dd>
                ]}
                {properties.linkedinpage && [
                    <dt key="dt">LinkedIn:</dt>,
                    <dd key="dd">
                        <a
                            href={tilpassLenke(properties.linkedinpage)}
                            className="lenke"
                        >
                            {properties.linkedinpage}
                        </a>
                    </dd>
                ]}
                {properties.twitteraddress && [
                    <dt key="dt">Twitter:</dt>,
                    <dd key="dd">
                        <a
                            href={tilpassLenke(properties.twitteraddress)}
                            className="lenke"
                        >
                            {properties.twitteraddress}
                        </a>
                    </dd>
                ]}
                {properties.facebookpage && [
                    <dt key="dt">Facebook:</dt>,
                    <dd key="dd">
                        <a
                            href={tilpassLenke(properties.facebookpage)}
                            className="lenke"
                        >
                            {properties.facebookpage}
                        </a>
                    </dd>
                ]}
            </dl>
            {properties.employerdescription && (
                <div className="EmployerDetails__description">{ ReactHtmlParser(properties.employerdescription) }</div>
            )}
        </div>
    );
}

EmployerDetails.propTypes = {
    properties: PropTypes.shape({
        employer: PropTypes.string,
        address: PropTypes.string,
        employerhomepage: PropTypes.string,
        linkedinpage: PropTypes.string,
        twitteraddress: PropTypes.string,
        facebookpage: PropTypes.string,
        employerdescription: PropTypes.string
    }).isRequired
};

