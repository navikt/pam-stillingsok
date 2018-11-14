import { Column, Container, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import PageHeader from '../common/pageHeader/PageHeader';
import './UserSettings.less';
import { CONTEXT_PATH } from '../fasitProperties';

const PAGE_TITLE = 'Vilkår';

export default class ViewTermsOfUse extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        document.title = PAGE_TITLE;
    }

    render() {
        return (
            <div className="UserSettings">
                <PageHeader
                    backUrl={`${CONTEXT_PATH}/minside`}
                    title={PAGE_TITLE}
                    backLabel="Tilbake til Min side"
                />
                <Container>
                    <div className="UserSettings__main">
                        <div className="UserSettings__section">
                            <Row>
                                <Column xs="12">
                                    <Undertittel className="TermsOfUse__title">
                                        Vilkår for å bruke innloggede tjenester
                                    </Undertittel>
                                    <Normaltekst className="TermsOfUse__text">
                                        Du må samtykke for å bruke innloggede tjenester i stillingssøk. Hvis du gjør et
                                        søk og vil lagre søkekriteriene under Lagrede søk, trenger vi en e-postadresse
                                        som du vil motta stillingsannonser på. E-postadressen blir bare brukt til dette
                                        formålet. Hvis du bare vil lagre en stilling som favoritt, behøver du ikke
                                        registrere e-postadressen din.
                                    </Normaltekst>
                                    <Normaltekst className="TermsOfUse__notes">
                                        Du kan trekke samtykket ditt når som helst hvis du ikke lenger ønsker å
                                        bruke innloggede tjenester i stillingssøket. Vilkårene og mulighet for å
                                        trekke samtykket finner du igjen i Min side.
                                        <br />E-posten benyttes bare til å varsle deg når nye stillinger dukker opp.
                                        Du kan senere velge å skru av e-postvarsling under lagrede søk eller
                                        slette e-postadressen på Min side.
                                    </Normaltekst>
                                </Column>
                            </Row>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

