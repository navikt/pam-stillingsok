import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import './Engagement.less';
import { toFacetTitleWithCount } from '../utils';
import { CHECK_ENGAGEMENT_TYPE, UNCHECK_ENGAGEMENT_TYPE } from './engagementReducer';

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

    render() {
        const { engagementType, checkedEngagement, deprecatedEngagementType } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Ansettelsesform', checkedEngagement.length)}
                className="Engagement ekspanderbartPanel--green"
                apen
            >
                <div
                    role="group"
                    aria-label="Ansettelsesform"
                    className="Engagement__inner"
                >
                    <div>
                        {engagementType && engagementType.map((item) => (
                            <Checkbox
                                name="engagementType"
                                key={item.key}
                                label={`${item.key} (${item.count})`}
                                value={item.key}
                                onChange={this.onEngagementClick}
                                checked={checkedEngagement.includes(item.key)}
                            />
                        ))}
                        {deprecatedEngagementType && deprecatedEngagementType.length > 0 && (
                            <div>
                                <div className="Search__separator" />
                                <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                            </div>
                        )}
                        {deprecatedEngagementType && deprecatedEngagementType.map((engagement) => (
                            <div key={engagement}>
                                <Checkbox
                                    name="deprecatedEngagement"
                                    label={`${engagement} (0)`}
                                    value={engagement}
                                    onChange={this.onEngagementClick}
                                    checked={checkedEngagement.includes(engagement)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
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
    engagementType: state.engagement.engagementType,
    checkedEngagement: state.engagement.checkedEngagementType,
    deprecatedEngagementType: state.engagement.deprecatedEngagementType
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkEngagement: (value) => dispatch({ type: CHECK_ENGAGEMENT_TYPE, value }),
    uncheckEngagement: (value) => dispatch({ type: UNCHECK_ENGAGEMENT_TYPE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Engagement);
