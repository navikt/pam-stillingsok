"use client";

import React, { useState } from "react";
import { BodyLong, Button, Checkbox, CheckboxGroup, Heading, HStack, Select, TextField } from "@navikt/ds-react";
import Figure from "@/app/tilbakemelding-nye-filtre/_components/Figure";
import Success from "@/app/tilbakemelding-nye-filtre/_components/Success";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

function NewFiltersSurvey() {
    const [answers, setAnswers] = useState({
        "Answer: Published": "",
        "Answer: Education": "",
        "Answer: Drivers license": "",
        "Answer: Age": "",
        "Answer: Experience": "",
        "Answer: Distance": "",
        "Answer: Leader position": "",
    });

    const [hasSubmitted, setHasSubmitted] = useState(false);

    const submitFeedback = () => {
        setHasSubmitted(true);
        logAmplitudeEvent("Survey: New filters", answers);
    };

    if (hasSubmitted) {
        return <Success />;
    }

    // test

    return (
        <section className="mt-10 mb-24">
            <div className="container-medium text-center">
                <Heading size="xlarge" level="1" className="mb-10">
                    Hva tenker du om våre nye filterforslag?
                </Heading>
                <Figure />
                <BodyLong size="large" spacing className="mt-6">
                    Din tilbakemelding hjelper oss å gjøre det enklere for deg som ser etter ny jobb. Vi utforsker nye
                    filtermuligheter og vil gjerne høre dine tanker.
                </BodyLong>
            </div>

            <div className="container-small">
                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Dato for publisering av annonse
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Nye i dag</Checkbox>
                    <Checkbox>Nye siste tre døgn</Checkbox>
                    <Checkbox>Nye siste uka</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Published"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Published": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Krav til utdanning
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Ingen krav til utdanning</Checkbox>
                    <Checkbox>Videregående skole</Checkbox>
                    <Checkbox>Fagskole</Checkbox>
                    <Checkbox>Bachelor</Checkbox>
                    <Checkbox>Master eller tilsvarende</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Education"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Education": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Førerkort
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Ingen krav til førerkort</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Drivers license"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Drivers license": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Alder
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Trenger ikke være over 18 år</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Age"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Age": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Arbeidserfaring
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Ingen krav til arbeidserfaring</Checkbox>
                    <Checkbox>Noe arbeidserfaring (1-3 år)</Checkbox>
                    <Checkbox>Mye arbeidserfaring (4+ år)</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Experience"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Experience": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <Heading level="2" size="medium" spacing>
                    Filtrer jobber på avstand
                </Heading>
                <TextField
                    label="Sted eller postnummer"
                    description="Fra hvor skal avstanden beregnes?"
                    value="Ålesund, Møre og Romsdal"
                    className="mb-4"
                    onChange={() => {}}
                />
                <TextField
                    label="Avstand i kilometer"
                    description="Hva er avstanden du vil begrense deg til?"
                    value="45"
                    className="mb-8"
                    htmlSize="10"
                    onChange={() => {}}
                />

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Distance"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Distance": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <CheckboxGroup
                    legend={
                        <Heading level="2" size="medium">
                            Lederrolle
                        </Heading>
                    }
                    className="mb-4"
                >
                    <Checkbox>Direktør</Checkbox>
                    <Checkbox>Fagleder</Checkbox>
                    <Checkbox>Leder</Checkbox>
                </CheckboxGroup>

                <Select
                    label="Hvor misfornøyd ville du blitt om vi ikke lanserer dette filteret?"
                    style={{ width: "170px" }}
                    className="mb-12"
                    value={answers["Answer: Leader position"]}
                    onChange={(e) => {
                        setAnswers((prevState) => ({ ...prevState, "Answer: Leader position": e.target.value }));
                    }}
                >
                    <option value="">Velg verdi</option>
                    <option value="Ikke misfornøyd">Ikke misfornøyd</option>
                    <option value="Noe misfornøyd">Noe misfornøyd</option>
                    <option value="Svært misfornøyd">Svært misfornøyd</option>
                </Select>

                <HStack justify="center">
                    <Button variant="primary" onClick={submitFeedback}>
                        Send inn tilbakemeldingen din
                    </Button>
                </HStack>
            </div>
        </section>
    );
}

export default NewFiltersSurvey;
