import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import {
    SEARCH,
    INCREASE_PAGINATION_FROM,
    DECREASE_PAGINATION_FROM,
} from "../domene";

export class SearchResultPagination extends React.Component {

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

    render(){
        const { from, total } = this.props;
        const canPaginatePrevious = from !== undefined && from > 0;
        const canPaginateNext = (from === undefined && total > 20) || (from + 20 < total);
        return (
            <div id="search-result-pagination">
                {canPaginatePrevious && (
                    <Knapp className="knapp--green" onClick={this.onPaginationPreviousClick}>
                        Forrige
                    </Knapp>
                )}
                {canPaginateNext && (
                    <Knapp className="knapp--green" onClick={this.onPaginationNextClick}>
                        Neste
                    </Knapp>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    from: state.query.from,
    total: state.searchResult.total
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    increasePaginationFrom: () => dispatch({ type: INCREASE_PAGINATION_FROM }),
    decreasePaginationFrom: () => dispatch({ type: DECREASE_PAGINATION_FROM })
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultPagination);
