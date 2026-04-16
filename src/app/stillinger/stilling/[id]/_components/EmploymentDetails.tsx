import React from "react";
import { Heading, HStack } from "@navikt/ds-react";
import "./AdDescriptionList.css";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import EmploymentDetailsPanel from "@/app/stillinger/stilling/[id]/_components/EmploymentDetailsPanel";

const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode): React.JSX.Element | string | boolean | object | void | null | undefined => {
        // Sjekk om domNode er en tag (et HTML-element)
        if (domNode.type === "tag" && domNode.tagName) {
            const { attribs, children } = domNode;

            if (
                attribs &&
                (attribs.id === "arb-serEtter" || attribs.id === "arb-arbeidsoppgaver" || attribs.id === "arb-tilbyr")
            ) {
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

type EmploymentDetailsProps = {
    adData: AdDTO;
};

export default function EmploymentDetails({ adData }: EmploymentDetailsProps) {
    /**
     *  TODO: refactor denne gå grundig gjennom data flyten for å teste type
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     *  Fiks type casting her få på plass riktig modell
     */

    /** TODO: Vi må rydde opp i typer i arbeidsplassen-react
     * (Konvertere til ts) slik at dette blir fikset og kan fjerne className="" */
    return (
        <section className="full-width mt-8 mb-8">
            <HStack gap="space-16" justify="space-between" align="center" className="mb-4">
                <Heading level="2" size="large">
                    Om jobben
                </Heading>
                {adData.id != null && (
                    <FavouritesButton
                        plassering="annonse-side"
                        variant="tertiary"
                        id={adData.id}
                        stilling={{
                            uuid: adData.id,
                            source: adData.source || "",
                            reference: adData.reference || "",
                            title: adData.title || "",
                            jobTitle: adData.jobTitle || "",
                            status: adData.status || "",
                            applicationdue:
                                adData.application?.applicationDueDate ?? adData.application?.applicationDueLabel ?? "",
                            location: getWorkLocation(adData.locationList),
                            employer: adData.employer?.name ?? "",

                            published: adData.published || "",
                            expires: adData.expires || "",
                            hasSuperraskSoknad: adData.application.hasSuperraskSoknad ?? false,
                        }}
                    />
                )}
            </HStack>

            {adData.adTextHtml && adData.adTextHtml.includes("arb-aapningstekst") && (
                <RichText className="">{parse(adData.adTextHtml, options)}</RichText>
            )}

            <EmploymentDetailsPanel adData={adData} />
        </section>
    );
}
