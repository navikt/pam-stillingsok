"use client";

import React, { useMemo, useState } from "react";
import { BodyLong, Button, Heading, HelpText, HStack, Label, Tag } from "@navikt/ds-react";
import "./AdDescriptionList.css";
import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import { joinArbeidstider } from "@/app/stillinger/_common/utils/arbeidstid";
import { getStartText } from "@/app/stillinger/_common/lib/ad-model/utils/start-text";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import getRemoteWorkValue from "@/app/stillinger/_common/utils/getRemoteWorkValue";

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
export const EXTENT_CODE = {
    HELTID: "HELTID",
    DELTID: "DELTID",
    HELTID_OG_DELTID: "HELTID_OG_DELTID",
} as const;
export type ExtentCode = (typeof EXTENT_CODE)[keyof typeof EXTENT_CODE];

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

    if (hasHeltid && hasDeltid) return EXTENT_CODE.HELTID_OG_DELTID;
    if (hasHeltid) return EXTENT_CODE.HELTID;
    if (hasDeltid) return EXTENT_CODE.DELTID;
    return undefined;
};

export function getExtent(data: AdDTO): string {
    const code = deriveExtentCode(data.extent);

    // Velg prosenttekst (range > enkel)
    const jobpercentage = data.jobPercentage ?? "";

    switch (code) {
        case EXTENT_CODE.HELTID_OG_DELTID:
            return jobpercentage ? `, heltid 100% og deltid ${jobpercentage}` : `, heltid og deltid`;
        case EXTENT_CODE.DELTID:
            return jobpercentage ? `, deltid ${jobpercentage}` : `, deltid`;
        case EXTENT_CODE.HELTID:
            return `, heltid 100%`;
        default:
            return "";
    }
}

type EmploymentDetailsListItem = {
    label: string;
    value: string;
    isAiGeneratedData?: boolean;
};

function getEmploymentDetailsList(adData: AdDTO): EmploymentDetailsListItem[] {
    const employmentDetailsList: EmploymentDetailsListItem[] = [];

    const startText = getStartText({
        startDate: adData.startDate,
        startDateLabel: adData.startDateLabel,
    });

    if (startText) {
        employmentDetailsList.push({
            label: "Oppstart",
            value: startText,
        });
    }
    if (adData.jobTitle) {
        employmentDetailsList.push({
            label: "Stillingstittel",
            value: adData.jobTitle,
        });
    }
    if (adData.engagementType) {
        employmentDetailsList.push({
            label: "Type ansettelse",
            value: `${adData.engagementType}${getExtent(adData)}`,
        });
    }
    if (adData.jobArrangement || adData.workDays || adData.workHours) {
        employmentDetailsList.push({
            label: "Arbeidstid",
            value: joinArbeidstider(adData.jobArrangement, adData.workHours, adData.workDays),
        });
    }
    if (adData.positionCount) {
        employmentDetailsList.push({
            label: "Antall stillinger",
            value: `${adData.positionCount}`,
        });
    }
    if (adData.workLanguages && adData.workLanguages.length > 0) {
        employmentDetailsList.push({
            label: "Arbeidsspråk",
            value: joinStringWithSeparator(adData.workLanguages, "eller"),
        });
    }
    if (adData.remoteOptions) {
        employmentDetailsList.push({
            label: "Mulighet for hjemmekontor",
            value: getRemoteWorkValue(adData.remoteOptions),
            isAiGeneratedData: adData.medium !== "Stillingsregistrering",
        });
    }

    return employmentDetailsList;
}

export default function EmploymentDetails({ adData }: EmploymentDetailsProps) {
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    /**
     *  TODO: refactor denne gå grundig gjennom data flyten for å teste type
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     *  Fiks type casting her få på plass riktig modell
     */

    const detailsList = useMemo(() => {
        const numberOfItemsAlwaysVisible = 4;
        const items = getEmploymentDetailsList(adData);
        const visibleItems = showMoreDetails ? items : items.slice(0, numberOfItemsAlwaysVisible);
        return {
            items: visibleItems,
            showButton: items.length > numberOfItemsAlwaysVisible,
            showAiUsageExplanation: visibleItems.some((item) => item.isAiGeneratedData),
        };
    }, [adData, showMoreDetails]);

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
            <dl id="employment-details-dl-list" className="ad-description-list mb-4">
                {detailsList.items.map((detail) => (
                    <div key={detail.label}>
                        <HStack align="center" gap="space-6" as="dt">
                            <Label as="span">{detail.label}</Label>
                            {detail.isAiGeneratedData && (
                                <Tag size="small" variant="moderate" data-color="accent">
                                    AI
                                </Tag>
                            )}
                        </HStack>
                        <BodyLong as={"dd"}>{detail.value}</BodyLong>
                    </div>
                ))}
            </dl>

            {detailsList.showAiUsageExplanation && (
                <HStack align="center" gap="space-6" className="mt-6">
                    <Tag size="small" variant="moderate" data-color="accent">
                        AI
                    </Tag>
                    <BodyLong textColor="subtle">Bruk av kunstig intelligens</BodyLong>
                    <HelpText data-color="accent" title="Mer om bruk av kunstig intelligens">
                        Denne informasjonen er hentet ut av kunstig intelligens for å hjelpe deg å finne relevante
                        jobber. I noen få tilfeller kan det være feil, så husk å sjekke hele annonsen.
                    </HelpText>
                </HStack>
            )}

            {detailsList.showButton && (
                <HStack justify={{ xs: "end" }} className="mt-4">
                    <Button
                        onClick={() => setShowMoreDetails((prev) => !prev)}
                        variant="tertiary"
                        aria-expanded={showMoreDetails}
                        aria-controls="employment-details-dl-list"
                        icon={
                            showMoreDetails ? (
                                <ChevronUpIcon aria-hidden="true" />
                            ) : (
                                <ChevronDownIcon aria-hidden="true" />
                            )
                        }
                    >
                        {showMoreDetails ? "Vis færre detaljer" : "Vis flere detaljer"}
                    </Button>
                </HStack>
            )}
        </section>
    );
}
