import React from 'react';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import {
    SET_SAVED_SEARCH_DURATION,
    SET_SAVED_SEARCH_NOTIFY_TYPE,
    SET_SAVED_SEARCH_TITLE,
    SET_SHOW_REGISTER_EMAIL,
    VALIDATE_EMAIL,
    SET_EMAIL_INPUT_VALUE
} from './savedSearchFormReducer';
import './SavedSearchForm.less';

class AddOrReplaceForm extends React.Component {
    constructor(props) {
        super(props);
        this.titleRef = null;
    }

    onTitleChange = (e) => {
        this.props.setTitle(e.target.value);
    };

    onEmailChange = (e) => {
        this.props.setEmailInputValue(e.target.value);
    };

    onEmailBlur = () => {
        this.props.validateEmail();
    };

    onSubscribeChange = (e) => {
        if (e.target.checked) {
            this.props.setNotifyType(NotifyTypeEnum.EMAIL);
            const emailNotSet = this.emailNotSet();
            this.props.setShowRegisterEmail(emailNotSet);
        } else {
            this.props.setNotifyType(NotifyTypeEnum.NONE);
            this.props.setShowRegisterEmail(false);
        }
    };

    onDurationChange = (e) => {
        this.props.setDuration(e.target.value);
    };

    setTitleRef = (element) => {
        this.titleRef = element;
    };

    setFocusTitle = () => {
        if(this.props.validation.title && this.titleRef){
            this.titleRef.focus();
        }
    };

    emailNotSet = () => {
        return (this.props.user.email === undefined ||
            this.props.user.email === null ||
            this.props.user.email.trim().length === 0);
    };

    render() {
        const { formData, validation } = this.props;
        return (
            <div>
                <Input
                    className="SavedSearchModal__body__name"
                    label="Navn*"
                    onChange={this.onTitleChange}
                    value={formData.title}
                    feil={validation.title ? { feilmelding: validation.title } : undefined}
                    inputRef={this.setTitleRef}
                />
                <Checkbox
                    className="SavedSearchModal__body__notify"
                    label="Ja, jeg ønsker å motta e-post med varsel om nye treff"
                    onChange={this.onSubscribeChange}
                    checked={formData.notifyType === NotifyTypeEnum.EMAIL}
                />
                {formData.notifyType === NotifyTypeEnum.EMAIL && (
                    <div>
                        <SkjemaGruppe className="blokk-s">
                            <Fieldset legend="Varighet på varsel:">
                                <Radio
                                    label="30 dager"
                                    className="SavedSearchModal__body__duration"
                                    name="duration"
                                    key="30dager"
                                    value="30"
                                    onChange={this.onDurationChange}
                                    checked={formData.duration === 30}
                                />
                                <Radio
                                    label="60 dager"
                                    className="SavedSearchModal__body__duration"
                                    name="duration"
                                    key="60dager"
                                    value="60"
                                    onChange={this.onDurationChange}
                                    checked={formData.duration === 60}
                                />
                                <Radio
                                    label="90 dager"
                                    className="SavedSearchModal__body__duration"
                                    name="duration"
                                    key="90dager"
                                    value="90"
                                    onChange={this.onDurationChange}
                                    checked={formData.duration === 90}
                                />
                            </Fieldset>
                        </SkjemaGruppe>
                        {this.emailNotSet() && (
                            <AlertStripe className="blokk-s" type="info" solid>
                                <b>Du har ikke registrert e-postadresse</b> <br />
                                For å motta varsler på e-post må du registrere e-postadressen din.
                            </AlertStripe>
                        )}
                        {this.emailNotSet() && (
                            <Input
                                label="Skriv inn e-postadressen din"
                                value={this.props.emailInputValue || ''}
                                onChange={this.onEmailChange}
                                onBlur={this.onEmailBlur}
                                feil={validation.email ? {
                                    feilmelding: validation.email
                                } : undefined}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

AddOrReplaceForm.defaultProps = {
    formData: undefined,
    user: undefined
};

AddOrReplaceForm.propTypes = {
    user: PropTypes.shape({
        email: PropTypes.string
    }),
    setTitle: PropTypes.func.isRequired,
    setNotifyType: PropTypes.func.isRequired,
    setDuration: PropTypes.func.isRequired,
    setEmailInputValue: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    setShowRegisterEmail: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        title: PropTypes.string
    }),
    validation: PropTypes.shape({
        title: PropTypes.string,
        email: PropTypes.string
    }).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user.user,
    formData: state.savedSearchForm.formData,
    validation: state.savedSearchForm.validation,
    showRegisterEmail: state.savedSearchForm.showRegisterEmail,
    emailInputValue: state.savedSearchForm.emailInputValue
});

const mapDispatchToProps = (dispatch) => ({
    setTitle: (title) => dispatch({ type: SET_SAVED_SEARCH_TITLE, title }),
    setNotifyType: (notifyType) => dispatch({ type: SET_SAVED_SEARCH_NOTIFY_TYPE, notifyType }),
    setDuration: (duration) => dispatch({ type: SET_SAVED_SEARCH_DURATION, duration }),
    setEmailInputValue: (email) => dispatch({ type: SET_EMAIL_INPUT_VALUE, email }),
    validateEmail: () => dispatch({ type: VALIDATE_EMAIL }),
    setShowRegisterEmail: (showRegisterEmail) => dispatch({ type: SET_SHOW_REGISTER_EMAIL, showRegisterEmail })
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AddOrReplaceForm);
