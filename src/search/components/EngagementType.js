import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {
    SEARCH,
    CHECK_ENGAGEMENT_TYPE,
    UNCHECK_ENGAGEMENT_TYPE,
} from "../search-redux";

export class EngagementType extends React.Component {

    onEngagementTypeClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkEngagementType(value);
        } else {
            this.props.uncheckEngagementType(value);
        }
        this.props.search();
    };

    render() {
        const { engagementType, checkedEngagementType }  = this.props;
        let title = "Ansettelsesform";
        if (checkedEngagementType.length === 1) {
            title += " (1 valgt)"
        } else if(checkedEngagementType.length > 1) {
            title += " ("+checkedEngagementType.length+" valgte)"
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen={checkedEngagementType.length > 0}
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
                            onChange={this.onEngagementTypeClick}
                            checked={checkedEngagementType.includes(item.key)}
                        />
                    ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

const mapStateToProps = (state) => ({
    engagementType: state.search.engagementType,
    checkedEngagementType: state.search.query.engagementType
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkEngagementType: (value) => dispatch({ type: CHECK_ENGAGEMENT_TYPE, value }),
    uncheckEngagementType: (value) => dispatch({ type: UNCHECK_ENGAGEMENT_TYPE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(EngagementType);