import { Flatknapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Lenkeknapp from '../common/Lenkeknapp';
import { formatISOString, isValidISOString } from '../utils';
import NotifyTypeEnum from './enums/NotifyTypeEnum';
import { SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL, SHOW_EDIT_SAVED_SEARCH_MODAL } from './savedSearchesReducer';

class SavedSearch extends React.Component {
    onChangeClick = () => {
        this.props.showEditSavedSearchModal(this.props.savedSearch.uuid);
    };

    onRemoveClick = () => {
        this.props.showConfirmRemoveSavedSearchModal(this.props.savedSearch.uuid);
    };

    onTitleClick = () => {
        try {
            sessionStorage.setItem('url', this.props.savedSearch.searchQuery);
        } catch (e) {
            // Ignore session storage error
        }
    };

    render() {
        const { savedSearch } = this.props;
        return (
            <div className="SavedSearch">
                <div className="SavedSearch__top">
                    <div className="SavedSearch__top__tittle">
                        <Link className="lenke typo-element" to="/" onClick={this.onTitleClick}>
                            {savedSearch.title}
                        </Link>
                    </div>
                    <div className="SavedSearch__top__buttons">
                        <Lenkeknapp onClick={this.onChangeClick}>Endre</Lenkeknapp>
                        <Lenkeknapp onClick={this.onRemoveClick}>Slett</Lenkeknapp>
                    </div>
                </div>
                <div className="SavedSearch__bottom">
                    {savedSearch.notifyType === NotifyTypeEnum.EMAIL ? (
                        <Normaltekst>Varighet på varsel: {savedSearch.duration} dager</Normaltekst>
                    ) : (
                        <Normaltekst>Ingen varsling</Normaltekst>
                    )}
                    {isValidISOString(savedSearch.updated) && (
                        <Undertekst className="SavedSearch__bottom__created">
                            Sist endret: {formatISOString(savedSearch.updated, 'DD.MM.YYYY')}
                        </Undertekst>
                    )}
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
        notifyType: PropTypes.string,
        duration: PropTypes.number,
        updated: PropTypes.string,
        searchQuery: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showConfirmRemoveSavedSearchModal: (uuid) => dispatch({ type: SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL, uuid }),
    showEditSavedSearchModal: (uuid) => dispatch({ type: SHOW_EDIT_SAVED_SEARCH_MODAL, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearch);
