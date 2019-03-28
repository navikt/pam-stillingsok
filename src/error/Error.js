import AlertStripe from 'nav-frontend-alertstriper';
import Lukknapp from 'nav-frontend-lukknapp';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Flatknapp } from 'pam-frontend-knapper';
import './Error.less';
import { HIDE_ERROR } from './errorReducer';

class Error extends React.Component {
    onCloseClick = () => {
        this.props.hideError();
    };

    onReloadClick = () => {
        window.location.reload();
    };

    render() {
        const { messages } = this.props;
        return (
            <AlertStripe
                type="advarsel"
                solid
                aria-atomic="true"
                className={`Error StickyAlertStripe${messages.length === 0 ? ' StickyAlertStripe--hidden' : ''}`}
            >
                {messages.length > 1 && (
                    <div className="Error__messages">
                        <b>Det har oppstått {messages.length} feil:</b>
                        {messages.map((message) => (
                            <div>{message}.</div>
                        ))}
                    </div>
                )}
                {messages.length === 1 && (
                    <div className="Error__messages">
                        <b>Det har oppstått en feil:</b> {messages[0]}.
                    </div>
                )}
                {messages.length === 0 && (
                    <div />
                )}
                <Flatknapp
                    className="Error__reload"
                    mini
                    onClick={this.onReloadClick}
                >
                    Last siden på nytt
                </Flatknapp>
                <Lukknapp
                    className="Error__close"
                    hvit
                    onClick={this.onCloseClick}
                >
                    Lukk
                </Lukknapp>
            </AlertStripe>
        );
    }
}

Error.propTypes = {
    hideError: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    messages: state.error.messages
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_ERROR })
});

export default connect(mapStateToProps, mapDispatchToProps)(Error);
