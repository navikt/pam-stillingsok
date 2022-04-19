import React from "react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import fixLocationName from "../../../../server/common/fixLocationName";
import { isValidUrl } from "../../../utils/utils";
import getEmployer from "../../../../server/common/getEmployer";
import "./EmployerDetails.less";

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
        <div className="EmployerDetails">
            <h2 className="EmployerDetails__h2">
                <svg
                    aria-hidden="true"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    focusable="false"
                    role="img"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17 2H7v20h10V2zm2 7V0H5v9H0v15h24V9h-5zm0 2v11h3V11h-3zM2 11h3v11H2V11zm7-3V5h2v3H9zm0 3v3h2v-3H9zm4-3V5h2v3h-2zm0 3v3h2v-3h-2z"
                        fill="currentColor"
                    ></path>
                </svg>
                Om arbeidsgiveren
            </h2>
            <dl className="EmployerDetails__dl typo-normal">
                {employer && [<dt key="dt">Arbeidsgiver:</dt>, <dd key="dd">{employer}</dd>]}
                {employerLocation && [<dt key="dt">Adresse:</dt>, <dd key="dd">{employerLocation}</dd>]}
                {properties.employerhomepage && [
                    <dt key="dt">Hjemmeside:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.employerhomepage) ? (
                            <a href={properties.employerhomepage} className="link">
                                {properties.employerhomepage}
                            </a>
                        ) : (
                            properties.employerhomepage
                        )}
                    </dd>
                ]}
                {properties.linkedinpage && [
                    <dt key="dt">LinkedIn:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.linkedinpage) ? (
                            <a href={properties.linkedinpage} className="link">
                                {properties.linkedinpage}
                            </a>
                        ) : (
                            properties.linkedinpage
                        )}
                    </dd>
                ]}
                {properties.twitteraddress && [
                    <dt key="dt">Twitter:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.twitteraddress) ? (
                            <a href={properties.twitteraddress} className="link">
                                {properties.twitteraddress}
                            </a>
                        ) : (
                            properties.twitteraddress
                        )}
                    </dd>
                ]}
                {properties.facebookpage && [
                    <dt key="dt">Facebook:</dt>,
                    <dd key="dd">
                        {isValidUrl(properties.facebookpage) ? (
                            <a href={properties.facebookpage} className="link">
                                {properties.facebookpage}
                            </a>
                        ) : (
                            properties.facebookpage
                        )}
                    </dd>
                ]}
            </dl>
            {properties.employerdescription && (
                <div className="EmployerDetails__description">{ReactHtmlParser(properties.employerdescription)}</div>
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
