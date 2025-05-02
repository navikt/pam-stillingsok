import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Link from "next/link";
import Image from "next/image";
import bedriftImg from "@images/bedrift.jpg";
import apiImg from "@images/api.png";
import annonseImg from "@images/stillingsannonse.jpg";

export default function SkikkeligBraStillingsannonse() {
    return (
        <article>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Hvordan skriver du en skikkelig bra stillingsannonse?
                </Heading>

                <BodyLong size="large" spacing>
                    Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når du skriver
                    annonsen, slik at du kommer i kontakt med akkurat de søkerne du ønsker?
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <Image
                    fill
                    quality={90}
                    className="article-image"
                    src={annonseImg}
                    alt="Person som skriver på en skrivemaskin"
                />
            </div>

            <div className="container-small mb-16">
                <Heading size="large" level="2" spacing>
                    Nyhet! Enklere og mer lettlest annonse med “strukturert annonse”
                </Heading>
                <BodyLong spacing>
                    Når du lager en annonse på arbeidsplassen.no, kan du nå velge mellom «strukturert annonse» og «ikke
                    strukturert annonse». Med «strukturert annonse» får du forhåndsdefinerte avsnitt, basert på hva
                    jobbsøker synes er viktigst å vite.
                </BodyLong>
                <BodyLong className="mb-12">
                    I tillegg får du tips om hvordan du når ut til jobbsøkerne på en fengende og målrettet måte. Ønsker
                    du å opprette annonsen din som før, velger du formatet «ikke strukturert annonse». Informasjonen du
                    legger inn, lagres underveis og du kan enkelt veksle mellom de to formatene.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Fang interessen og gjør annonsen lett å lese
                </Heading>
                <BodyLong spacing>
                    Mange leser stillingsannonser fra mobilen. Kanskje sitter de på bussen og scroller raskt gjennom
                    dagens nye stillinger. Tenk på det når du lager stillingsannonsen.
                </BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>Førsteinntrykket er viktig.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Jobb med overskriften, den skal vekke interesse. Du kan bruke kunstig intelligens (KI) for å
                            få forslag til gode overskrifter:{" "}
                            <AkselLink as={Link} href="/enklere-a-skrive-gode-kvalifikasjoner">
                                https://arbeidsplassen.nav.no/enklere-a-skrive-gode-kvalifikasjoner
                            </AkselLink>
                        </BodyLong>
                    </li>
                    <li>
                        <BodyLong>Kom raskt til poenget.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Standardfraser og klisjeer kan virke gammeldags.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Bruk aktive setninger. Hvis teksten fungerer muntlig, er det et godt tegn.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Unngå lange avsnitt.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Ikke vær redd for å sette punktum. Korte setninger er bra.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Løs opp teksten med kulepunkter hvis det passer.</BodyLong>
                    </li>
                </ul>

                <Heading size="large" level="2" spacing>
                    Vis at dere er en attraktiv arbeidsplass
                </Heading>
                <BodyLong>
                    De beste kandidatene velger deg fordi de blir motivert og kan identifisere seg med bedriftens
                    verdier og policy.
                </BodyLong>
                <ul className="mb-12">
                    <li>
                        <BodyLong>Tenk på hva du står for og vis hvordan du skiller deg ut.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>Er det gode utviklingsmuligheter i bedriften? Fortell om det.</BodyLong>
                    </li>
                    <li>
                        <BodyLong>
                            Det er ikke nødvendig å skrive mye om bedriften. Oppgi lenke til bedriftens nettside, her
                            kan interesserte lese seg opp.
                        </BodyLong>
                    </li>
                </ul>

                <Heading size="large" level="2" spacing>
                    Tenk over hvilke ord du bruker
                </Heading>
                <BodyLong spacing>
                    Det er kanskje ikke noe du tenker så mye over, men ordene i annonsen din kan være avgjørende for
                    hvem som søker på jobben.
                </BodyLong>
                <BodyLong spacing>
                    Bruker du maskuline ord slik som «solid utdannelse», «strategisk» og «handlekraftig»? Eller feminine
                    ord slik som «relasjonsorientert», «dialogorientert» og «gode kommunikasjonsevner»?
                </BodyLong>
                <BodyLong className="mb-12">
                    Du bør ha et bevisst forhold til de ordene du bruker når du skriver stillingsannonser, ellers kan du
                    faktisk risikere å ikke finne den beste kandidaten til jobben.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Tilpass kravene dine
                </Heading>
                <BodyLong spacing>
                    Er du i en posisjon der du kan ønske deg søkere som både har høy kompetanse og mye erfaring? Eller
                    bør du formulere deg slik at interesserte som ikke innfrir alle krav forstår at de kan være
                    interessante?
                </BodyLong>
                <BodyLong spacing>
                    Er det viktigst å legge vekt på kravene i stillingsbeskrivelsen, eller å fremheve mulighetene som
                    kan by seg for rett person? Du kan styre responsen gjennom ordene du velger og hva du legger vekt
                    på.
                </BodyLong>
                <BodyLong className="mb-12">
                    Krever jobben mye reising, eller har spesielle arbeidstider, så husk å oppgi det.
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
        </article>
    );
}
