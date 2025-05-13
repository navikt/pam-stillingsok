import React, { ReactElement } from "react";
import { BodyLong, Heading, HStack, Label } from "@navikt/ds-react";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import "./AdDescriptionList.css";
import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import { joinArbeidstider } from "@/app/stillinger/stilling/[id]/_components/joinArbeidstider";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";

const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode): React.JSX.Element | string | boolean | object | void | null | undefined => {
        // Sjekk om domNode er en tag (et HTML-element)
        if (domNode.type === "tag" && domNode.tagName) {
            const { attribs, children } = domNode;

            if (
                attribs &&
                (attribs.id === "arb-serEtter" || attribs.id === "arb-arbeidsoppgaver" || attribs.id === "arb-tilbyr")
            ) {
                // eslint-disable-next-line
                return <></>;
            }
            return domToReact(children as DOMNode[]);
        }
        // Sjekk om domNode er en tekstnode
        if (domNode.type === "text") {
            return domNode.data; // Returner teksten direkte
        }

        return domToReact([domNode]);
    },
};

const ExtentEnum = {
    HELTID: "Heltid",
    DELTID: "Deltid",
    HELTID_OG_DELTID: "Heltid_og_Deltid",
    UKJENT: "Ukjent",
};

type EmploymentDetailsProps = {
    adData: StillingDetaljer;
};
export default function EmploymentDetails({ adData }: EmploymentDetailsProps): ReactElement {
    /**
     *  TODO: refactor denne gå grundig gjennom data flyten for å teste type
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     *  Fiks type casting her få på plass riktig modell
     */

    const getExtent = (data: StillingDetaljer): string => {
        const { extent } = data;

        let jobpercentage = "";
        if (data.jobPercentageRange) {
            jobpercentage = data.jobPercentageRange;
        } else if (data.jobPercentage) {
            jobpercentage = data.jobPercentage;
        }

        if (extent) {
            let result = "";
            if (extent === ExtentEnum.HELTID_OG_DELTID) {
                result = `, heltid 100% og deltid ${jobpercentage}`;
            } else if (extent === ExtentEnum.DELTID) {
                result = `, deltid ${jobpercentage}`;
            } else if (extent === ExtentEnum.HELTID) {
                result = `, heltid 100%`;
            } else {
                result = "";
            }
            return result;
        }
        return "";
    };

    return (
        <section className="full-width mt-8">
            <HStack gap="4" justify="space-between" align="center" className="mb-4">
                <Heading level="2" size="large">
                    Om jobben
                </Heading>
                {adData.id != null && <FavouritesButton variant="tertiary" id={adData.id} stilling={adData} />}
            </HStack>

            {adData.adText && adData.adText.includes("arb-aapningstekst") && (
                <RichText>{parse(adData.adText, options)}</RichText>
            )}
            <dl className="ad-description-list mb-8">
                {adData.jobTitle && (
                    <div>
                        <dt>
                            <Label as="p">Stillingstittel</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.jobTitle}</BodyLong>
                        </dd>
                    </div>
                )}
                {adData.startTime && (
                    <div>
                        <dt>
                            <Label as="p">Oppstart</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(adData.startTime)}</BodyLong>
                        </dd>
                    </div>
                )}
                {adData.engagementType && (
                    <div>
                        <dt>
                            <Label as="p">Type ansettelse</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {adData.engagementType}
                                {getExtent(adData)}
                            </BodyLong>
                        </dd>
                    </div>
                )}
                {(adData.jobArrangement || adData.workdays || adData.workHours) && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {joinArbeidstider(adData.jobArrangement, adData.workHours, adData.workdays)}
                            </BodyLong>
                        </dd>
                    </div>
                )}
                {adData.workLanguages && adData.workLanguages.length > 0 && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidsspråk</Label>
                        </dt>
                        <dd>
                            <BodyLong>{joinStringWithSeparator(adData.workLanguages, "eller")}</BodyLong>
                        </dd>
                    </div>
                )}
                {adData.positionCount && (
                    <div>
                        <dt>
                            <Label as="p">Antall stillinger</Label>
                        </dt>
                        <dd>
                            <BodyLong>{adData.positionCount}</BodyLong>
                        </dd>
                    </div>
                )}
            </dl>
        </section>
    );
}
