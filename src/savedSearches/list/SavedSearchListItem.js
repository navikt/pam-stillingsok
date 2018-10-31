import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import { Flatknapp } from 'nav-frontend-knapper';
import Lenkeknapp from '../../common/Lenkeknapp';
import { formatISOString, isValidISOString } from '../../utils';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import SavedSearchStatusEnum from '../enums/SavedSearchStatusEnum';
import {
    SavedSearchFormMode,
    SET_FORM_DATA,
    SHOW_SAVED_SEARCH_FORM
} from '../form/savedSearchFormReducer';
import {
    SET_CURRENT_SAVED_SEARCH,
    SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL,
    UPDATE_SAVED_SEARCH
} from '../savedSearchesReducer';
import '../../common/Icons.less';

class SavedSearchListItem extends React.Component {
    onChangeClick = () => {
        this.props.showSavedSearchForm(this.props.savedSearch);
    };

    onRemoveClick = () => {
        this.props.showConfirmRemoveSavedSearchModal(this.props.savedSearch.uuid);
    };

    onTitleClick = () => {
        this.props.setCurrentSavedSearch(this.props.savedSearch);
    };

    onExtendDurationClick = () => {
        this.props.setFormData({
            ...this.props.savedSearch,
            status: SavedSearchStatusEnum.ACTIVE
        });
        this.props.updateSavedSearch();
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <div className="SavedSearchListItem__wrapper">
                <div className="SavedSearchListItem">
                    <div className="SavedSearchListItem__top">
                        <div className="SavedSearchListItem__top_flex">
                            <div className="SavedSearchListItem__title">
                                <Element tag="h3">
                                    <Link className="lenke" to="/" onClick={this.onTitleClick}>
                                        {savedSearch.title}
                                    </Link>
                                </Element>
                            </div>
                            {isValidISOString(savedSearch.updated) && (
                                <Undertekst className="SavedSearchListItem__created">
                                Sist endret: {formatISOString(savedSearch.updated, 'DD.MM.YYYY')}
                                </Undertekst>
                            )}
                        </div>
                        {savedSearch.notifyType === NotifyTypeEnum.EMAIL ? (
                            <Normaltekst>Varighet på varsel: {savedSearch.duration} dager</Normaltekst>
                        ) : (
                            <Normaltekst>Ingen varsling</Normaltekst>
                        )}
                    </div>
                    <div className="SavedSearchListItem__bottom">
                        <Lenkeknapp onClick={this.onChangeClick} className="Edit">
                            <i className="Edit__icon" />
                            Endre
                        </Lenkeknapp>
                        <Lenkeknapp onClick={this.onRemoveClick} className="Delete">
                            <i className="Delete__icon" />
                            Slett
                        </Lenkeknapp>
                    </div>
                </div>
                {savedSearch.status === SavedSearchStatusEnum.INACTIVE &&
                    savedSearch.notifyType === NotifyTypeEnum.EMAIL && (
                        <AlertStripe type="info" solid className="SavedSearchListItem__alertstripe">
                            Ditt varsel for dette søket har gått ut
                            <Flatknapp
                                className="SavedSearchListItem__button-alertstripe"
                                onClick={this.onExtendDurationClick}
                                mini
                            >
                                Start ny varsling
                            </Flatknapp>
                        </AlertStripe>
                    )}
            </div>
        );
    }
}

SavedSearchListItem.propTypes = {
    showConfirmRemoveSavedSearchModal: PropTypes.func.isRequired,
    showSavedSearchForm: PropTypes.func.isRequired,
    setCurrentSavedSearch: PropTypes.func.isRequired,
    updateSavedSearch: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired,
    savedSearch: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        notifyType: PropTypes.string,
        duration: PropTypes.number,
        updated: PropTypes.string,
        searchQuery: PropTypes.string,
        expired: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showConfirmRemoveSavedSearchModal: (uuid) => dispatch({ type: SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL, uuid }),
    showSavedSearchForm: (formData) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode: SavedSearchFormMode.EDIT,
        formData,
        showAddOrReplace: false
    }),
    setCurrentSavedSearch: (savedSearch) => dispatch({ type: SET_CURRENT_SAVED_SEARCH, savedSearch }),
    setFormData: (formData) => dispatch({ type: SET_FORM_DATA, formData }),
    updateSavedSearch: () => dispatch({ type: UPDATE_SAVED_SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchListItem);
