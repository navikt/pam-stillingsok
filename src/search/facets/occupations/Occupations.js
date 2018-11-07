import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_FIRST_LEVEL,
    UNCHECK_FIRST_LEVEL,
    CHECK_SECOND_LEVEL,
    UNCHECK_SECOND_LEVEL,
    OCCUPATION_ANNET
} from './occupationsReducer';
import './Occupations.less';

class Occupations extends React.Component {
    onFirstLevelClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkFirstLevel(value);
        } else {
            this.props.uncheckFirstLevel(value);
        }
        this.props.search();
    };

    onSecondLevelClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkSecondLevel(value);
        } else {
            this.props.uncheckSecondLevel(value);
        }
        this.props.search();
    };

    render() {
        const { occupationFirstLevels, checkedFirstLevels, checkedSecondLevels } = this.props;
        let title = 'Yrke';
        if ((checkedFirstLevels.length + checkedSecondLevels.length) === 1) {
            title += ' (1 valgt)';
        } else if ((checkedFirstLevels.length + checkedSecondLevels.length) > 1) {
            title += ` (${checkedFirstLevels.length + checkedSecondLevels.length} valgte)`;
        }
        return (
            <Ekspanderbartpanel
                tittel={title}
                className="Occupations"
                apen
            >
                <div
                    role="group"
                    aria-label="Velg yrkeskategori"
                    className="Occupations__inner"
                >
                    {occupationFirstLevels && occupationFirstLevels.map((firstLevel) => (
                        <div key={firstLevel.key}>
                            <Checkbox
                                name="occupation"
                                label={`${firstLevel.key} (${firstLevel.count})`}
                                value={firstLevel.key}
                                onChange={this.onFirstLevelClick}
                                checked={checkedFirstLevels.includes(firstLevel.key)}
                            />
                            {checkedFirstLevels && checkedFirstLevels.includes(firstLevel.key)
                                && firstLevel.key !== OCCUPATION_ANNET && (
                                    <div
                                        className="Occupations__inner__secondLevels"
                                        role="group"
                                        aria-label="Velg yrke"
                                    >
                                        {firstLevel.occupationSecondLevels &&
                                    firstLevel.occupationSecondLevels.map((secondLevel) => (
                                        <Checkbox
                                            name="occupation"
                                            key={secondLevel.key}
                                            label={`${secondLevel.label} (${secondLevel.count})`}
                                            value={secondLevel.key}
                                            onChange={this.onSecondLevelClick}
                                            checked={checkedSecondLevels.includes(secondLevel.key)}
                                        />
                                    ))}
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Occupations.propTypes = {
    occupationFirstLevels: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number,
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        }))
    })).isRequired,
    checkedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkFirstLevel: PropTypes.func.isRequired,
    uncheckFirstLevel: PropTypes.func.isRequired,
    checkSecondLevel: PropTypes.func.isRequired,
    uncheckSecondLevel: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    occupationFirstLevels: state.occupations.occupationFirstLevels,
    checkedFirstLevels: state.occupations.checkedFirstLevels,
    checkedSecondLevels: state.occupations.checkedSecondLevels
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkFirstLevel: (firstLevel) => dispatch({ type: CHECK_FIRST_LEVEL, firstLevel }),
    uncheckFirstLevel: (firstLevel) => dispatch({ type: UNCHECK_FIRST_LEVEL, firstLevel }),
    checkSecondLevel: (secondLevel) => dispatch({ type: CHECK_SECOND_LEVEL, secondLevel }),
    uncheckSecondLevel: (secondLevel) => dispatch({ type: UNCHECK_SECOND_LEVEL, secondLevel })
});

export default connect(mapStateToProps, mapDispatchToProps)(Occupations);

