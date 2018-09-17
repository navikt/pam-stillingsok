import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flatknapp } from 'nav-frontend-knapper';
import { Link } from 'react-router-dom';
import {
    SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL,
    SHOW_EDIT_SAVED_SEARCH_MODAL
} from './savedSearchesReducer';

class SavedSearch extends React.Component {
    onChangeClick = () => {
        this.props.showEditSavedSearchModal(this.props.savedSearch.uuid);
    };

    onRemoveClick = () => {
        this.props.showConfirmRemoveSavedSearchModal(this.props.savedSearch.uuid);
    };

    onTitleClick = () => {
        try {
            sessionStorage.setItem('url', this.props.savedSearch.url);
        } catch (e) {
            // Ignore session storage error
        }
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <div className="SavedSearch">
                <div className="SavedSearch__top">
                    <Link className="lenke typo-element" to="/" onClick={this.onTitleClick}>{savedSearch.title}</Link>
                    <div className="SavedSearch__top__buttons">
                        <Flatknapp mini onClick={this.onChangeClick}>Endre</Flatknapp>
                        <Flatknapp mini onClick={this.onRemoveClick}>Slett</Flatknapp>
                    </div>
                </div>
                <div className="SavedSearch__bottom">
                    {savedSearch.subscribe ? (
                        <Normaltekst>Varighet på varsel: {savedSearch.duration} dager</Normaltekst>
                    ) : (
                        <Normaltekst>Ingen varsling</Normaltekst>
                    )}
                    <Undertekst className="SavedSearch__bottom__created">Opprettet: {savedSearch.created}</Undertekst>
                </div>
            </div>
        );
    }
}

SavedSearch.propTypes = {
    showConfirmRemoveSavedSearchModal: PropTypes.func.isRequired,
    showEditSavedSearchModal: PropTypes.func.isRequired,
    savedSearch: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        duration: PropTypes.string,
        created: PropTypes.string,
        url: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showConfirmRemoveSavedSearchModal: (uuid) => dispatch({ type: SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL, uuid }),
    showEditSavedSearchModal: (uuid) => dispatch({ type: SHOW_EDIT_SAVED_SEARCH_MODAL, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearch);
