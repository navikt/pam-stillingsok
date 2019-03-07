import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { FlatButton, PrimaryButton } from '../common/button';
import { LOGIN_URL } from '../fasitProperties';
import { getRedirect } from '../redirect';
import './NotAuthenticated.less';

export default class NotAuthenticated extends React.Component {
    onLoginClick = () => {
        window.location.href = `${LOGIN_URL}${getRedirect()}`;
    };

    render() {
        return (
            <div className="NotAuthenticated">
                <Undertittel className="NotAuthenticated__title">
                    {this.props.title}
                </Undertittel>
                <Normaltekst className="NotAuthenticated__message">
                    Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                </Normaltekst>
                <div className="NotAuthenticated__buttons">
                    <PrimaryButton onClick={this.onLoginClick}>Logg inn</PrimaryButton>
                    {this.props.onCancel && (
                        <FlatButton onClick={this.props.onCancel}>
                            Avbryt
                        </FlatButton>
                    )}
                </div>
            </div>
        );
    }
}

NotAuthenticated.defaultProps = {
    title: 'Du må logge inn',
    onCancel: undefined
};

NotAuthenticated.propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func
};
