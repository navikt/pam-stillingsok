import { BodyLong, Heading, Link, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function Arbeidsgivertjenester({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="large" level="2" spacing>
                Tilgang via Altinn
            </Heading>
            <List className="mb-6">
                <ListItem>
                    Bare du som er arbeidsgiver kan bruke arbeidsgivertjenester fra Nav på arbeidsplassen.no.
                    Privatpersoner kan ikke bruke tjenestene, heller ikke privatpersoner som er oppdragsgiver uten å
                    være arbeidsgiver.
                </ListItem>
                <ListItem>
                    Bedriften må være registrert i Arbeidsgiver- og arbeidstakerregisteret for en underenhet. Underenhet
                    vil si en operativ enhet som kan ansette og lønne personer.
                </ListItem>
                <ListItem>
                    Du logger inn med ID-porten. Systemet vil sjekke rettighetene dine i Altinn. For at du eller en
                    kollega skal kunne bruke Navs nye rekrutteringstjeneste på vegne av virksomheten, må dere ha
                    enkelttjenesten «Stillingsannonser på arbeidsplassen.no» for underenheten. Du kan sjekke om du har
                    riktig tilgang ved å prøve å logge deg inn i tjenesten som arbeidsgiver.
                </ListItem>
                <ListItem>
                    Arbeidsgiver kan delegere tilgang til deg via Altinn, dersom du ikke allerede har den. Har du
                    tilgangspakken «Ansettelsesforhold» for underenhet, vil du automatisk ha enkelttjenesten
                    «Stillingsannonser på arbeidsplassen.no» på vegne av bedriften.
                </ListItem>
            </List>
            <Heading size="medium" level="3" spacing>
                Mer hjelp
            </Heading>
            <List className="mb-12">
                <ListItem>
                    <AkselNextLink href="/tilgang-som-arbeidsgiver">
                        Hvordan få og gi tilgang som arbeidsgiver
                    </AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="/tilgangsstyring-i-store-virksomheter">
                        Tilgangsstyring i store virksomheter
                    </AkselNextLink>
                </ListItem>
            </List>
            <Heading size="large" level="2" spacing>
                Utenlandske virksomheter
            </Heading>
            <BodyLong spacing>
                Det er bare <strong>norske virksomheter som kan bruke innloggede tjenester </strong> på
                arbeidsplassen.no.
            </BodyLong>
            <BodyLong className="mb-12">
                Hvis du er en utenlandsk virksomhet som ønsker hjelp til å rekruttere medarbeidere fra Norge, publisere
                en stilling i Den europeiske jobbmobilitetsportalen eller i et enkelt EU/EØS-land eller Sveits, skal du
                ta kontakt med den offentlige arbeidsformidlingen (EURES) i hjemlandet ditt. Les mer om{" "}
                <Link inlineText href="https://eures.europa.eu/employers/advertise-job-0_en">
                    EURES-tjenesten
                </Link>{" "}
                i de ulike landene.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Rekruttere fra EU/EØS og Sveits
            </Heading>
            <BodyLong spacing>
                Hvis du ønsker å rekruttere fra EU/EØS og Sveits, kan du søke etter kandidater i Den europeiske
                jobbmobilitetsportalen.
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål om publisering av stilling i{" "}
                <Link inlineText href="https://eures.europa.eu/index_en">
                    Den Europeiske Jobbmobilitetsportalen
                </Link>{" "}
                eller i et enkelt EU/EØS-land, kan du ta kontakt med Nav Kontaktsenter EURES på{" "}
                <Link href="mailto:eures@nav.no">eures@nav.no</Link>. Les mer om{" "}
                <Link inlineText href="https://www.nav.no/arbeidsgiver/rekruttere-eu-eos">
                    Navs EURES-tjenester for arbeidsgivere.
                </Link>
            </BodyLong>
            <hr />
            <BodyLong size="small">
                * Unntaket er at du som privatperson kan annonsere en stilling som brukerstyrt personlig assistent. Hvis
                du foretrekker det, kan du publisere den selv i stedet for at arbeidsgiveren din gjør det. Send
                annonseteksten til <Link href="mailto:stilling@nav.no">stilling@nav.no</Link>. I annonsen må du oppgi om
                det er en fast stilling eller et vikariat, antall arbeidstimer i uka, arbeidstid, arbeidssted, antall
                stillinger og søknadsfrist. Du må også oppgi navn og e-postadresse til en kontaktperson.
            </BodyLong>
        </ArticleWrapper>
    );
}
