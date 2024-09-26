import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, HStack, Label } from "@navikt/ds-react";
import { formatDate } from "@/app/_common/utils/utils";
import "./AdDescriptionList.css";
import joinStringWithSeperator from "@/app/_common/utils/joinStringWithSeperator";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import { RichText } from "@navikt/arbeidsplassen-react";
import parse from "html-react-parser";
import { joinArbeidstider } from "@/app/stilling/[id]/_components/joinArbeidstider";

const options = {
    replace: ({ attribs }) => {
        if (
            attribs &&
            (attribs.id === "arb-serEtter" || attribs.id === "arb-arbeidsoppgaver" || attribs.id === "arb-tilbyr")
        ) {
            // eslint-disable-next-line
            return <></>;
        }
        return attribs;
    },
};

const ExtentEnum = {
    HELTID: "Heltid",
    DELTID: "Deltid",
    HELTID_OG_DELTID: "Heltid_og_Deltid",
    UKJENT: "Ukjent",
};

export default function EmploymentDetails({ adData }) {
    /**
     *  TODO: refactor denne
     *  Blir brukt for FavouritesButton som forventer gammeldags data.
     *  Venter med å refaktorere FavouritesButton for den blir brukt
     *  flere steder
     */
    const stilling = {
        source: adData.source,
        reference: adData.reference,
        title: adData.title,
        status: adData.status,
        locationList: adData.locationList,
        published: adData.published,
        expires: adData.expires,
        properties: {
            jobtitle: adData.jobTitle,
            applicationdue: adData.applicationDue,
            location: adData.location,
            employer: adData.employer.name,
        },
    };

    const getExtent = (data) => {
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
                <FavouritesButton variant="tertiary" id={adData.id} stilling={stilling} />
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
                            <BodyLong>{joinStringWithSeperator(adData.workLanguages, "eller")}</BodyLong>
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

EmploymentDetails.propTypes = {
    adData: PropTypes.shape({
        jobTitle: PropTypes.string,
        positionCount: PropTypes.string,
        startTime: PropTypes.string,
        engagementType: PropTypes.string,
        jobPercentage: PropTypes.string,
        extent: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        workdays: PropTypes.string,
        workHours: PropTypes.string,
        jobArrangement: PropTypes.string,
        workLanguages: PropTypes.array,
        employer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
};
