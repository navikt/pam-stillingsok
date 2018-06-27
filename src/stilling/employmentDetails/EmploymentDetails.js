import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString } from '../../utils';


export default function EmploymentDetails({ properties }) {
    return (
        <div className="EmploymentDetails detail-section">
            <Undertittel className="EmploymentDetails__head detail-section__head">Om stillingen</Undertittel>
            <dl className="dl-flex typo-normal">
                {properties.jobtitle && [
                    <dt key="dt">Stillingstittel:</dt>,
                    <dd key="dd">{properties.jobtitle}</dd>]
                }
                {properties.location && [
                    <dt key="dt">Sted:</dt>,
                    <dd key="dd">{properties.location}</dd>
                ]}
                {properties.engagementtype && [
                    <dt key="dt">Ansettelsesform:</dt>,
                    <dd key="dd">{properties.engagementtype }</dd>
                ]}
                {properties.extent && [
                    <dt key="dt">Heltid/deltid:</dt>,
                    <dd key="dd">{properties.extent}</dd>
                ]}
                {properties.positioncount && [
                    <dt key="dt">Antall stillinger:</dt>,
                    <dd key="dd">{properties.positioncount}</dd>
                ]}
                {properties.sector && [
                    <dt key="dt">Sektor:</dt>,
                    <dd key="dd">{properties.sector}</dd>
                ]}
                {properties.workday && [
                    <dt key="dt">Arbeidsdager:</dt>,
                    <dd key="dd">{properties.workday}</dd>
                ]}
                {properties.workhours && [
                    <dt key="dt">Arbeidstid:</dt>,
                    <dd key="dd">{properties.workhours}</dd>
                ]}
                {properties.jobarrangement && [
                    <dt key="dt">Arb.tidsordning:</dt>,
                    <dd key="dd">{properties.jobarrangement}</dd>
                ]}
                {properties.starttime && [
                    <dt key="dt">Oppstart:</dt>,
                    <dd key="dd">
                        {isValidISOString(properties.starttime) ?
                            formatISOString(properties.starttime, 'D. MMMM YYYY') :
                            properties.starttime}
                    </dd>
                ]}
            </dl>
        </div>
    );
}

EmploymentDetails.propTypes = {
    properties: PropTypes.shape({
        jobtitle: PropTypes.string,
        location: PropTypes.string,
        engagementtype: PropTypes.string,
        extent: PropTypes.string,
        positioncount: PropTypes.string,
        sector: PropTypes.string,
        workday: PropTypes.string,
        workhours: PropTypes.string,
        jobarrangement: PropTypes.string,
        starttime: PropTypes.string
    }).isRequired
};

