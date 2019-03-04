import PropTypes from 'prop-types';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import './NotAuthenticated.less';
import Button from '../common/button/Button';
import { LOGIN_URL } from '../fasitProperties';
import { getRedirect } from '../redirect';

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
                    <Button type="primary" onClick={this.onLoginClick}>Logg inn</Button>
                    {this.props.onCancel && (
                        <Button type="flat" onClick={this.props.onCancel}>
                            Avbryt
                        </Button>
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
