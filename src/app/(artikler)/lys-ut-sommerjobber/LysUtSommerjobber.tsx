import { Bleed, BodyLong, Heading, HGrid, LinkCard, List } from "@navikt/ds-react";
import React from "react";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import Image from "next/image";
import apiImg from "@images/api.png";
import bedriftImg from "@images/bedrift.jpg";
import laerlingImg from "@images/laerling-billakk.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { PageBlock } from "@navikt/ds-react/Page";
import { ListItem } from "@navikt/ds-react/List";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};

export default function LysUtSommerjobber({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Mange unge treng å få arbeidserfaring. Kan du vere med på å gi dei ein sjanse ved å lyse ut éin
                    eller fleire sommarjobbar i år?
                </BodyLong>

                <Bleed marginInline={{ xs: "space-0", sm: "space-0", md: "space-96" }} className="mb-8 image-wrapper">
                    <Image
                        className="article-image"
                        src={laerlingImg}
                        alt="Ung person får opplæring i billakkering"
                        quality={75}
                        fill
                        unoptimized
                    />
                </Bleed>
                <BodyLong className="mb-4">
                    Her har du nokre gode argument for kvifor de bør ta inn sommarvikarar:
                </BodyLong>

                <List className="mb-6">
                    <ListItem>Sommarvikarane hjelper til med å halde hjula i gang gjennom ferieavviklinga.</ListItem>
                    <ListItem>
                        Sommarvikarane kan ta tak i nokre av dei prosjekta som har vorte liggjande på vent eller som har
                        vorte utsett.
                    </ListItem>
                    <ListItem>Sommarvikariat er ei god rekrutteringsmoglegheit for vidare fast tilsetjing.</ListItem>
                </List>

                <BodyLong spacing>
                    Alle verksemder med behov for ferievikarar og ekstrahjelp er velkomne til å lyse ut stillingane sine
                    på arbeidsplassen.no, Nav sin stillingsdatabase. Då får flest mogleg vite om jobbmoglegheitene.
                    Tenestene på arbeidsplassen.no er kostnadsfrie.
                </BodyLong>
                <BodyLong className="mb-12">
                    <AkselNextLink href="/skikkelig-bra-stillingsannonse">
                        Les meir om korleis du kan lage ein treffsikker stillingsannonse.
                    </AkselNextLink>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Korleis skal jobbsøkjarane finne nettopp sommarjobbannonsen din?
                </Heading>
                <BodyLong className="mb-4">Her følgjer fire tips:</BodyLong>
                <List as="ol" className="mb-12">
                    <ListItem>Huk av for "feriejobb" i filter for tilsetjingsform.</ListItem>
                    <ListItem>
                        Ver tydeleg i annonseteksten at du lyser ut sommarjobb. Skriv det gjerne i annonseoverskrifta.
                    </ListItem>
                    <ListItem>Vekk interesse! Bruk eit språk som dei unge forstår.</ListItem>
                    <ListItem>
                        Vel <AkselNextLink href="/superrask-soknad-bedrift">superrask søknad</AkselNextLink> som
                        kontaktform. Det er ein enkel måte for unge å komme i kontakt med deg, utan CV og eit langt
                        søknadsbrev. CV kan du be om seinare i ein samtale.
                    </ListItem>
                </List>

                <BodyLong className="mb-12">Lykke til med utlysinga!</BodyLong>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/stillingsregistrering/stillingsannonser">
                            Lag ny stillingsannonse
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </LinkCard>
            </ArticleWrapper>

            <PageBlock as="section" gutters width="lg" aria-labelledby="related-articles-heading">
                <Heading size="large" level="2" id="related-articles-heading" spacing>
                    Vidare lesing
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkCard
                        image={bedriftImg}
                        alt="En mann sitter på et kontor og tar en annen i hånden"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        href="/superrask-soknad-bedrift"
                        color="secondary"
                    />
                    <ImageLinkCard
                        image={apiImg}
                        alt="API, illustrasjon"
                        title="Overføring av stillingsannonser til arbeidsplassen.no"
                        description="Navs import-API er utviklet for at det skal være enkelt å publisere stillinger på
                                    arbeidsplassen.no for våre samarbeidspartnere."
                        href="/overforing-av-stillingsannonser"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
