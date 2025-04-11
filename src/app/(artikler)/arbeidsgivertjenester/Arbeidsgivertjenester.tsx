import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import NextLink from "next/link";

export default function Arbeidsgivertjenester() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading spacing size="xlarge" level="1">
                Hvem kan bruke arbeidsgivertjenestene?
            </Heading>

            <Heading size="large" level="2" spacing>
                Tilgang via Altinn
            </Heading>
            <BodyLong spacing>
                Bare du som er arbeidsgiver kan bruke arbeidsgivertjenester fra Nav på arbeidsplassen.no. Privatpersoner
                kan ikke bruke tjenestene, heller ikke privatpersoner som er oppdragsgiver uten å være arbeidsgiver.*
            </BodyLong>
            <BodyLong spacing>
                Bedriften må være registrert i Arbeidsgiver- og arbeidstakerregisteret for underenhet. Underenhet vil si
                en operativ enhet som kan ansette og lønne personer.
            </BodyLong>
            <BodyLong spacing>
                Du logger inn med ID-porten. Systemet vil sjekke dine rettigheter i Altinn. For at du eller en kollega
                skal kunne benytte Navs nye rekrutteringstjeneste på vegne av virksomheten, må dere ha rettigheten
                «Rekruttering» for underenhet.{" "}
                <strong>
                    Du kan sjekke om du har riktig rettighet ved å prøve å logge deg inn i tjenesten som arbeidsgiver.
                </strong>
            </BodyLong>
            <BodyLong spacing>
                Arbeidsgiveren kan delegere tilgang til deg via Altinn, hvis du ikke har den allerede. Har du en av
                Altinn-rollene «Lønn og personalmedarbeider» eller «Utfyller/innsender» for underenhet, vil du
                automatisk ha rettigheten «Rekruttering» på vegne av bedriften.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Mer hjelp
            </Heading>
            <ul className="mb-12">
                <li>
                    <BodyLong className="mb-2">
                        <AkselLink as={NextLink} href="/tilgang-som-arbeidsgiver">
                            Hvordan få og gi tilgang som arbeidsgiver
                        </AkselLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong className="mb-2">
                        <AkselLink as={NextLink} href="/tilgangsstyring-i-store-virksomheter">
                            Tilgangsstyring i store virksomheter
                        </AkselLink>
                    </BodyLong>
                </li>
            </ul>

            <Heading size="large" level="2" spacing>
                Utenlandske virksomheter
            </Heading>
            <BodyLong spacing>
                Det er kun <strong>norske virksomheter som kan bruke innloggede tjenester</strong> på arbeidsplassen.no.
            </BodyLong>
            <BodyLong className="mb-12">
                Hvis du er en utenlandsk virksomhet som ønsker hjelp til å rekruttere medarbeidere fra Norge, publisere
                en stilling i Den Europeiske Jobbmobilitetsportalen eller i et enkelt EU/EØS-land eller Sveits, skal du
                ta kontakt med den offentlige arbeidsformidlingen (EURES) i hjemlandet ditt. Les mer om{" "}
                <AkselLink href="https://eures.europa.eu/employers/advertise-job_en">EURES-tjenesten</AkselLink> i de
                ulike landene.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Rekruttere fra EU/EØS og Sveits
            </Heading>
            <BodyLong spacing>
                Hvis du ønsker å rekruttere fra EU/EØS og Sveits, kan du søke etter kandidater i Den Europeiske
                Jobbmobilitetsportalen.
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål om publisering av stilling i{" "}
                <AkselLink href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</AkselLink>{" "}
                eller i et enkelt EU/EØS-land, ta kontakt med Nav Kontaktsenter EURES på{" "}
                <AkselLink href="mailto:eures@nav.no">eures@nav.no</AkselLink>. Les mer om{" "}
                <AkselLink href="https://www.nav.no/arbeidsgiver/rekruttere-eu-eos">
                    Navs EURES-tjenester for arbeidsgivere.
                </AkselLink>
            </BodyLong>
            <hr />
            <BodyLong size="small">
                * Unntaket er at du som privatperson kan annonsere en stilling som brukerstyrt personlig assistent. Hvis
                du foretrekker det, kan du publisere den selv i stedet for at din arbeidsgiver gjør det. Send
                annonseteksten til stilling@nav.no. I annonsen må du oppgi om det er en fast stilling eller et vikariat,
                antall arbeidstimer i uken, arbeidstid, arbeidsted, antall stillinger og søknadsfrist. Du må også oppgi
                navn og e-postadresse til en kontaktperson.
            </BodyLong>
        </article>
    );
}
