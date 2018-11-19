import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './NoResults.less';

function NoResults({
    deprecatedFirstLevels, deprecatedSecondLevels, deprecatedCounties, deprecatedMunicipals,
    deprecatedExtent, deprecatedEngagementType, deprecatedSector
}) {
    const deprecatedCriteria = !(deprecatedFirstLevels.length === 0 && deprecatedSecondLevels.length === 0
        && deprecatedCounties.length === 0 && deprecatedMunicipals.length === 0
        && deprecatedExtent.length === 0 && deprecatedEngagementType.length === 0
        && deprecatedSector.length === 0);
    console.log(deprecatedCriteria);
    return (
        <div className="NoResults">
            <Ingress>Vi fant ingen ledige stillinger som matcher søket ditt.</Ingress>
            {deprecatedCriteria && deprecatedFirstLevels.map((o) => (
                <p key={o}>{o}</p>
            ))}
        </div>
    );
}

NoResults.propTypes = {

};

const mapStateToProps = (state) => ({
    deprecatedFirstLevels: state.occupations.deprecatedFirstLevels,
    deprecatedSecondLevels: state.occupations.deprecatedSecondLevels,
    deprecatedCounties: state.counties.deprecatedCounties,
    deprecatedMunicipals: state.counties.deprecatedMunicipals,
    deprecatedExtent: state.extent.deprecatedExtent,
    deprecatedEngagementType: state.engagement.deprecatedEngagementType,
    deprecatedSector: state.sector.deprecatedSector
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(NoResults);
