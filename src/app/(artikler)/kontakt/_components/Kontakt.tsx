import { BodyLong, Heading } from "@navikt/ds-react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
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
                        <AkselNextLink href="https://www.nav.no/brukerstotte">
                            teknisk brukerstøtteside for privatpersoner
                        </AkselNextLink>
                    </BodyLong>
                </li>
                <li>
                    <BodyLong>
                        Får du oppfølging fra Nav? Du kan{" "}
                        <AkselNextLink href="https://www.nav.no/person/kontakt-oss/">
                            kontakte Nav på telefon.
                        </AkselNextLink>
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
                        <AkselNextLink href="https://www.nav.no/arbeidsgiver/brukerstotte">
                            teknisk brukerstøtteside for bedrifter
                        </AkselNextLink>
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
                        <AkselNextLink href="https://www.nav.no/arbeidsgiver/kontaktoss">
                            Kontakt Nav om rekruttering
                        </AkselNextLink>
                    </BodyLong>
                </li>
            </ul>
        </ArticleWrapper>
    );
}
