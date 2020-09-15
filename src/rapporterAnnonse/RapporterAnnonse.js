import React from "react";
import Container from "nav-frontend-grid/lib/container";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import "./RapporterAnnonse.less";
import Checkbox from "nav-frontend-skjema/lib/checkbox";
import {useState, useEffect} from 'react';
import { Hovedknapp } from 'pam-frontend-knapper';

const violationCategories = [
    {label: "Diskriminerende innhold", key: "discrimination"},
    {label: "Det er markedsføring", key: "marketing"},
]

const scamCategories = [
    {label: "Falsk stillingannonse og arbeidsgiver", key: "fake"},
    {label: "Krever betaling for å søke stilling", key: "payment"},
    {label: "Ber om kredittinfo og/eller BankID", key: "creditInfo"},
]

const RapporterAnnonse = () => {
    const [stillingId, setStillingId] = useState(null);
    const [violation, setViolation] = useState(false);
    const [violationCategory, setViolationCategory] = useState(null);
    const [scam, setScam] = useState(false);
    const [scamCategory, setScamCategory] = useState(null);

    useEffect(() => {
        if (document.location.search.includes('uuid')) {
            setStillingId(document.location.search.split('=')[1]);
        }
    }, []);

    const onViolationCheck = () => {
        setViolation(!violation);
        setScam(false);
        setViolationCategory(null);
        setScamCategory(null);
    }

    const onViolationCategoryCheck = (e) => {
        setViolationCategory(e.target.value);
    }

    const onScamCheck = () => {
        setScam(!scam);
        setViolation(false);
        setViolationCategory(null);
        setScamCategory(null);
    }

    const onScamCategoryCheck = (e) => {
        setScamCategory(e.target.value);
    }

    const onSendTip = () => {
        console.log(stillingId);
    }


    return (
        <Container className="RapporterAnnonse">
            <Sidetittel>Rapporter annonse</Sidetittel>

            <div className="report-form">
                <Undertittel>Henveldensen gjelder</Undertittel>

                <Checkbox name="regelbrudd" label="Regelbrudd" onChange={onViolationCheck}
                          checked={violation === true}/>

                {violation &&
                violationCategories.map(c => {
                    return (
                        <Checkbox
                            className="sub-checkbox"
                            key={c.key}
                            label={c.label}
                            value={c.key}
                            onChange={onViolationCategoryCheck}
                            checked={violationCategory === c.key}
                        />
                    )
                })
                }

                <Checkbox label="Mistanke om svindel" name="svindel" onChange={onScamCheck} checked={scam === true}/>

                {scam &&
                scamCategories.map(c => {
                    return (
                        <Checkbox
                            className="sub-checkbox"
                            key={c.key}
                            label={c.label}
                            value={c.key}
                            onChange={onScamCategoryCheck}
                            checked={scamCategory === c.key}
                        />
                    )
                })
                }

                <br/><br/>

                <a href="https://www.nav.no/no/bedrift/rekruttering/relatert-informasjon/stillingsregistrering">
                    Les om gjeldende regler
                </a>
            </div>

            <Hovedknapp disabled={violationCategory === null && scamCategory === null} onClick={onSendTip}>
                Send tips
            </Hovedknapp>
        </Container>
    )
};

export default RapporterAnnonse;
