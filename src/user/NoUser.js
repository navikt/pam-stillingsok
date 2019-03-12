import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './NoUser.less';
import { PrimaryButton } from '../common/button';

const NoUser = withRouter(({ history }) => {
    const onCreateUserClick = () => {
        history.push('/stillinger/samtykke');
    };

    return (
        <div className="NoUser">
            <Undertittel className="NoUser__title">
                Du har ikke samtykket til å bruke tjenesten
            </Undertittel>
            <Normaltekst className="NoUser__text">
                Du må samtykke for å kunne lagre søk og favoritter.
            </Normaltekst>
            <PrimaryButton
                className="NoUser__button"
                onClick={onCreateUserClick}
            >
                Se samtykke
            </PrimaryButton>
            <Link to="/" className="lenke typo-normal">
                Fortsett uten å samtykke
            </Link>
        </div>
    );
});

export default NoUser;
