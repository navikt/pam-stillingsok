import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../../searchReducer';
import './Occupations.less';
import { toFacetTitleWithCount } from '../utils';
import {
    CHECK_FIRST_LEVEL,
    CHECK_SECOND_LEVEL,
    OCCUPATION_ANNET,
    UNCHECK_FIRST_LEVEL,
    UNCHECK_SECOND_LEVEL
} from './occupationsReducer';

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
        const {
            occupationFirstLevels, checkedFirstLevels, checkedSecondLevels, deprecatedFirstLevels,
            deprecatedSecondLevels
        } = this.props;
        return (
            <Ekspanderbartpanel
                tittel={toFacetTitleWithCount('Yrke', checkedFirstLevels.length + checkedSecondLevels.length)}
                className="Occupations ekspanderbartPanel--green"
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
                    {((deprecatedFirstLevels && deprecatedFirstLevels.length > 0)
                        || (deprecatedSecondLevels && deprecatedSecondLevels.length > 0)) && (
                        <div>
                            <div className="Search__separator" />
                            <Element className="blokk-xs">Følgende kriterier gir 0 treff:</Element>
                        </div>
                    )}
                    {deprecatedFirstLevels && deprecatedFirstLevels.map((first) => (
                        <div key={first}>
                            <Checkbox
                                name="deprecatedOccupation"
                                label={`${first} (0)`}
                                value={first}
                                onChange={this.onFirstLevelClick}
                                checked={checkedFirstLevels.includes(first)}
                            />
                        </div>
                    ))}
                    {deprecatedSecondLevels && deprecatedSecondLevels.map((second) => (
                        <div key={second}>
                            <Checkbox
                                name="deprecatedOccupation"
                                label={`${second.split('.')[1]} (0)`}
                                value={second}
                                onChange={this.onSecondLevelClick}
                                checked={checkedSecondLevels.includes(second)}
                            />
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
    deprecatedFirstLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    deprecatedSecondLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkFirstLevel: PropTypes.func.isRequired,
    uncheckFirstLevel: PropTypes.func.isRequired,
    checkSecondLevel: PropTypes.func.isRequired,
    uncheckSecondLevel: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    occupationFirstLevels: state.occupations.occupationFirstLevels,
    checkedFirstLevels: state.occupations.checkedFirstLevels,
    checkedSecondLevels: state.occupations.checkedSecondLevels,
    deprecatedFirstLevels: state.occupations.deprecatedFirstLevels,
    deprecatedSecondLevels: state.occupations.deprecatedSecondLevels
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkFirstLevel: (firstLevel) => dispatch({ type: CHECK_FIRST_LEVEL, firstLevel }),
    uncheckFirstLevel: (firstLevel) => dispatch({ type: UNCHECK_FIRST_LEVEL, firstLevel }),
    checkSecondLevel: (secondLevel) => dispatch({ type: CHECK_SECOND_LEVEL, secondLevel }),
    uncheckSecondLevel: (secondLevel) => dispatch({ type: UNCHECK_SECOND_LEVEL, secondLevel })
});

export default connect(mapStateToProps, mapDispatchToProps)(Occupations);

