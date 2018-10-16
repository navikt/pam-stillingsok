import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox } from 'nav-frontend-skjema';
import { Panel } from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Container } from 'nav-frontend-grid';
import { DECLINE_TERMS_OF_USE, CREATE_USER } from './authorizationReducer';
import { LOGOUT_URL } from '../fasitProperties';
import './Authorization.less';

class TermsOfUse extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false };
        this.version = 'sok_v1';
    }

    onCheckboxChange = () => {
        this.setState({ checked: !this.state.checked });
    };

    onAcceptTerms = () => {
        this.props.createUser(this.version);
    };

    onDeclineTerms = () => {
        this.props.declineTerms();
    };

    render() {
        return (
            <Container>
                <Panel className="TermsOfUse blokk-s">
                    <Element className="blokk-xs">Du er i ferd med å bruke en innlogget tjeneste.</Element>
                    <Normaltekst className="blokk-s">
                        For å gå videre må du samtykke til at vi får lov til å innhente og behandle persondata
                        om deg.
                    </Normaltekst>
                    <Checkbox
                        label="Ja, jeg samtykker"
                        checked={this.state.checked}
                        onChange={this.onCheckboxChange}
                        className="blokk-l"
                    />
                    <div>
                        {this.state.checked ?
                            <Link
                                disabled={!this.state.checked}
                                to="/"
                                onClick={this.onAcceptTerms}
                                className="lenke"
                            >
                                Fortsett til stillingssøket
                            </Link> :
                            <Link
                                className="lenke"
                                onClick={this.onDeclineTerms}
                                to={LOGOUT_URL}
                            >
                                Avbryt og logg ut
                            </Link>
                        }
                    </div>

                </Panel>
            </Container>
        );
    }
}

TermsOfUse.propTypes = {
    declineTerms: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
    declineTerms: () => dispatch({ type: DECLINE_TERMS_OF_USE }),
    createUser: (terms) => dispatch({ type: CREATE_USER, terms })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
