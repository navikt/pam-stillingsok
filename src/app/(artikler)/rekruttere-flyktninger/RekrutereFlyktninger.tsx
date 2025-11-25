import { BodyLong, Link as AkselLink } from "@navikt/ds-react";
import { ArticleMeta } from "@/app/(artikler)/articleMetaTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: ArticleMeta;
};

export default function RekrutereFlyktninger({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <BodyLong spacing>
                Alle flyktninger med skriftlig vedtak om opphold- og arbeidstillatelse fra UDI kan starte i arbeid.
            </BodyLong>
            <BodyLong spacing>
                Vi anbefaler å <AkselLink href="/stillingsregistrering/stillingsannonser">lyse ut stillinger</AkselLink>{" "}
                på arbeidsplassen.no. Tjenesten er gratis.
            </BodyLong>
            <BodyLong spacing>
                Husk å informere om språkkrav for stillingen og skrive annonsen på engelsk hvis det er arbeidsspråket.
            </BodyLong>
            <BodyLong spacing>
                <AkselLink href="https://www.nav.no/arbeidsgiver/rekruttere-flyktninger">
                    Navs råd for deg som ønsker å komme i kontakt med kvalifiserte kandidater
                </AkselLink>
            </BodyLong>
            <BodyLong>
                <AkselLink href="https://www.imdi.no/mangfold-i-arbeidslivet/">
                    Les om hvordan mangfold i arbeidslivet kan bidra til innovasjon, vekst og verdiskaping på imdi.no
                </AkselLink>
            </BodyLong>
        </ArticleWrapper>
    );
}
