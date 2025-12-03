import { BodyLong, Heading } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Image from "next/image";
import bedriftImg from "@images/bedrift.jpg";
import apiImg from "@images/api.png";
import annonseImg from "@images/stillingsannonse.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};

export default function SkikkeligBraStillingsannonse({ meta }: Props) {
    return (
        <ArticleWrapper lang={meta.language} className="mt-5">
            <div className="container-small mb-12">
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Kva ser jobbsøkjarar etter når dei les ei stillingsannonse? Kva bør du tenkje på når du skriv
                    annonsen, slik at du kjem i kontakt med akkurat dei søkjarane du ønskjer?
                </BodyLong>
            </div>
            <div className="container-medium mb-12">
                <Image
                    fill
                    quality={90}
                    className="article-image"
                    src={annonseImg}
                    alt="Person som skriv på ei skrivemaskin "
                />
            </div>

            <div className="container-small mb-16">
                <Heading size="large" level="2" spacing>
                    Nyheit! Enklare og meir lettlesen annonse med &quot;strukturert annonse&quot;
                </Heading>
                <BodyLong spacing>
                    Når du lagar ei annonse på arbeidsplassen.no, kan du no velje mellom strukturert annonse og ikkje
                    strukturert annonse. Med strukturert annonse får du ferdigdefinerte avsnitt, basert på kva
                    jobbsøkjarar meiner er viktigast å vite.
                </BodyLong>
                <BodyLong className="mb-12">
                    Du får også tips om korleis du kan nå ut til jobbsøkjarane på ein fengande og målretta måte. Ønskjer
                    du å opprette annonsen slik du har gjort før, vel du formatet &quot;ikkje strukturert annonse&quot;.
                    Informasjonen du legg inn blir lagra undervegs, og du kan enkelt bytte mellom dei to formata.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Fang interessa og gjer annonsen lett å lese
                </Heading>
                <BodyLong spacing>
                    Mange les stillingsannonsar på mobilen, kanskje medan dei sit på bussen og scroller gjennom dagens
                    nye jobbar. Tenk på det når du lagar annonsen.
                </BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>Førsteinntrykket er viktig.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Jobb med overskrifta, ho skal vekkje interesse. Du kan bruke kunstig intelligens (KI) til å
                            få forslag:{" "}
                            <AkselNextLink href="/enklere-a-skrive-gode-kvalifikasjoner">
                                https://arbeidsplassen.nav.no/enklere-a-skrive-gode-kvalifikasjoner
                            </AkselNextLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Kom raskt til poenget.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Unngå standardfrasar og klisjear, dei kan verke gammaldagse.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Bruk aktive setningar. Om teksten fungerer munnleg, er det eit godt teikn.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Unngå lange avsnitt.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Set punktum, korte setningar er bra. </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Bruk gjerne punktlister der det passar.</BodyLong>
                    </li>
                </ul>

                <Heading size="large" level="2" spacing>
                    Vis at de er ein attraktiv arbeidsplass
                </Heading>
                <BodyLong>
                    Dei beste kandidatane vel dykk fordi dei blir motiverte og kjenner seg igjen i verdiane og kulturen
                    dykkar.
                </BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>Tenk over kva de står for og vis korleis de skil dykk ut.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Har de gode utviklingsmoglegheiter? Fortel om det.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Det er ikkje nødvendig å skrive mykje om verksemda, legg heller ved lenkje til nettsida.
                        </BodyLong>
                    </li>
                </ul>

                <Heading size="large" level="2" spacing>
                    Tenk over kva ord du bruker
                </Heading>
                <BodyLong>Orda du bruker kan påverke kven som søkjer:</BodyLong>
                <ul className="mb-6">
                    <li>
                        <BodyLong>
                            Maskuline ord som &quot;solid utdanning&quot;, &quot;strategisk&quot; og
                            &quot;handlekraftig&quot;
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Feminine ord som &quot;relasjonsorientert&quot;, &quot;dialogorientert&quot; og &quot;gode
                            kommunikasjonsevner&quot;
                        </BodyLong>
                    </li>
                </ul>
                <BodyLong className="mb-12">
                    Ha eit bevisst forhold til språket, det kan avgjere om du når den beste kandidaten.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Tilpass krava dine
                </Heading>
                <ul className="mb-6">
                    <li>
                        <BodyLong>Kan du ønskje deg søkjarar med høg kompetanse og lang erfaring?</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Eller bør du formulere deg slik at fleire forstår at dei kan vere aktuelle?</BodyLong>
                    </li>
                </ul>
                <BodyLong spacing>
                    Tenk over om du vil leggje vekt på krav eller moglegheiter. Du styrer responsen gjennom språket og
                    kva du framhevar.
                </BodyLong>
                <BodyLong className="mb-12">
                    Krev jobben mykje reising eller spesielle arbeidstider? Hugs å opplyse om det.
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        image={bedriftImg}
                        alt="To personer som håndhilser"
                        title="Superrask søknad"
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
            </div>
        </ArticleWrapper>
    );
}
