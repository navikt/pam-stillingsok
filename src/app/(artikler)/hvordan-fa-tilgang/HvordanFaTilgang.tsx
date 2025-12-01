import { BodyLong, CopyButton, Heading, Link as AkselLink } from "@navikt/ds-react";
import NextLink from "next/link";
import React from "react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};
export default function HvordanFaTilgang({ meta }: Props) {
    return (
        <ArticleWrapper title={meta.title} lang={meta.language}>
            <ol>
                <li>
                    <BodyLong className="mb-2">
                        Finn ut kven som kan gi deg tilgang. Du kan starta med å spørja leiaren din. Tilgangen til
                        arbeidsplassen.no sine rekrutteringstenester blir handtert av arbeidsgivarar sjølv i Altinn. Det
                        kan vera nokon i HR, leier, mellomleiar eller nokon på eigarsida i bedrifta di som kan gi deg
                        tilgang.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Kopier lenkja til denne guiden og del med personen som skal gi deg tilgang.
                    </BodyLong>
                </li>
            </ol>

            <CopyButton
                copyText="https://arbeidsplassen.nav.no/hvordan-fa-tilgang"
                text="Kopier lenkja til denne sida"
                activeText="Lenke kopiert"
                variant="action"
                className="mb-12"
            />

            <Heading level="2" size="large" spacing>
                Personen som skal gi deg tilgang må anten vera
            </Heading>

            <ul className="mb-12">
                <li>
                    <BodyLong className="mb-2">
                        registrert i Einingsregisteret som dagleg leiar, leiaren, styrande reira eller innehavaren til
                        styret
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">registert som hovudadministrator i Altinn eller</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        registert med Altinn-rolle som "Tilgangsstyrar" + anten «Stillingsannonsar på
                        arbeidsplassen.no», "Lønn og personalmedarbeidar" eller "Utfyller/innsendar".
                    </BodyLong>
                </li>
            </ul>

            <Heading level="2" size="large" spacing>
                Kva må personen som skal gi deg tilgang gjera?
            </Heading>

            <BodyLong>
                Personen som skal gi tilgang må logga inn i Altinn og følgja ein enkel trinn-for-trinn guide.
            </BodyLong>

            <ol>
                <li>
                    <BodyLong className="mb-2">Vel verksemda di under "Alle aktørane dine"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Trykk på knappen "Profil" øvst i menyen</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Trykk på "Andre med rettar til verksemda"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Vel "Legge til ny person eller verksemd"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Legg inn personnummeret og etternamnet til personen som skal ha tilgang
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Vel "Gi tilgang til enkelttenester"</BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        Skriv «Stillingsannonsar på arbeidsplassen.no», så vil alternativet komma opp som eit val. Vel
                        «Stillingsannonsar på arbeidsplassen.no». Denne tilgangen gir berre høve til å bruka
                        arbeidsplassen.no sine rekrutteringstenester og ingenting anna.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">Bekreft</BodyLong>
                </li>
            </ol>

            <AkselLink as={NextLink} href="/arbeidsgivertjenester">
                Les meir om tilgangsstyring i verksemder og finn skjermbilete her
            </AkselLink>
        </ArticleWrapper>
    );
}
