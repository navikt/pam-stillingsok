import React, { ReactElement } from "react";
import { BodyLong, Heading, HStack, Label } from "@navikt/ds-react";
import "@/app/stillinger/stilling/[id]/_components/AdDescriptionList.css";
import joinStringWithSeparator from "@/app/stillinger/_common/utils/joinStringWithSeparator";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse, { DOMNode, domToReact, HTMLReactParserOptions } from "html-react-parser";
import { joinArbeidstider } from "@/app/stillinger/_common/utils/arbeidstid";
import { getStartText } from "@/app/stillinger/_common/lib/ad-model/utils/start-text";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { EXTENT_CODE, ExtentCode } from "@/app/stillinger/stilling/[id]/_components/EmploymentDetails";

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

export default function EmploymentDetailsInternal({ adData }: EmploymentDetailsProps): ReactElement {
    const startText = getStartText({
        startDate: adData.startDate,
        startDateLabel: adData.startDateLabel,
    });
    return (
        <section className="full-width mt-8">
            <HStack gap="space-16" justify="space-between" align="center" className="mb-4">
                <Heading level="2" size="large">
                    Om jobben
                </Heading>
            </HStack>

            {adData.adTextHtml && adData.adTextHtml.includes("arb-aapningstekst") && (
                <RichText>{parse(adData.adTextHtml, options)}</RichText>
            )}
            <dl className="ad-description-list mb-8">
                {adData.jobTitle && (
                    <div>
                        <Label as="dt">Stillingstittel</Label>
                        <BodyLong as={"dd"}>{adData.jobTitle}</BodyLong>
                    </div>
                )}
                {startText && (
                    <div>
                        <Label as="dt">Oppstart</Label>
                        <BodyLong as={"dd"}>{startText}</BodyLong>
                    </div>
                )}
                {adData.engagementType && (
                    <div>
                        <Label as="dt">Type ansettelse</Label>
                        <BodyLong as={"dd"}>
                            {adData.engagementType}
                            {getExtent(adData)}
                        </BodyLong>
                    </div>
                )}
                {(adData.jobArrangement || adData.workDays || adData.workHours) && (
                    <div>
                        <Label as="dt">Arbeidstid</Label>
                        <BodyLong as={"dd"}>
                            {joinArbeidstider(adData.jobArrangement, adData.workHours, adData.workDays)}
                        </BodyLong>
                    </div>
                )}
                {adData.workLanguages && adData.workLanguages.length > 0 && (
                    <div>
                        <Label as="dt">Arbeidsspråk</Label>
                        <BodyLong as={"dd"}>{joinStringWithSeparator(adData.workLanguages, "eller")}</BodyLong>
                    </div>
                )}
                {adData.positionCount && (
                    <div>
                        <Label as="dt">Antall stillinger</Label>
                        <BodyLong as={"dd"}>{adData.positionCount}</BodyLong>
                    </div>
                )}
                {adData.remoteOptions && (
                    <div>
                        <Label as="dt">Arbeidssted</Label>
                        <BodyLong as={"dd"}>{adData.remoteOptions}</BodyLong>
                    </div>
                )}
            </dl>
        </section>
    );
}
