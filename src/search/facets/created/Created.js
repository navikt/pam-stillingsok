import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_CREATED,
    UNCHECK_CREATED
} from './createdReducer';
import './Created.less';

// TODO rename this facet to "Published" in code

class Created extends React.Component {
    onCreatedClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkCreated(value);
        } else {
            this.props.uncheckCreated(value);
        }
        this.props.search();
    };

    render() {
        const { created, checkedCreated } = this.props;
        return (
            <div
                className="Created"
            >
                {created && created.map((item) => (
                    <Checkbox
                        name="created"
                        key={item.key}
                        label={`Nye i dag (${item.count})`}
                        value={item.key}
                        onChange={this.onCreatedClick}
                        checked={checkedCreated.includes(item.key)}
                    />
                ))}
            </div>
        );
    }
}

Created.propTypes = {
    created: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedCreated: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkCreated: PropTypes.func.isRequired,
    uncheckCreated: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    created: state.created.created,
    checkedCreated: state.created.checkedCreated
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkCreated: (value) => dispatch({ type: CHECK_CREATED, value }),
    uncheckCreated: (value) => dispatch({ type: UNCHECK_CREATED, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Created);
