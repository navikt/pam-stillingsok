import React from "react";
import PropTypes from "prop-types";
import { formatISOString, isValidISOString } from "../../../components/utils";
import worktimeParser from "./worktimeParser";

export default function EmploymentDetails({ stilling }) {
    const { properties } = stilling;

    return (
        <div className="EmploymentDetails detail-section">
            <h2 className="EmploymentDetails__head detail-section__head">
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
                        d="M14 3h-4a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1zM7 4v1H1a1 1 0 00-1 1v7a2 2 0 001 1.732V21a2 2 0 002 2h18a2 2 0 002-2v-6.268A2 2 0 0024 13V6a1 1 0 00-1-1h-6V4a3 3 0 00-3-3h-4a3 3 0 00-3 3zm0 3h15v6h-9v-1a1 1 0 10-2 0v1H2V7h5zm4 8H3v6h18v-6h-8v1a1 1 0 11-2 0v-1z"
                        fill="currentColor"
                    ></path>
                </svg>
                Om stillingen
            </h2>
            <div className="detail-section__body">
                <dl className="dl-flex typo-normal">
                    {properties.positioncount && [
                        <dt key="dt">Antall stillinger:</dt>,
                        <dd key="dd">{properties.positioncount}</dd>
                    ]}
                    {(properties.remote === "Hjemmekontor" || properties.remote === "Hybridkontor") && [
                        <dt key="dt">Hjemmekontor:</dt>,
                        <dd key="dd">
                            {properties.remote === "Hjemmekontor"
                                ? "Kun hjemmekontor"
                                : "Hybrid (noe hjemme, noe på arbeidsplassen)"}
                        </dd>
                    ]}
                    {properties.engagementtype && [
                        <dt key="dt">Ansettelsesform:</dt>,
                        <dd key="dd">{properties.engagementtype}</dd>
                    ]}
                    {properties.jobpercentage && [
                        <dt key="dt">Prosent:</dt>,
                        <dd key="dd">{properties.jobpercentage} %</dd>
                    ]}
                    {properties.extent && [<dt key="dt">Heltid/deltid:</dt>, <dd key="dd">{properties.extent}</dd>]}
                    {properties.sector && [<dt key="dt">Sektor:</dt>, <dd key="dd">{properties.sector}</dd>]}
                    {properties.workday && [
                        <dt key="dt">Arbeidsdager:</dt>,
                        <dd key="dd">{worktimeParser(properties.workday)}</dd>
                    ]}
                    {properties.workhours && [
                        <dt key="dt">Arbeidstid:</dt>,
                        <dd key="dd">{worktimeParser(properties.workhours)}</dd>
                    ]}
                    {properties.jobarrangement && [
                        <dt key="dt">Arb.tidsordning:</dt>,
                        <dd key="dd">{properties.jobarrangement}</dd>
                    ]}
                    {properties.starttime && [
                        <dt key="dt">Oppstart:</dt>,
                        <dd key="dd">
                            {isValidISOString(properties.starttime)
                                ? formatISOString(properties.starttime, "DD.MM.YYYY")
                                : properties.starttime}
                        </dd>
                    ]}
                </dl>
            </div>
        </div>
    );
}

EmploymentDetails.propTypes = {
    stilling: PropTypes.shape({
        properties: PropTypes.shape({
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            engagementtype: PropTypes.string,
            jobpercentage: PropTypes.string,
            extent: PropTypes.string,
            positioncount: PropTypes.string,
            sector: PropTypes.string,
            workday: PropTypes.string,
            workhours: PropTypes.string,
            jobarrangement: PropTypes.string,
            starttime: PropTypes.string
        }),
        location: PropTypes.shape({})
    }).isRequired
};
