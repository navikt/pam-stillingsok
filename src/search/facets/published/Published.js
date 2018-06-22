import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { SEARCH } from '../../searchReducer';
import {
    CHECK_PUBLISHED,
    UNCHECK_PUBLISHED
} from './publishedReducer';
import './Published.less';

class Published extends React.Component {
    onPublishedClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkPublished(value);
        } else {
            this.props.uncheckPublished(value);
        }
        this.props.search();
    };

    render() {
        const { published, checkedPublished } = this.props;
        return (
            <div
                className="Published"
            >
                {published && published.map((item) => (
                    <Checkbox
                        name="published"
                        key={item.key}
                        label={`Nye i dag (${item.count})`}
                        value={item.key}
                        onChange={this.onPublishedClick}
                        checked={checkedPublished.includes(item.key)}
                    />
                ))}
            </div>
        );
    }
}

Published.propTypes = {
    published: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedPublished: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkPublished: PropTypes.func.isRequired,
    uncheckPublished: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    published: state.published.published,
    checkedPublished: state.published.checkedPublished
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    checkPublished: (value) => dispatch({ type: CHECK_PUBLISHED, value }),
    uncheckPublished: (value) => dispatch({ type: UNCHECK_PUBLISHED, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Published);
