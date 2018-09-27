import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Lenkeknapp from '../../common/Lenkeknapp';
import { formatISOString, isValidISOString } from '../../utils';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from '../form/savedSearchFormReducer';
import {
    SET_CURRENT_SAVED_SEARCH,
    SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL,
    SHOW_EDIT_SAVED_SEARCH_MODAL
} from '../savedSearchesReducer';

class SavedSearchListItem extends React.Component {
    onChangeClick = () => {
        this.props.showSavedSearchForm(this.props.savedSearch, 'Tilbake til lagrede søk');
    };

    onRemoveClick = () => {
        this.props.showConfirmRemoveSavedSearchModal(this.props.savedSearch.uuid);
    };

    onTitleClick = () => {
        this.props.setCurrentSavedSearch(this.props.savedSearch);
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <div className="SavedSearchListItem">
                <div className="SavedSearchListItem__top">
                    <div className="SavedSearchListItem__top__tittle">
                        <Link className="lenke" to="/" onClick={this.onTitleClick}>
                            <Element tag="h3">{savedSearch.title}</Element>
                        </Link>
                    </div>
                    <div className="SavedSearchListItem__top__buttons">
                        <Lenkeknapp onClick={this.onChangeClick}>Endre</Lenkeknapp>
                        <Lenkeknapp onClick={this.onRemoveClick}>Slett</Lenkeknapp>
                    </div>
                </div>
                <div className="SavedSearchListItem__bottom">
                    {savedSearch.notifyType === NotifyTypeEnum.EMAIL ? (
                        <Normaltekst>Varighet på varsel: {savedSearch.duration} dager</Normaltekst>
                    ) : (
                        <Normaltekst>Ingen varsling</Normaltekst>
                    )}
                    {isValidISOString(savedSearch.updated) && (
                        <Undertekst className="SavedSearchListItem__bottom__created">
                            Sist endret: {formatISOString(savedSearch.updated, 'DD.MM.YYYY')}
                        </Undertekst>
                    )}
                </div>
            </div>
        );
    }
}

SavedSearchListItem.propTypes = {
    showConfirmRemoveSavedSearchModal: PropTypes.func.isRequired,
    showSavedSearchForm: PropTypes.func.isRequired,
    setCurrentSavedSearch: PropTypes.func.isRequired,
    savedSearch: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        notifyType: PropTypes.string,
        duration: PropTypes.number,
        updated: PropTypes.string,
        searchQuery: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showConfirmRemoveSavedSearchModal: (uuid) => dispatch({ type: SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL, uuid }),
    showSavedSearchForm: (formData, cancelButtonText) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode: SavedSearchFormMode.EDIT,
        formData,
        showAddOrReplace: false,
        cancelButtonText
    }),
    setCurrentSavedSearch: (savedSearch) => dispatch({ type: SET_CURRENT_SAVED_SEARCH, savedSearch })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchListItem);
