import React from 'react';
import PropTypes from 'prop-types';
import {formatISOString, isValidISOString} from '../../utils';
import getWorkLocation from '../../../server/common/getWorkLocation';
import getEmployer from "../../../server/common/getEmployer";
import './Summary.less';

export default function Summary({stilling}) {
    const {properties} = stilling;
    const location = getWorkLocation(stilling.properties.location, stilling.locationList);

    return (
        <div className="Summary__dl">
            <dl className="Summary__dl">
                {properties.jobtitle && 
                    <React.Fragment>
                        <dt>Arbeidsgiver:</dt>
                        <dd>{getEmployer(stilling)}</dd>
                    </React.Fragment>
                }
                {properties.jobtitle && 
                    <React.Fragment>
                        <dt>Stillingstittel:</dt>
                        <dd>{properties.jobtitle}</dd>
                    </React.Fragment>
                }
                {location &&
                    <React.Fragment>
                        <dt>Sted:</dt>
                        <dd>{location}</dd>
                    </React.Fragment>
                }
                {properties.applicationdue && [
                    <dt key="dt">Søknadsfrist:</dt>,
                    <dd key="dd">
                        {isValidISOString(properties.applicationdue) ?
                            formatISOString(properties.applicationdue, 'DD.MM.YYYY') :
                            properties.applicationdue}
                    </dd>
                ]}
            </dl>
        </div>
    );
}

Summary.propTypes = {
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

