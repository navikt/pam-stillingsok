import { BodyLong, Heading, Link } from "@navikt/ds-react";

export default function Kontakt() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading spacing size="xlarge" level="1">
                Kontakt oss
            </Heading>

            <Heading size="medium" level="2" spacing>
                Jobbsøker
            </Heading>
            <ul className="mb-4">
                <li>
                    <BodyLong>
                        Se vår{" "}
                        <Link href="https://www.nav.no/brukerstotte">teknisk brukerstøtteside for privatpersoner</Link>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Får du oppfølging fra Nav? Du kan{" "}
                        <Link href="https://www.nav.no/person/kontakt-oss/">kontakte Nav på telefon.</Link>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="medium" level="2" spacing>
                Arbeidsgiver
            </Heading>
            <ul>
                <li>
                    <BodyLong>
                        Se vår{" "}
                        <Link href="https://www.nav.no/arbeidsgiver/brukerstotte">
                            teknisk brukerstøtteside for bedrifter
                        </Link>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Arbeidsgivertelefonen i Nav tlf. 55 55 33 36. Hverdager 0900–1500. Svarer på spørsmål om
                        rekruttering, sykefraværsoppfølging, refusjoner, permittering og omstilling m.m.
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        <Link href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav om rekruttering</Link>
                    </BodyLong>
                </li>
            </ul>
        </article>
    );
}
