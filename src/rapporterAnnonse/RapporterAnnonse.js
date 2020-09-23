import * as React from 'react';
import Container from "nav-frontend-grid/lib/container";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import "./RapporterAnnonse.less";
import Checkbox from "nav-frontend-skjema/lib/checkbox";
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Hovedknapp} from 'pam-frontend-knapper';
import {AD_USER_API, CONTEXT_PATH} from "../fasitProperties";
import Chevron from "nav-frontend-chevron";
import {Link} from "react-router-dom";
import {userApiPost} from "../api/userApi";
import AlertStripeFeil from "nav-frontend-alertstriper/lib/feil-alertstripe";
import {authenticationEnum} from "../authentication/authenticationReducer";
import NotAuthenticated from "../authentication/NotAuthenticated";

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
    const isAuthenticated = useSelector(state => state.authentication.isAuthenticated);
    const [error, setError] = useState(false);
    const [finished, setFinished] = useState(false);
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

    const onSendTip = async () => {
        const category = violation ? "Regelbrudd" : "Mistanke om svindel";
        const subCategory = violation ? violationCategories.filter(c => c.key === violationCategory)[0].label :
            scamCategories.filter(c => c.key === scamCategory)[0].label;

        try {
            const response = await userApiPost(`${AD_USER_API}/api/v1/reportposting`, {
                category: category,
                subCategory: subCategory,
                title: "En stilling har blitt rapportert for " + category.toLowerCase(),
                link: `${location.origin}/stillinger/stilling/${stillingId}`,
            }, false);

            if (response.statusCode === 200) {
                setFinished(true);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        }
    }

    return (
        <Container className="RapporterAnnonse">
            {error && (
                <AlertStripeFeil className="alertstripe--solid infoboks">Rapportering feilet - prøv igjen</AlertStripeFeil>
            )}

            <br/>
            <Link
                to={CONTEXT_PATH + "/stilling/" + stillingId}
                className="BackLink no-print"
            >
                <Chevron type="venstre" className="BackLink__chevron"/>
                <span className="BackLink__label">
                    Tilbake til annonsen
                </span>
            </Link>

            {isAuthenticated !== authenticationEnum.IS_AUTHENTICATED && (
                <NotAuthenticated title="Du må være innlogget for å rapportere en annonse" />
            )}

            {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                <div>
                    {finished && (
                        <div>
                            <Sidetittel>Takk for din tilbakemelding</Sidetittel>

                            <div className="report-form">
                                <p>Takk for at du tok deg tid til rapportere denne annonsen.</p>
                                <br/>
                                <p>Har du spørsmål kan du <a href={CONTEXT_PATH + "/kontakt"}>kontakte NAV.</a></p>
                                <br/>
                                <p>Med vennlig hilsen,<br/>Arbeidsplassen</p>
                            </div>

                            <div className="shape-container">
                                <div className="diamond"/>
                                <div className="circle"/>
                            </div>
                        </div>
                    )}
                    {!finished && (
                        <div>
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

                                <Checkbox label="Mistanke om svindel" name="svindel" onChange={onScamCheck}
                                          checked={scam === true}/>

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

                            {isAuthenticated === authenticationEnum.IS_AUTHENTICATED && (
                                <Hovedknapp disabled={violationCategory === null && scamCategory === null} onClick={onSendTip}>
                                    Send tips
                                </Hovedknapp>
                            )}
                        </div>
                    )}

                    <p className="disclaimer">
                        Stillingsannonser blir som regel umiddelbart publisert på Arbeidsplassen.no.
                        Etter publisering vil alle annonser bli kontrollert etter NAVs retningslinjer.
                        I tilfeller der det er brudd på retningslinjene vil disse bli avpublisert.
                    </p>
                </div>
            )}
        </Container>
    )
};

export default RapporterAnnonse;
