import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { SEARCH } from '../../searchReducer';
import { SET_PUBLISHED } from './publishedReducer';
import './Published.less';

const PublishedLabelsEnum = {
    'now-1d': 'Nye i dag'
};

class Published extends React.Component {
    onPublishedClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.setPublished(value);
        } else {
            this.props.setPublished(undefined);
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
                        label={`${PublishedLabelsEnum[item.key]} (${item.count})`}
                        value={item.key}
                        onChange={this.onPublishedClick}
                        checked={checkedPublished === item.key}
                    />
                ))}
            </div>
        );
    }
}

Published.defaultProps = {
    checkedPublished: undefined
};

Published.propTypes = {
    published: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        count: PropTypes.number
    })).isRequired,
    checkedPublished: PropTypes.string,
    setPublished: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    published: state.published.published,
    checkedPublished: state.published.checkedPublished
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setPublished: (value) => dispatch({ type: SET_PUBLISHED, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(Published);
