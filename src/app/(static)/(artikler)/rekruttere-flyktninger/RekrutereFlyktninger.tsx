import { BodyLong, Link } from "@navikt/ds-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};

export default function RekrutereFlyktninger({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} title={meta.title}>
            <BodyLong spacing>
                Alle flyktninger med skriftlig vedtak om opphold- og arbeidstillatelse fra UDI kan starte i arbeid.
            </BodyLong>
            <BodyLong spacing>
                Vi anbefaler å{" "}
                <AkselNextLink href="/stillingsregistrering/stillingsannonser">lyse ut stillinger</AkselNextLink> på
                arbeidsplassen.no. Tjenesten er gratis.
            </BodyLong>
            <BodyLong spacing>
                Husk å informere om språkkrav for stillingen og skrive annonsen på engelsk hvis det er arbeidsspråket.
            </BodyLong>
            <BodyLong spacing>
                <Link href="https://www.nav.no/arbeidsgiver/rekruttere-flyktninger">
                    Navs råd for deg som ønsker å komme i kontakt med kvalifiserte kandidater
                </Link>
            </BodyLong>
            <BodyLong>
                <Link href="https://www.imdi.no/mangfold-i-arbeidslivet/">
                    Les om hvordan mangfold i arbeidslivet kan bidra til innovasjon, vekst og verdiskaping på imdi.no
                </Link>
            </BodyLong>
        </ArticleWrapper>
    );
}
