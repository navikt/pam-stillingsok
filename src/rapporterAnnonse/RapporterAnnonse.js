import React from "react";
import Container from "nav-frontend-grid/lib/container";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";
import {Link} from "react-router-dom";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import "./RapporterAnnonse.less";
import Checkbox from "nav-frontend-skjema/lib/checkbox";
import {useState} from 'react';

const violationCategories = [
    {label: "Diskriminerende innhold", key: "discrimination"},
    {label: "Stillingen er ikke reell", key: "fake"},
    {label: "Det er markedsføring", key: "marketing"},
    {label: "Stillingen krever en form for betaling eller avgift fra søker", key: "scam"},
]

const RapporterAnnonse = () => {
    const [violation, setViolation] = useState(false);
    const [violationCategory, setViolationCategory] = useState(null);

    const onViolationCheck = () => {
        setViolation(!violation);
    }

    const onViolationCategoryCheck = (e) => {
        setViolationCategory(e.target.value);
    }


    return (
        <Container className="RapporterAnnonse">
            <Sidetittel>Rapporter annonse</Sidetittel>

            <div className="report-form">
                <Undertittel>Henveldensen gjelder</Undertittel>

                <Checkbox name="regelbrudd" label="Regelbrudd" onChange={onViolationCheck} checked={violation === true}/>
                <Link to="/">Les om gjeldende regler</Link>

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
            </div>
        </Container>
    )
};

export default RapporterAnnonse;
