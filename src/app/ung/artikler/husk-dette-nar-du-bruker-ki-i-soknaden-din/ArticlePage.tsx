import { BodyLong, Heading } from "@navikt/ds-react";
import { List, ListItem } from "@navikt/ds-react/List";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};
export default function ArticlePage({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong spacing>
                Mange bruker kunstig intelligens (KI) når de skal søke jobb, for eksempel Copilot og ChatGPT. Det kan
                være nyttig, men vi må som alltid bruke KI på en bevisst og kritisk måte.
            </BodyLong>

            <BodyLong className="mb-6">Du kan blant annet bruke KI til å:</BodyLong>
            <List className="mb-8">
                <ListItem>komme i gang når du står fast</ListItem>
                <ListItem>skrive klart og tydelig</ListItem>
                <ListItem>gjøre søknadsteksten ryddigere og lettere å lese</ListItem>
                <ListItem>tilpasse teksten til stillingsannonsen</ListItem>
                <ListItem>gi kritiske tilbakemeldinger til søknaden</ListItem>
            </List>

            <ArticleBleedImage
                src="/images/ki-soknad-ung.jpg"
                alt="En person som ligger i parken med datamaskinen foran seg"
            />
            <Heading size="large" level="2" spacing>
                Vær deg selv
            </Heading>

            <BodyLong spacing>
                Men KI kan ikke vite hvem du er. KI kan aldri vite hva som gjør deg til deg, eller hva som gjør deg
                unik. Derfor må du alltid gå gjennom teksten selv og sørge for at den er riktig. KI kan også ta feil.
                Den kan finne på erfaringer, ferdigheter eller formuleringer som ikke passer for deg. Spør deg selv:
            </BodyLong>
            <List className="mb-6">
                <ListItem>Er dette sant om meg?</ListItem>
                <ListItem>Passer dette til stillingen?</ListItem>
                <ListItem>Høres dette ut som noe jeg selv ville sagt?</ListItem>
            </List>

            <BodyLong spacing>
                Hvis ikke, skriv om teksten og gjør den din. En god jobbsøknad trenger ikke å være perfekt. Det
                viktigste er at den er ærlig, relevant og viser hvem du er.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Gjør søknaden troverdig
            </Heading>

            <BodyLong spacing>
                Setninger og tekst som KI foreslår, kan noen ganger være litt stive eller &quot;robotaktige&quot;. Det
                er blant annet fordi KI ofte bruker engelske tekster som utgangspunkt for sine svar. Da oversetter den
                direkte fra engelsk, og plutselig dukker det kanskje opp noen litt uvante formuleringer.
            </BodyLong>

            <BodyLong spacing>
                Det kan være vanskelig å legge merke til dette. Les derfor nøye gjennom teksten, og få gjerne hjelp av
                noen andre til å se over.
            </BodyLong>

            <BodyLong className="mb-6">
                Arbeidsgivere merker fort om søknaden din ikke er personlig, og kun er skrevet av KI. Det viktigste er å
                beskrive dine faktiske erfaringer, slik du selv ville gjort:
            </BodyLong>

            <List className="mb-8">
                <ListItem>Hva har du lært?</ListItem>
                <ListItem>Hva har du gjort i skole, fritid, verv eller tidligere jobber?</ListItem>
                <ListItem>Hva motiverer deg for denne jobben?</ListItem>
            </List>

            <BodyLong spacing>
                Du kan bruke KI til å skrive dette klart og tydelig, men innholdet må komme fra deg.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Hvordan skal du få KI til å gjøre det du vil?
            </Heading>

            <BodyLong spacing>
                For at KI skal gjøre det du vil, må du skrive gode instrukser. En instruks, også kalt prompt, er det du
                skriver til KI-en for å fortelle hva den skal gjøre. Jo tydeligere instruks, jo bedre svar.
            </BodyLong>

            <BodyLong className="mb-6">For eksempel:</BodyLong>
            <List className="mb-8">
                <ListItem>
                    &quot;Skriv et forslag til jobbsøknad for butikkjobb. Maks én side. Enkelt språk.&quot;
                </ListItem>
                <ListItem>&quot;Hjelp meg å forbedre CV‑en min. Fokuser på sommerjobb og samarbeid.&quot;</ListItem>
            </List>

            <BodyLong className="mb-6">Du kan også:</BodyLong>
            <List className="mb-8">
                <ListItem>
                    Be KI om å strukturere teksten og forbedre språket, slik at teksten blir ryddig og lett å lese.
                </ListItem>
                <ListItem>Be KI om å foreslå en god start på jobbsøknaden.</ListItem>
                <ListItem>Be om forslag til hvordan du kan beskrive en erfaring du har, eller noe du kan.</ListItem>
                <ListItem>Be KI lese gjennom teksten og komme med kritiske spørsmål til det du har skrevet.</ListItem>
                <ListItem>Be KI om å etterligne stilen til en annen søknad du er fornøyd med.</ListItem>
            </List>

            <Heading size="large" level="2" spacing>
                Ikke del alt med KI
            </Heading>
            <BodyLong spacing>
                Når du legger inn søknadsteksten din eller annen informasjon i for eksempel ChatGPT, har du ikke
                kontroll over hva som skjer videre med teksten din.
            </BodyLong>
            <BodyLong spacing>
                Det du legger inn kan for eksempel bli lagret eller brukt til forbedring av ChatGPT.
            </BodyLong>
            <BodyLong spacing>
                Derfor er det viktig at du ikke legger inn personopplysninger eller andre detaljer du ikke ønsker å dele
                videre. Personopplysninger er informasjon som kan brukes til å kjenne igjen en person. For eksempel
                navn, bilde, fødselsnummer, telefonnummer eller helseopplysninger. Hold deg til det som er nødvendig for
                søknaden.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Arbeidsgiveren vil bli kjent med <i>deg</i>
            </Heading>
            <BodyLong spacing>
                KI kan være et veldig godt verktøy for unge jobbsøkere, så lenge man bruker KI på en smart måte.
            </BodyLong>
            <BodyLong>
                Bruk KI som støtte, inspirasjon og for å komme videre hvis du står fast, men sørg for at søknaden
                fortsatt er din egen. Arbeidsgiveren vil bli kjent med <i>deg</i>, ikke en KI-versjon av deg.
            </BodyLong>
        </ArticleWrapper>
    );
}
