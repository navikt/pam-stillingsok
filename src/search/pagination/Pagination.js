import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { LOAD_MORE, PAGE_SIZE } from '../searchReducer';
import './Pagination.less';

class Pagination extends React.Component {
    onLoadMoreClick = () => {
        this.props.loadMore();
    };

    render() {
        const { from, total, isLoadingMore } = this.props;
        const hasMore = (from === undefined && total > PAGE_SIZE) || (from + PAGE_SIZE < total);
        return (
            <div className="Pagination">
                {hasMore && (
                    <Knapp
                        disabled={isLoadingMore}
                        spinner={isLoadingMore}
                        className="Pagination__button knapp--green"
                        onClick={this.onLoadMoreClick}
                    >
                        Se flere
                    </Knapp>
                )}
            </div>
        );
    }
}

Pagination.propTypes = {
    from: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    isLoadingMore: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    from: state.search.from,
    total: state.search.searchResult.total,
    isLoadingMore: state.search.isLoadingMore
});

const mapDispatchToProps = (dispatch) => ({
    loadMore: () => dispatch({ type: LOAD_MORE })
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
