import { BodyLong, Heading, Link } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";

type Props = {
    readonly meta: ArticleMeta;
};
export default function Kontakt({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
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
        </ArticleWrapper>
    );
}
