import React, { ReactElement } from "react";
import { BodyLong, Heading, HStack, Label } from "@navikt/ds-react";
import "./AdDescriptionList.css";
import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import { joinArbeidstider } from "@/app/stillinger/_common/utils/arbeidstid";
import { getStartText } from "@/app/stillinger/_common/lib/ad-model/utils/start-text";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

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
export const ExtentCode = {
    HELTID: "HELTID",
    DELTID: "DELTID",
    HELTID_OG_DELTID: "HELTID_OG_DELTID",
} as const;
export type ExtentCode = (typeof ExtentCode)[keyof typeof ExtentCode];

// Normaliserer innholdet i extent-lista til en kode
const deriveExtentCode = (extent: ReadonlyArray<string> | null): ExtentCode | undefined => {
    if (!extent?.length) return undefined;

    const norm = (s: string) =>
        s
            .normalize("NFKD")
            .replace(/\p{Diacritic}/gu, "")
            .trim()
            .toLowerCase();

    const hasHeltid = extent.some((x) => {
        const v = norm(x);
        return v.includes("heltid") || v === "fulltid" || v === "full time" || v === "full-time";
    });

    const hasDeltid = extent.some((x) => {
        const v = norm(x);
        return (
            v.includes("deltid") ||
            v === "parttid" ||
            v === "del tid" ||
            v.includes("part-time") ||
            v.includes("part time")
        );
    });

    if (hasHeltid && hasDeltid) return ExtentCode.HELTID_OG_DELTID;
    if (hasHeltid) return ExtentCode.HELTID;
    if (hasDeltid) return ExtentCode.DELTID;
    return undefined;
};

export function getExtent(data: AdDTO): string {
    const code = deriveExtentCode(data.extent);

    // Velg prosenttekst (range > enkel)
    const jobpercentage = data.jobPercentage ?? "";

    switch (code) {
        case ExtentCode.HELTID_OG_DELTID:
            return jobpercentage ? `, heltid 100% og deltid ${jobpercentage}` : `, heltid og deltid`;
        case ExtentCode.DELTID:
            return jobpercentage ? `, deltid ${jobpercentage}` : `, deltid`;
        case ExtentCode.HELTID:
            return `, heltid 100%`;
        default:
            return "";
    }
}

export default function EmploymentDetails({ adData }: EmploymentDetailsProps): ReactElement {
    /**
     *  TODO: refactor denne gå grundig gjennom data flyten for å teste type
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     *  Fiks type casting her få på plass riktig modell
     */

    const startText = getStartText({
        startDate: adData.startDate,
        startDateLabel: adData.startDateLabel,
    });
    return (
        <section className="full-width mt-8">
            <HStack gap="4" justify="space-between" align="center" className="mb-4">
                <Heading level="2" size="large">
                    Om jobben
                </Heading>
                {adData.id != null && (
                    <FavouritesButton
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
                <RichText>{parse(adData.adTextHtml, options)}</RichText>
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
                {startText && (
                    <div>
                        <dt>
                            <Label as="p">Oppstart</Label>
                        </dt>
                        <dd>
                            <BodyLong>{startText}</BodyLong>
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
                {(adData.jobArrangement || adData.workDays || adData.workHours) && (
                    <div>
                        <dt>
                            <Label as="p">Arbeidstid</Label>
                        </dt>
                        <dd>
                            <BodyLong>
                                {joinArbeidstider(adData.jobArrangement, adData.workHours, adData.workDays)}
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
