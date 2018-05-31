import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_ENGAGEMENT_TYPE,
    UNCHECK_ENGAGEMENT_TYPE
} from './engagementReducer';

export class Engagement extends React.Component {
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
        const { engagementType, checkedEngagement } = this.props;
        let title = 'Ansettelsesform';
        if (checkedEngagement.length === 1) {
            title += ' (1 valgt)';
        } else if (checkedEngagement.length > 1) {
            title += ` (${checkedEngagement.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedEngagement.length > 0}
            >
                <div
                    role="group"
                    aria-labelledby="engagement-type-filter-header"
                    className="search-page-filter"
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
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    engagementType: state.engagement.engagementType,
    checkedEngagement: state.engagement.checkedEngagementType
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkEngagement: (value) => dispatch({ type: CHECK_ENGAGEMENT_TYPE, value }),
    uncheckEngagement: (value) => dispatch({ type: UNCHECK_ENGAGEMENT_TYPE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Engagement);
