import { BodyLong, Heading, LinkCard, List } from "@navikt/ds-react";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};

export default function VilkarSuperraskSoknad({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language}>
            <Heading size="xlarge" level="1" spacing>
                {meta.title}
            </Heading>
            <BodyLong size="large" spacing>
                Personopplysninger som du får frå jobbsøkjarar i “superrask søknad” kan berre brukast så lenge formålet
                er å bemanna og rekruttera til ei konkret stilling.
            </BodyLong>
            <BodyLong spacing>
                Det er ikkje tillaten å bruka mottekne personopplysningar til andre formål, slik som å
            </BodyLong>
            <List className="mb-8">
                <ListItem>bruka opplysningar i samband med sal eller marknadsføring av varer eller tenester</ListItem>
                <ListItem>tilby arbeidssøkjarar stillingar der arbeidssøkjaren må betala for å søkja</ListItem>
                <ListItem>tilby personar arbeidstreningsplassar</ListItem>
            </List>

            <BodyLong spacing>Nav vil følgja opp brot på desse vilkåra dersom det førekjem.</BodyLong>

            <LinkCard className="arb-link-panel-primary">
                <LinkCardTitle>
                    <AkselNextLinkCardAnchor href="/vilkar-og-retningslinjer">
                        Gå til Vilkår og retningslinjer
                    </AkselNextLinkCardAnchor>
                </LinkCardTitle>
            </LinkCard>
        </ArticleWrapper>
    );
}
