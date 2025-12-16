import { Heading, Link, List } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};
export default function Kontakt({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <Heading size="medium" level="2" spacing>
                Jobbsøker
            </Heading>
            <List className="mb-4">
                <ListItem>
                    Se vår{" "}
                    <Link href="https://www.nav.no/brukerstotte">teknisk brukerstøtteside for privatpersoner</Link>
                </ListItem>
                <ListItem>
                    Får du oppfølging fra Nav? Du kan{" "}
                    <Link href="https://www.nav.no/person/kontakt-oss/">kontakte Nav på telefon.</Link>
                </ListItem>
            </List>

            <Heading size="medium" level="2" spacing>
                Arbeidsgiver
            </Heading>
            <List>
                <ListItem>
                    Se vår{" "}
                    <Link href="https://www.nav.no/arbeidsgiver/brukerstotte">
                        teknisk brukerstøtteside for bedrifter
                    </Link>
                </ListItem>
                <ListItem>
                    Arbeidsgivertelefonen i Nav tlf. 55 55 33 36. Hverdager 0900–1500. Svarer på spørsmål om
                    rekruttering, sykefraværsoppfølging, refusjoner, permittering og omstilling m.m.
                </ListItem>
                <ListItem>
                    <Link href="https://www.nav.no/arbeidsgiver/kontaktoss">Kontakt Nav om rekruttering</Link>
                </ListItem>
            </List>
        </ArticleWrapper>
    );
}
