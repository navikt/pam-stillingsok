import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Flatknapp } from '@navikt/arbeidsplassen-knapper';
import '../../common/components/Icons.less';
import { CONTEXT_PATH } from '../../fasitProperties';
import { formatISOString, isValidISOString } from '../../utils';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import SavedSearchStatusEnum from '../enums/SavedSearchStatusEnum';
import { SavedSearchFormMode, SET_FORM_DATA, SHOW_SAVED_SEARCH_FORM } from '../form/savedSearchFormReducer';
import {
    SET_CURRENT_SAVED_SEARCH,
    SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL,
    UPDATE_SAVED_SEARCH
} from '../savedSearchesReducer';
import { track } from '../../analytics';

class SavedSearchListItem extends React.Component {
    onChangeClick = () => {
        this.props.showSavedSearchForm(this.props.savedSearch);
    };

    onRemoveClick = () => {
        this.props.showConfirmRemoveSavedSearchModal(this.props.savedSearch.uuid);
    };

    onTitleClick = () => {
        track('send', 'event', 'ux-test-juni-2021', 'Åpnet et lagret søk fra Lagrede søk-siden')
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
        const expired = savedSearch.status === SavedSearchStatusEnum.INACTIVE &&
            savedSearch.notifyType === NotifyTypeEnum.EMAIL;
        return (
            <div className="SavedSearchListItem__wrapper">
                <div className={classNames('SavedSearchListItem', { 'SavedSearchListItem--expired': expired })}>
                    <div className="SavedSearchListItem__top">
                        <div className="SavedSearchListItem__top_flex">
                            <h2 className="SavedSearchListItem__title">
                                <Link
                                    className="link"
                                    to={`${CONTEXT_PATH}${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}
                                    onClick={this.onTitleClick}
                                >
                                    {savedSearch.title}
                                </Link>
                            </h2>
                            {isValidISOString(savedSearch.updated) && (
                                <Normaltekst className="SavedSearchListItem__created">
                                    Sist endret: {formatISOString(savedSearch.updated, 'DD.MM.YYYY')}
                                </Normaltekst>
                            )}
                        </div>
                        {savedSearch.notifyType === NotifyTypeEnum.EMAIL ? (
                            <React.Fragment>
                                <Normaltekst>Varighet på varsel: {savedSearch.duration} dager</Normaltekst>
                                {isValidISOString(savedSearch.expires) && (
                                    <Normaltekst>
                                        Utløper: {formatISOString(savedSearch.expires, 'DD.MM.YYYY')}
                                    </Normaltekst>
                                )}
                            </React.Fragment>
                        ) : (
                            <Normaltekst>Ingen varsling</Normaltekst>
                        )}
                    </div>
                    <div className="SavedSearchListItem__bottom">
                        <Flatknapp onClick={this.onChangeClick} className="Edit">
                            <span className="Edit__icon" />
                            Endre
                        </Flatknapp>
                        <Flatknapp onClick={this.onRemoveClick} className="Delete">
                            <span className="Delete__icon" />
                            Slett
                        </Flatknapp>
                    </div>
                </div>
                {expired && (
                    <AlertStripe type="advarsel" className="SavedSearchListItem__alertstripe alertstripe--solid">
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
