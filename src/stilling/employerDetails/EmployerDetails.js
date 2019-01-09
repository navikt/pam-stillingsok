import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { Undertittel } from 'nav-frontend-typografi';
import { isValidUrl } from '../../utils';
import getEmployer, { getEmployerLocation } from '../../common/getEmployer';
import './EmployerDetails.less';

export default function EmployerDetails({ stilling }) {
    const { properties } = stilling;
    const employer = getEmployer(stilling);
    const employerLocation = getEmployerLocation(stilling.employer);
    return (
        <div className="EmployerDetails detail-section">
            <Undertittel className="EmployerDetails__head detail-section__head">Om arbeidsgiveren</Undertittel>
            <dl className="dl-flex typo-normal">
                {employer && [
                    <dt key="dt">Arbeidsgiver:</dt>,
                    <dd key="dd">{employer}</dd>
                ]}
                {employerLocation && [
                    <dt key="dt">Adresse:</dt>,
                    <dd key="dd">{employerLocation}</dd>
                ]}
                {properties.employerhomepage && [
                    <dt key="dt">Hjemmeside:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.employerhomepage) ? (
                            <a
                                href={properties.employerhomepage}
                                className="lenke"
                            >
                                {properties.employerhomepage}
                            </a>)
                            : properties.employerhomepage
                        }
                    </dd>
                ]}
                {properties.linkedinpage && [
                    <dt key="dt">LinkedIn:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.linkedinpage) ? (
                            <a
                                href={properties.linkedinpage}
                                className="lenke"
                            >
                                {properties.linkedinpage}
                            </a>)
                            : properties.linkedinpage
                        }
                    </dd>
                ]}
                {properties.twitteraddress && [
                    <dt key="dt">Twitter:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.twitteraddress) ? (
                            <a
                                href={properties.twitteraddress}
                                className="lenke"
                            >
                                {properties.twitteraddress}
                            </a>)
                            : properties.twitteraddress
                        }
                    </dd>
                ]}
                {properties.facebookpage && [
                    <dt key="dt">Facebook:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.facebookpage) ? (
                            <a
                                href={properties.facebookpage}
                                className="lenke"
                            >
                                {properties.facebookpage}
                            </a>)
                            : properties.facebookpage
                        }
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
    stilling: PropTypes.shape({
        properties: PropTypes.shape({
            employer: PropTypes.string,
            address: PropTypes.string,
            employerhomepage: PropTypes.string,
            linkedinpage: PropTypes.string,
            twitteraddress: PropTypes.string,
            facebookpage: PropTypes.string,
            employerdescription: PropTypes.string
        }).isRequired
    }).isRequired
};
