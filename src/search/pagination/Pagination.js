import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { SEARCH } from '../searchResults/searchResultsReducer';
import {
    INCREASE_PAGINATION_FROM,
    DECREASE_PAGINATION_FROM
} from './paginationRedux';
import './Pagination.less';

export class Pagination extends React.Component {
    onPaginationNextClick = () => {
        this.props.scrollToTopOfResultList(); //
        this.props.increasePaginationFrom();
        this.props.search();
    };

    onPaginationPreviousClick = () => {
        this.props.scrollToTopOfResultList();
        this.props.decreasePaginationFrom();
        this.props.search();
    };

    render() {
        const { from, total } = this.props;
        const canPaginatePrevious = from !== undefined && from > 0;
        const canPaginateNext = (from === undefined && total > 20) || (from + 20 < total);
        return (
            <div id="search-result-pagination" className="Pagination">
                {canPaginatePrevious && (
                    <Knapp className="Pagination__button knapp--green" onClick={this.onPaginationPreviousClick}>
                        Forrige
                    </Knapp>
                )}
                {canPaginateNext && (
                    <Knapp className="Pagination__button knapp--green" onClick={this.onPaginationNextClick}>
                        Neste
                    </Knapp>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    from: state.pagination.from,
    total: state.searchResults.searchResult.total
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    increasePaginationFrom: () => dispatch({ type: INCREASE_PAGINATION_FROM }),
    decreasePaginationFrom: () => dispatch({ type: DECREASE_PAGINATION_FROM })
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
