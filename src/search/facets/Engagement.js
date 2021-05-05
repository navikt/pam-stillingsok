import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import Facet from './Facet';
import './Facet.less';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import UnknownFacetValues from './UnknownFacetValues';

class Engagement extends React.Component {
    onEngagementClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkEngagement(value);
        } else {
            this.props.uncheckEngagement(value);
        }
        this.props.search();
    };

    /**
     * This ensures that 'Annet' is displayed as 'Ikke oppgitt' in the search filters.
     * It's a mere cosmetic change since the value attributed to the checkbox
     * remains the same. The decision behind this particular change came due to
     * a problem in our structured data where most of the ads coming from different
     * stakeholders don't include the correct classification 'Fast'.
     * @param key
     * @returns {string|*}
     */
    editedItemKey(key) {
        return key === 'Annet' ? 'Ikke oppgitt' : key;
    }

    render() {
        const { engagementType, checkedEngagement, deprecatedEngagementType } = this.props;
        return (
            <Facet
                panelId={SearchCriteriaPanels.ENGAGEMENT_TYPE_PANEL}
                count={checkedEngagement.length}
                title="Ansettelsesform"
            >
                {engagementType && engagementType.map((item) => (
                    <Checkbox
                        name="engagementType"
                        key={this.editedItemKey(item.key)}
                        label={`${this.editedItemKey(item.key)} (${item.count})`}
                        value={item.key}
                        onChange={this.onEngagementClick}
                        checked={checkedEngagement.includes(item.key)}
                    />
                ))}
                <UnknownFacetValues
                    namePrefix="engagementType"
                    unknownValues={deprecatedEngagementType}
                    checkedValues={checkedEngagement}
                    onClick={this.onEngagementClick}
                />
            </Facet>
        );
    }
}

Engagement.propTypes = {
    engagementType: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedEngagement: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedEngagementType: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkEngagement: PropTypes.func.isRequired,
    uncheckEngagement: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    engagementType: state.facets.engagementTypeFacets,
    checkedEngagement: state.searchQuery.engagementType,
    deprecatedEngagementType: state.unknownFacets.unknownEngagementTypes
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkEngagement: (value) => dispatch({ type: ADD_ENGAGEMENT_TYPE, value }),
    uncheckEngagement: (value) => dispatch({ type: REMOVE_ENGAGEMENT_TYPE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Engagement);
