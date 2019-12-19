import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import './CountyMunicipalInfoAlertStripe.less';

export default function CountyMunicipalInfoAlertStripe() {
    return (
        <div>
            <AlertStripe type="info" className="CountyMunicipalInfoAlertStripe blokk-m alertstripe--solid">
                <strong>Fylker og kommuner slås sammen: Sjekk søkene dine</strong>
                <br />
                Har du et søk som inneholder kommuner eller fylker som blir endret?
                Da må du endre søket ditt for at det skal fungere.
                <p>Slik endrer du:</p>
                <ol>
                    <li>Klikk på lenken til stillingssøket du vil endre</li>
                    <li>Velg nye fylker og kommuner</li>
                    <li>Lagre søket</li>
                </ol>
                Du trenger ikke endre hvis kommunene eller fylkene heter det samme fra 1. januar.
            </AlertStripe>
        </div>
    );
}
