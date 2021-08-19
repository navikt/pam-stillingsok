import { Checkbox } from 'nav-frontend-skjema';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SearchCriteriaPanels } from './facetPanelsReducer';
import { SET_PUBLISHED } from '../searchQueryReducer';
import { SEARCH } from '../searchReducer';
import Facet from './Facet';

export const PublishedLabelsEnum = {
    'now/d': 'Nye i dag'
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
            <Facet
                panelId={SearchCriteriaPanels.PUBLISHED_PANEL}
                count={checkedPublished ? 1 : 0}
                title="Publisert"
            >
                {published && published.map((item) => (
                    <Checkbox
                        name="published"
                        key={item.key}
                        label={`${PublishedLabelsEnum[item.key]} (${item.count})`}
                        aria-label={`${PublishedLabelsEnum[item.key]}. Antall stillinger (${item.count})`}
                        value={item.key}
                        onChange={this.onPublishedClick}
                        checked={checkedPublished === item.key}
                    />
                ))}
            </Facet>
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
    published: state.facets.publishedFacets,
    checkedPublished: state.searchQuery.published
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setPublished: (value) => dispatch({ type: SET_PUBLISHED, value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Published);
