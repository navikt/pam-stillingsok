import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox } from 'nav-frontend-skjema';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { Container } from 'nav-frontend-grid';
import { CREATE_USER } from './userReducer';
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

    render() {
        return (
            <Container>
                <Panel className="TermsOfUse">
                    <Undertittel className="TermsOfUse__title">Du er i ferd med å bruke en innlogget tjeneste</Undertittel>
                    <Normaltekst className="TermsOfUse__text">
                        For å gå videre må du samtykke til at vi får lov til å innhente og behandle persondata
                        om deg.
                    </Normaltekst>
                    <Checkbox
                        label="Ja, jeg samtykker"
                        checked={this.state.checked}
                        onChange={this.onCheckboxChange}
                        className="TermsOfUse__checkbox"
                    />
                    <div>
                        {this.state.checked ?
                            <Link
                                disabled={!this.state.checked}
                                to="/"
                                onClick={this.onAcceptTerms}
                                className="lenke typo-normal"
                            >
                                Fortsett til stillingssøket
                            </Link> :
                            <Link
                                className="lenke typo-normal"
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
    createUser: PropTypes.func.isRequired
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
    createUser: (terms) => dispatch({ type: CREATE_USER, terms })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
