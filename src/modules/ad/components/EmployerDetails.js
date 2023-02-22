import React from "react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import fixLocationName from "../../../../server/common/fixLocationName";
import { isValidUrl } from "../../../common/components/utils";
import getEmployer from "../../../../server/common/getEmployer";
import "./EmployerDetails.css";
import EmployerIcon from "../../../common/components/icons/EmployerIcon";

function getEmployerLocation(employer) {
    let employerLocation = null;

    if (employer && employer.location) {
        const { location } = employer;

        if (location.postalCode) {
            employerLocation = location.address ? `${location.address}, ` : "";
            employerLocation += `${location.postalCode} ${fixLocationName(location.city)}`;
        } else if (location.municipal) {
            employerLocation = `${fixLocationName(location.municipal)}`;
        } else if (location.country) {
            employerLocation = `${fixLocationName(location.country)}`;
        }
    }
    return employerLocation;
}

export default function EmployerDetails({ stilling }) {
    const { properties } = stilling;
    const employer = getEmployer(stilling);
    const employerLocation = getEmployerLocation(stilling.employer);
    return (
        <section>
            <h2 className="EmployerDetails__h2">
                <EmployerIcon />
                Om arbeidsgiveren
            </h2>
            <dl className="EmployerDetails__dl">
                {employer && (
                    <React.Fragment>
                        <dt>Arbeidsgiver:</dt>
                        <dd>{employer}</dd>
                    </React.Fragment>
                )}
                {employerLocation && (
                    <React.Fragment>
                        <dt>Adresse:</dt>
                        <dd>{employerLocation}</dd>
                    </React.Fragment>
                )}
                {properties.employerhomepage && (
                    <React.Fragment>
                        <dt>Hjemmeside:</dt>
                        <dd>
                            {isValidUrl(properties.employerhomepage) ? (
                                <a href={properties.employerhomepage} className="link">
                                    {properties.employerhomepage}
                                </a>
                            ) : (
                                properties.employerhomepage
                            )}
                        </dd>
                    </React.Fragment>
                )}
                {properties.linkedinpage && (
                    <React.Fragment>
                        <dt>LinkedIn:</dt>
                        <dd>
                            {isValidUrl(properties.linkedinpage) ? (
                                <a href={properties.linkedinpage} className="link">
                                    {properties.linkedinpage}
                                </a>
                            ) : (
                                properties.linkedinpage
                            )}
                        </dd>
                    </React.Fragment>
                )}
                {properties.twitteraddress && (
                    <React.Fragment>
                        <dt>Twitter:</dt>
                        <dd>
                            {isValidUrl(properties.twitteraddress) ? (
                                <a href={properties.twitteraddress} className="link">
                                    {properties.twitteraddress}
                                </a>
                            ) : (
                                properties.twitteraddress
                            )}
                        </dd>
                    </React.Fragment>
                )}
                {properties.facebookpage && (
                    <React.Fragment>
                        <dt>Facebook:</dt>
                        <dd>
                            {isValidUrl(properties.facebookpage) ? (
                                <a href={properties.facebookpage} className="link">
                                    {properties.facebookpage}
                                </a>
                            ) : (
                                properties.facebookpage
                            )}
                        </dd>
                    </React.Fragment>
                )}
            </dl>
            {properties.employerdescription && (
                <div className="EmployerDetails__description">{ReactHtmlParser(properties.employerdescription)}</div>
            )}
        </section>
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