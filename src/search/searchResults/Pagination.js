import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from '@navikt/arbeidsplassen-knapper';
import { LOAD_MORE } from '../searchReducer';
import './Pagination.less';

class Pagination extends React.Component {
    onLoadMoreClick = () => {
        this.props.loadMore();
    };

    render() {
        const { isLoadingMore } = this.props;
        return (
            <div className="Pagination">
                <Knapp
                    disabled={isLoadingMore}
                    spinner={isLoadingMore}
                    className="Pagination__button"
                    onClick={this.onLoadMoreClick}
                >
                    Se flere
                </Knapp>
            </div>
        );
    }
}

Pagination.propTypes = {
    isLoadingMore: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isLoadingMore: state.search.isLoadingMore
});

const mapDispatchToProps = (dispatch) => ({
    loadMore: () => dispatch({ type: LOAD_MORE })
});

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
