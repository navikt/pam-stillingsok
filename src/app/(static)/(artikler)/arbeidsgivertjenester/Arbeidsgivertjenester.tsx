import { BodyLong, Heading, Link, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";
type Props = {
    readonly meta: PageInfo;
};
export default function Arbeidsgivertjenester({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="large" level="2" spacing>
                Tilgang via Altinn
            </Heading>
            <BodyLong spacing>
                Berre du som er arbeidsgivar kan bruke arbeidsgivartenester frå nav på arbeidsplassen.no. Privatpersonar
                kan ikkje bruke tenestene, heller ikkje privatpersonar som er oppdragsgivar utan å vere arbeidsgivar.*
            </BodyLong>
            <BodyLong spacing>
                Bedrifta må vere registrert i Arbeidsgjevar- og arbeidstakarregisteret for undereining. Undereining vil
                seie ei operativ eining som kan tilsetje og lønne personar.
            </BodyLong>
            <BodyLong spacing>
                Du loggar inn med ID-porten. Systemet vil sjekke rettane dine i Altinn. For at du eller ein kollega skal
                kunne nytte navs nye rekrutteringsteneste på vegner av verksemda, må de ha retten «Stillingsannonsar på
                arbeidsplassen.no» for undereining.{" "}
                <strong>
                    Du kan sjekke om du har rett rett ved å prøve å logge deg inn i tenesta som arbeidsgivar.
                </strong>
            </BodyLong>
            <BodyLong spacing>
                Arbeidsgiveren kan delegere tilgang til deg via Altinn, hvis du ikke har den allerede. Har du en av
                Arbeidsgivaren kan delegere tilgang til deg via Altinn, om du ikkje har han allereie. Har du ei av
                Altinn-rollene «Lønn og personalmedarbeidar» eller «Utfyller/innsender» for undereining, vil du
                automatisk ha retten «Stillingsannonsar på arbeidsplassen.no» på vegner av bedrifta.
            </BodyLong>

            <Heading size="medium" level="3" spacing>
                Meir hjelp
            </Heading>
            <List className="mb-12">
                <ListItem>
                    <AkselNextLink href="/tilgang-som-arbeidsgiver">
                        Korleis få og gi tilgang som arbeidsgivar
                    </AkselNextLink>
                </ListItem>
                <ListItem>
                    <AkselNextLink href="/tilgangsstyring-i-store-virksomheter">
                        Tilgangsstyring i store verksemder
                    </AkselNextLink>
                </ListItem>
            </List>

            <Heading size="large" level="2" spacing>
                Utanlandske verksemder
            </Heading>
            <BodyLong spacing>
                Det er berre <strong>norske verksemder som kan bruke innlogga tenester </strong> på arbeidsplassen.no.
            </BodyLong>
            <BodyLong className="mb-12">
                Om du er ei utanlandsk verksemd som ønskjer hjelp til å rekruttere medarbeidarar frå Noreg, publisere ei
                stilling i Den Europeiske Jobbmobilitetsportalen eller i eit enkelt EU/EØS-land eller Sveits, skal du ta
                kontakt med den offentlege arbeidsformidlinga (EURES) i heimlandet ditt. Les meir om{" "}
                <Link href="https://eures.europa.eu/employers/advertise-job-0_en">EURES-tenesta</Link> i dei ulike
                landa.
            </BodyLong>

            <Heading size="large" level="2" spacing>
                Rekruttere frå EU/EØS og Sveits
            </Heading>
            <BodyLong spacing>
                Om du ønskjer å rekruttere frå EU/EØS og Sveits, kan du søkje etter kandidatar i Den Europeiske
                Jobbmobilitetsportalen.
            </BodyLong>
            <BodyLong className="mb-12">
                Har du spørsmål om publisering av stilling i{" "}
                <Link href="https://eures.europa.eu/index_en">Den Europeiske Jobbmobilitetsportalen</Link> eller i eit
                enkelt EU/EØS-land, ta kontakt med nav Kontaktsenter EURES på{" "}
                <Link href="mailto:eures@nav.no">eures@nav.no</Link>. Les meir om{" "}
                <Link href="https://www.nav.no/arbeidsgiver/rekruttere-eu-eos">
                    navs EURES-tenester for arbeidsgivarar.
                </Link>
            </BodyLong>
            <hr />
            <BodyLong size="small">
                * Unntaket er at du som privatperson kan annonsere ei stilling som brukarstyrt personleg assistent. Om
                du føretrekkjer det, kan du publisere henne sjølv i staden for at arbeidsgivaren din gjer det. Send
                annonseteksten til stilling@nav.no. I annonsen må du oppgi om det er ei fast stilling eller eit
                vikariat, talet på arbeidstimar i veka, arbeidstid, arbeidsted, talet på stillingar og søknadsfrist. Du
                må også oppgi namn og e-postadresse til ein kontaktperson.
            </BodyLong>
        </ArticleWrapper>
    );
}
