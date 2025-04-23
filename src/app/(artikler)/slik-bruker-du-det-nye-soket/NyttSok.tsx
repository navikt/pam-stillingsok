import React from "react";
import { BodyLong, BodyShort, Heading } from "@navikt/ds-react";
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from "@navikt/ds-react/Accordion";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import { List, ListItem } from "@navikt/ds-react/List";
import FigureWithSearchBar from "@/app/_common/components/FigureWithSearchBar";
import VisualChip from "@/app/_common/components/VisualChip";

export default function NyttSok() {
    return (
        <article className="nytt-sok-article mt-5 mb-24">
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    Slik bruker du det nye søket
                </Heading>

                <BodyLong size="large" className="mb-12">
                    Du kan nå kombinere fritekst og filtre for å finne akkurat de jobbene du er ute etter, enklere og
                    raskere.
                </BodyLong>

                <div className="mb-12">
                    <FigureWithSearchBar />
                </div>

                <Heading size="large" level="2" className="mb-5">
                    Fire måter å søke på
                </Heading>

                <div className="mb-10">
                    <Heading size="medium" level="3" className="mb-5">
                        1. Utforskende søk
                    </Heading>

                    <BodyLong className="mb-5">
                        Start bredt for å oppdage ulike muligheter innen ditt fagfelt. Bruk generelle søkeord relatert
                        til din bakgrunn, og andre nøkkelord som du er interessert i.
                    </BodyLong>
                    <div className="mb-5">
                        <List as="ul" className="inline-block-list" aria-label="Forslag til generelle søkeord">
                            <ListItem className="visual-chip">
                                <VisualChip text="undervisning" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="forskning" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="helseteknologi" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="Akershus" />
                            </ListItem>
                        </List>
                    </div>

                    <BodyLong>
                        Med et utforskende søk kan du oppdage nye karriereveier og bruksområder for din kompetanse som
                        du kanskje ikke hadde tenkt på tidligere.
                    </BodyLong>
                </div>

                <div className="mb-10">
                    <Heading size="medium" level="3" className="mb-5">
                        2. Spisset søk
                    </Heading>

                    <BodyLong className="mb-5">
                        Når du vet hva du leter etter, bruk spesifikke søkeord og kombiner med stillingstittel,
                        fagområde, arbeidssted og andre relevante filtre for mer presise resultater.
                    </BodyLong>

                    <div className="mb-5">
                        <List as="ul" className="inline-block-list" aria-label="Forslag til spesifikke søkeord">
                            <ListItem className="visual-chip">
                                <VisualChip text="faglærer" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="matematikklærer" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="realfag" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="naturfag" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="matematikk" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="videregående" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="Bergen" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="fast" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="heltid" />
                            </ListItem>
                        </List>
                    </div>
                    <BodyLong>Spissede søk er effektive når du har en klar idé om hva slags jobb du vil ha.</BodyLong>
                </div>
                <div className="mb-10">
                    <Heading size="medium" level="3" className="mb-5">
                        3. Se på tvers av bransjer
                    </Heading>

                    <BodyLong className="mb-5">
                        Søk på ferdigheter, interesser eller arbeidsforhold fremfor tradisjonelle stillingstitler.
                    </BodyLong>

                    <div className="mb-5">
                        <List as="ul" className="inline-block-list" aria-label="Forslag til søkeord med bransjer">
                            <ListItem className="visual-chip">
                                <VisualChip text="kundeservice" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="deltid" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="kveldsvakt" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="helg" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="må ha førerkort" />
                            </ListItem>
                        </List>
                    </div>

                    <BodyLong>
                        Ved å fokusere på ferdigheter eller arbeidsforhold, oppdager du spennende muligheter i bransjer
                        eller roller du ikke umiddelbart tenkte på.
                    </BodyLong>
                </div>
                <div className="mb-12">
                    <Heading size="medium" level="3" className="mb-5">
                        4. Finn sesongarbeid
                    </Heading>

                    <BodyLong className="mb-5">
                        Kombiner nøkkelord for sesongbaserte jobber med relevante filtre.
                    </BodyLong>

                    <div className="mb-5">
                        <List as="ul" className="inline-block-list" aria-label="Forslag til søkeord med sesongarbeid">
                            <ListItem className="visual-chip">
                                <VisualChip text="julehjelp" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="student" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="butikk" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="deltid" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="sesong" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="trenger ikke førerkort" />
                            </ListItem>
                            <ListItem className="visual-chip">
                                <VisualChip text="ingen krav til utdanning" />
                            </ListItem>
                        </List>
                    </div>

                    <BodyLong>
                        Ved å avgrense søket med relevante filtre finner du raskt frem til jobber som passer for deg.
                    </BodyLong>
                </div>

                <div className="mb-12">
                    <Heading size="large" level="2" className="mb-5">
                        Tips for effektive søk
                    </Heading>

                    <List as="ul" className="mb-10" aria-label="Tips for effektive søk">
                        <ListItem>
                            Fritekstord som for eksempel “lager” eller “julehjelp” utvider ofte søket ditt ved å
                            inkludere flere mulige treff, mens filtre og yrker begrenser søket til spesifikke kriterier.
                            Eksperimenter med ulike kombinasjoner for å finne den rette balansen.
                        </ListItem>
                        <ListItem>
                            Prøv lignende eller relaterte begreper for å fange opp flere relevante stillinger. For
                            eksempel: lærer, pedagog, coach.
                        </ListItem>
                        <ListItem>
                            Vær oppmerksom på generelle jobbtitler som “rådgiver”, “konsulent”, “koordinator” eller
                            “prosjektleder”. Disse kan skjule mange spennende muligheter og kreve ulik kompetanse eller
                            relevant erfaring. Inkluder slike titler i søket ditt for å oppdage et bredere spekter av
                            stillinger.
                        </ListItem>
                        <ListItem>
                            Vær åpen for uventede muligheter – din bakgrunn kan være verdifull i bransjer eller roller
                            du ikke umiddelbart tenker på.
                        </ListItem>
                        <ListItem>
                            Start gjerne bredt og snevre inn søket gradvis etter hvert som du utforsker mulighetene.
                        </ListItem>
                    </List>

                    <Heading size="medium" level="3" className="mb-5">
                        Lagre søkene dine
                    </Heading>
                    <BodyLong className="mb-5">
                        Fikk du laget et perfekt søk? Ikke mist det! Med lagrede søk kan du:
                    </BodyLong>
                    <List as="ul" className="mb-8" aria-label="Ting du kan gjøre med et lagret søk">
                        <ListItem>Raskt gå tilbake til tidligere søk.</ListItem>
                        <ListItem>Få e-postvarsler om nye jobber som matcher søket ditt.</ListItem>
                    </List>

                    <Heading size="small" level="4" className="mb-5">
                        Slik gjør du det
                    </Heading>
                    <List as="ol" className="mb-5" aria-label="Slik lagrer du søkene dine">
                        <ListItem>Utfør et søk med fritekst og filtre.</ListItem>
                        <ListItem>Klikk på "Lagre søk" under søkefeltet.</ListItem>
                        <ListItem>Gi søket et navn og velg om du vil ha e-postvarsler.</ListItem>
                    </List>
                    <BodyLong>
                        <strong>Tips:</strong> Du kan lagre flere søk for ulike jobbtyper eller steder du er interessert
                        i.
                    </BodyLong>
                </div>
                <div className="mb-8">
                    <Heading size="large" level="2" className="mb-5">
                        Tilgjengelige filter
                    </Heading>
                    <BodyLong className="mb-5">Vi har lansert fire nye filtre:</BodyLong>
                    <List as="ul" className="mb-5" aria-label="Nye søkefiltre">
                        <ListItem>reisevei</ListItem>
                        <ListItem>utdanningsnivå</ListItem>
                        <ListItem>erfaring</ListItem>
                        <ListItem>førerkort</ListItem>
                    </List>
                    <BodyLong className="mb-5">Les mer om våre fitre:</BodyLong>

                    <Accordion headingSize="medium" className="filter-explanation-accordion">
                        <AccordionItem>
                            <AccordionHeader>Publisert</AccordionHeader>
                            <AccordionContent>
                                <BodyLong className="mb-5">Filtrer basert på når annonsen ble lagt ut.</BodyLong>
                                <List as="ul" aria-label="Nye filtre med publiseringsdato">
                                    <ListItem>nye i dag</ListItem>
                                    <ListItem>nye siste 3 døgn</ListItem>
                                    <ListItem>nye siste uka</ListItem>
                                </List>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Sted (nyhet)</AccordionHeader>
                            <AccordionContent>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Reisevei</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">
                                    Filtrer jobber basert på maksimal reiseavstand fra sted eller postnummer.
                                </BodyLong>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Sted</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">
                                    Søk jobber i ett eller flere fylker, kommuner eller utenfor Norge.
                                </BodyLong>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Yrke og sektor</AccordionHeader>
                            <AccordionContent>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Yrke</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">Søk basert på yrkeskategorier.</BodyLong>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Sektor</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">Velg mellom offentlig og privat sektor.</BodyLong>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Utdanningsnivå, erfaring og førerkort (nyhet)</AccordionHeader>
                            <AccordionContent>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Utdanningsnivå</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">Finn jobber som passer ditt utdanningsnivå.</BodyLong>
                                <List as="ul" className="mb-8" aria-label="Filtre basert på utdanningsnivå">
                                    <ListItem>ingen krav til utdanning</ListItem>
                                    <ListItem>videregående skole</ListItem>
                                    <ListItem>fag- eller svennebrev</ListItem>
                                    <ListItem>fagskole eller tilsvarende</ListItem>
                                    <ListItem>bachelor eller tilsvarende</ListItem>
                                    <ListItem>master eller tilsvarende</ListItem>
                                    <ListItem>forskningsgrad</ListItem>
                                </List>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Erfaring</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">Filtrer jobber ut ifra hvor mye erfaring du har.</BodyLong>
                                <List as="ul" className="mb-8" aria-label="Filtre basert på erfaring">
                                    <ListItem>ingen krav til arbeidserfaring</ListItem>
                                    <ListItem>noe arbeidserfaring (1-3 år)</ListItem>
                                    <ListItem>mye arbeidserfaring (4+ år)</ListItem>
                                </List>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Førerkort</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">
                                    Filtrer på om førerkort for bil er nødvendig eller ikke.
                                </BodyLong>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Arbeidsspråk</AccordionHeader>
                            <AccordionContent>
                                <BodyLong className="mb-5">Finn jobber som passer for språkene du kan.</BodyLong>

                                <List as="ul" aria-label="Filtre basert på arbeidsspråk">
                                    <ListItem>norsk</ListItem>
                                    <ListItem>engelsk</ListItem>
                                    <ListItem>skandinavisk</ListItem>
                                    <ListItem>samisk</ListItem>
                                </List>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Omfang og ansettelseform</AccordionHeader>
                            <AccordionContent>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Omfang</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">Velg om du ønsker heltid- eller deltidsstillinger.</BodyLong>
                                <BodyShort className="mb-5">
                                    <strong className="size-1-25">Ansettelsesform</strong>
                                </BodyShort>
                                <BodyLong className="mb-5">
                                    Filtrer basert på hvilken type ansettelse du ser etter.
                                </BodyLong>
                                <List as="ul" aria-label="Filtre basert på ansettelsesform">
                                    <ListItem>engasjement</ListItem>
                                    <ListItem>fast</ListItem>
                                    <ListItem>feriejobb</ListItem>
                                    <ListItem>lærling</ListItem>
                                    <ListItem>prosjekt</ListItem>
                                    <ListItem>selvstendig næringsdrivende</ListItem>
                                    <ListItem>sesong</ListItem>
                                    <ListItem>vikariat</ListItem>
                                    <ListItem>åremål</ListItem>
                                </List>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem className="mb-5">
                            <AccordionHeader>Hjemmekontor</AccordionHeader>
                            <AccordionContent>
                                <BodyLong className="mb-5">Finn jobber som passer din ønskede arbeidsform.</BodyLong>
                                <List as="ul" aria-label="Filtre basert på arbeidsform">
                                    <ListItem>
                                        hybridkontor - en kombinasjon av å være på kontoret og jobbe hjemmefra
                                    </ListItem>
                                    <ListItem>kun hjemmekontor</ListItem>
                                    <ListItem>hjemmekontor ikke mulig</ListItem>
                                </List>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <BodyLong>
                        Lykke til med jobbsøket! Ved å bruke disse strategiene og tipsene, er du godt rustet til å finne
                        din neste spennende jobbmulighet.
                    </BodyLong>
                </div>

                <LinkPanel className="arb-link-panel-primary" href="/stillinger">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Søk etter din neste jobb
                    </LinkPanelTitle>
                </LinkPanel>
            </div>
        </article>
    );
}
