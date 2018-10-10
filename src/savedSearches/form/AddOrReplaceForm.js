import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import {
    SET_SAVED_SEARCH_DURATION,
    SET_SAVED_SEARCH_NOTIFY_TYPE,
    SET_SAVED_SEARCH_TITLE
} from './savedSearchFormReducer';
import './SavedSearchForm.less';

class AddOrReplaceForm extends React.Component {
    onTitleChange = (e) => {
        this.props.setTitle(e.target.value);
    };

    onSubscribeChange = (e) => {
        if (e.target.checked) {
            this.props.setNotifyType(NotifyTypeEnum.EMAIL);
        } else {
            this.props.setNotifyType(NotifyTypeEnum.NONE);
        }
    };

    onDurationChange = (e) => {
        this.props.setDuration(e.target.value);
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
                    feil={validation.title ? { feilmelding: validation.title }  : undefined}
                />
                <Checkbox
                    className="SavedSearchModal__body__notify"
                    label="Ja, jeg ønsker å motta varsler om nye treff på e-post"
                    onChange={this.onSubscribeChange}
                    checked={formData.notifyType === NotifyTypeEnum.EMAIL}
                />
                {formData.notifyType === NotifyTypeEnum.EMAIL && (
                    <SkjemaGruppe>
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
                )}
            </div>
        );
    }
}

AddOrReplaceForm.defaultProps = {
    formData: undefined
};

AddOrReplaceForm.propTypes = {
    setTitle: PropTypes.func.isRequired,
    setNotifyType: PropTypes.func.isRequired,
    setDuration: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        title: PropTypes.string
    }),
    validation: PropTypes.shape({
        titleIsValid: PropTypes.bool
    }).isRequired
};

const mapStateToProps = (state) => ({
    formData: state.savedSearchForm.formData,
    validation: state.savedSearchForm.validation
});

const mapDispatchToProps = (dispatch) => ({
    setTitle: (title) => dispatch({ type: SET_SAVED_SEARCH_TITLE, title }),
    setNotifyType: (notifyType) => dispatch({ type: SET_SAVED_SEARCH_NOTIFY_TYPE, notifyType }),
    setDuration: (duration) => dispatch({ type: SET_SAVED_SEARCH_DURATION, duration })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddOrReplaceForm);
