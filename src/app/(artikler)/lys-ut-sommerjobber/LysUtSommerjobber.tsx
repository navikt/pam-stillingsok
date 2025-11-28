import { BodyLong, Heading, Link } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Image from "next/image";
import apiImg from "@images/api.png";
import bedriftImg from "@images/bedrift.jpg";
import laerlingImg from "@images/laerling-billakk.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";

type Props = {
    readonly meta: PageInfo;
};

export default function LysUtSommerjobber({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} className="container-medium mb-24">
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large">
                    Mange unge treng å få arbeidserfaring. Kan du vere med på å gi dei ein sjanse ved å lyse ut éin
                    eller fleire sommarjobbar i år?
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <Image
                    priority
                    className="article-image"
                    src={laerlingImg}
                    alt="Ung person får opplæring i billakkering"
                    quality={90}
                    fill
                />
            </div>

            <div className="container-small mb-16">
                <BodyLong>Her har du nokre gode argument for kvifor de bør ta inn sommarvikarar:</BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>
                            Sommarvikarane hjelper til med å halde hjula i gang gjennom ferieavviklinga.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Sommarvikarane kan ta tak i nokre av dei prosjekta som har vorte liggjande på vent eller som
                            har vorte utsett.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Sommarvikariat er ei god rekrutteringsmoglegheit for vidare fast tilsetjing.
                        </BodyLong>
                    </li>
                </ul>

                <BodyLong spacing>
                    Alle verksemder med behov for ferievikarar og ekstrahjelp er velkomne til å lyse ut stillingane sine
                    på arbeidsplassen.no, Nav sin stillingsdatabase. Då får flest mogleg vite om jobbmoglegheitene.
                    Tenestene på arbeidsplassen.no er kostnadsfrie.
                </BodyLong>
                <BodyLong className="mb-12">
                    <Link href="/skikkelig-bra-stillingsannonse">
                        Les meir om korleis du kan lage ein treffsikker stillingsannonse.
                    </Link>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Korleis skal jobbsøkjarane finne nettopp sommarjobbannonsen din?
                </Heading>
                <BodyLong>Her følgjer fire tips:</BodyLong>
                <ol className="mb-12">
                    <li>
                        <BodyLong>Huk av for "feriejobb" i filter for tilsetjingsform.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Ver tydeleg i annonseteksten at du lyser ut sommarjobb. Skriv det gjerne i
                            annonseoverskrifta.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Vekk interesse! Bruk eit språk som dei unge forstår.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Vel <Link href="/superrask-soknad-bedrift">superrask søknad</Link> som kontaktform. Det er
                            ein enkel måte for unge å komme i kontakt med deg, utan CV og eit langt søknadsbrev. CV kan
                            du be om seinare i ein samtale.
                        </BodyLong>
                    </li>
                </ol>

                <BodyLong className="mb-12">Lykke til med utlysinga!</BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </div>

            <Heading size="large" level="2" spacing>
                Vidare lesing
            </Heading>
            <div className="image-link-panel-grid-medium">
                <ImageLinkPanelMedium
                    image={bedriftImg}
                    alt="En mann sitter på et kontor og tar en annen i hånden"
                    title="Superrask Søknad"
                    description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                    href="/superrask-soknad-bedrift"
                    color="secondary"
                />
                <ImageLinkPanelMedium
                    image={apiImg}
                    alt="API, illustrasjon"
                    title="Overføring av stillingsannonser til arbeidsplassen.no"
                    description="Navs import-API er utviklet for at det skal være enkelt å publisere stillinger på
                                    arbeidsplassen.no for våre samarbeidspartnere."
                    href="/overforing-av-stillingsannonser"
                    color="tertiary"
                />
            </div>
        </ArticleWrapper>
    );
}
