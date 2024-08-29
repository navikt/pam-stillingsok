import { BodyLong, Heading } from "@navikt/ds-react";

export default function OmArbeidsplassen() {
    return (
        <article className="container-small mt-5 mb-24">
            <Heading size="xlarge" level="1" spacing>
                Om arbeidsplassen.no
            </Heading>
            <BodyLong spacing>
                Arbeidsplassen.no er en åpen møteplass for alle på arbeidsmarkedet. Vårt mål er at arbeidsmarkedet skal
                være så oversiktlig som mulig for alle, enten du er på jakt etter en jobb eller leter etter en kandidat.
            </BodyLong>
            <BodyLong spacing>
                Alle jobbsøkere, arbeidsgivere, vikar- og bemanningsbyråer og andre stillingsaktører er velkommen til
                arbeidsplassen.no. Hensikten er at jobbsøkere på jakt etter jobb, og bedrifter på jakt etter kandidater
                skal kunne oppdage og komme i kontakt med hverandre, så enkelt som mulig. Alle tjenestene er derfor
                kostnadsfrie.
            </BodyLong>
            <BodyLong className="mb-12">Arbeidsplassen.no er eid av NAV.</BodyLong>

            <Heading size="large" level="2" spacing>
                Arbeidsplassen.no gir deg god oversikt over arbeidsmarkedet
            </Heading>
            <BodyLong spacing>
                På arbeidsplassen.no kan jobbsøkere utføre søk og finne stillingsannonser som opprinnelig er publisert i
                ulike portaler. Dette kan vi gjøre fordi vi har et utstrakt samarbeid med store og små stillingsaktører.
            </BodyLong>
            <BodyLong spacing>
                Arbeidsgivere kan også velge å logge seg på arbeidsplassen.no og lyse ut direkte på arbeidsplassen.no.
            </BodyLong>
            <BodyLong className="mb-12">
                Arbeidsplassen.no gir deg dermed en av Norges største oversikter over utlyste stillinger.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Arbeidsplassen.no er selvbetjent
            </Heading>
            <BodyLong spacing>
                Vi har utviklet en moderne digital infrastruktur med selvbetjening og brukervennlighet som viktigste
                prinsipp. Tjenesten er i kontinuerlig forbedring og utvikling.
            </BodyLong>
            <BodyLong className="mb-12">
                Den virkelige verdien i arbeidsplassen.no er det jobbsøkerne og arbeidsgiverne som skaper hver dag.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Tjenestene på arbeidsplassen.no er kostnadsfrie
            </Heading>
            <BodyLong spacing>
                Rekruttering oppleves vanligvis som kostbart og tidkrevende, spesielt for små og mellomstore bedrifter.
                Vi vet at en del arbeidsgivere av den grunn velger å ikke lyse ut sine stillinger offentlig. Vi ønsker
                at alle jobbsøkere skal kunne finne jobbene som finnes på arbeidsmarkedet, uten å være begrenset av eget
                nettverk.
            </BodyLong>
            <BodyLong className="mb-12">
                Arbeidsplassen.no er en tjeneste for å bedre alles muligheter til å gjøre seg synlig på arbeidsmarkedet.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Arbeidsplassen.no er sikker
            </Heading>
            <BodyLong spacing>Tilgang til tjenestene styres gjennom Altinn og ID-porten.</BodyLong>
            <BodyLong>Velkommen til arbeidsplassen.no!</BodyLong>
        </article>
    );
}
