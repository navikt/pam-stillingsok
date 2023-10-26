import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BodyLong, Heading, HStack, Link as AkselLink, ReadMore, Tag } from "@navikt/ds-react";
import { addDays, endOfDay, format as formatDateFns, isSameDay, isValid, parse, parseISO, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Buldings3Icon, ExternalLinkIcon, PinIcon } from "@navikt/aksel-icons";
import getEmployer from "../../../../../server/common/getEmployer";
import getWorkLocation from "../../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../common/environment";
import { formatDate } from "../../../common/utils/utils";

export default function SearchResultItem({ ad, showExpired, favouriteButton, shouldAutoFocus, isDebug }) {
    const location = getWorkLocation(ad.properties.location, ad.locationList);
    const employer = getEmployer(ad);
    const isFinn = ad.source && ad.source.toLowerCase() === "finn";
    const published = formatDate(ad.published);
    const now = new Date();
    // Check against end of day to avoid issues.
    const isPublishedToday = isSameDay(endOfDay(now), endOfDay(parseISO(ad.published)));
    const isPublishedYesterday = isSameDay(endOfDay(subDays(now, 1)), endOfDay(parseISO(ad.published)));
    const isPublishedTwoDaysAgo = isSameDay(endOfDay(subDays(now, 2)), endOfDay(parseISO(ad.published)));
    const hasInterestform = ad.properties.hasInterestform && ad.properties.hasInterestform === "true";
    const jobTitle = ad.properties.jobtitle && ad.title !== ad.properties.jobtitle ? ad.properties.jobtitle : undefined;
    const frist = ad.properties.applicationdue ? formatDate(ad.properties.applicationdue) : undefined;
    const ref = useRef();

    useLayoutEffect(() => {
        if (shouldAutoFocus && ref.current) {
            ref.current.focus({ preventScroll: true });
        }
    }, [shouldAutoFocus]);

    const fristText = () => {
        if (frist.toLowerCase().indexOf("asap") > -1) {
            return "Søk snarest mulig";
        }

        if (frist.toLowerCase().indexOf("snarest") > -1) {
            return "Søk snarest mulig";
        }

        try {
            let dueDateParsed = parseISO(ad.properties.applicationdue);
            if (!isValid(dueDateParsed)) {
                dueDateParsed = parse(ad.properties.applicationdue, "dd.MM.yyyy", new Date());
            }

            if (!isValid(dueDateParsed)) {
                return `Frist: ${frist}`;
            }

            if (isSameDay(now, dueDateParsed)) {
                return "Søk senest i dag";
            }
            if (isSameDay(addDays(now, 1), dueDateParsed)) {
                return "Søk senest i morgen";
            }
            if (isSameDay(addDays(now, 2), dueDateParsed)) {
                return "Søk senest i overmorgen";
            }
            return `Søk senest ${formatDateFns(dueDateParsed, "EEEE d. MMMM", {
                locale: nb,
            })}`;
        } catch (e) {
            return `Frist: ${frist}`;
        }
    };

    return (
        <article
            ref={ref}
            tabIndex={shouldAutoFocus ? -1 : undefined}
            className="mb-12"
            aria-labelledby={`${ad.uuid}-h3 ${ad.uuid}-jobTitle ${ad.uuid}-employer ${ad.uuid}-location`}
        >
            {published && (
                <BodyLong weight="semibold" size="small" textColor="subtle">
                    {isPublishedToday && "Ny i dag"}
                    {isPublishedYesterday && "I går"}
                    {isPublishedTwoDaysAgo && "To dager siden"}
                    {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                </BodyLong>
            )}

            <HStack gap="2" wrap={false} align="center" justify="space-between" className="mb-2">
                <Heading level="3" size="small" className="overflow-wrap-anywhere" id={`${ad.uuid}-h3`}>
                    <LinkToAd stilling={ad} isFinn={isFinn} employer={employer}>
                        {ad.title}
                    </LinkToAd>
                </Heading>
                {favouriteButton}
            </HStack>

            {jobTitle && (
                <BodyLong weight="semibold" id={`${ad.uuid}-jobTitle`} className="mb-4 break-word">
                    {jobTitle}
                </BodyLong>
            )}

            <div className="mb-2">
                {employer && (
                    <HStack gap="2" className="mb-1">
                        <div>
                            <Buldings3Icon width="1.5em" height="1.5em" aria-label="Arbeidsgiver" />
                        </div>
                        <BodyLong id={`${ad.uuid}-employer`}>{employer}</BodyLong>
                    </HStack>
                )}
                {location && (
                    <HStack gap="2" className="mb-1">
                        <div>
                            <PinIcon width="1.5em" height="1.5em" aria-label="Sted" />
                        </div>
                        <BodyLong id={`${ad.uuid}-location`}>{location}</BodyLong>
                    </HStack>
                )}
            </div>

            <HStack gap="4" align="center">
                {showExpired && <Tag variant="warning-moderate">Annonsen er utløpt</Tag>}
                {hasInterestform && <Tag variant="info-moderate">Superrask søknad</Tag>}
                {frist && (
                    <BodyLong weight="semibold" size="small" textColor="subtle">
                        {fristText()}
                    </BodyLong>
                )}
            </HStack>

            {isDebug && (
                <ReadMore header="Metadata" className="mt-2">
                    {ad.categoryList && ad.categoryList.length > 0 && (
                        <>
                            <Heading level="4" size="xsmall" spacing>
                                ad.categoryList
                            </Heading>
                            <HStack gap="4" className="mb-8">
                                {ad.categoryList &&
                                    ad.categoryList.map((category) => (
                                        <BodyLong className="metadata">
                                            {category.name} ({category.categoryType})
                                        </BodyLong>
                                    ))}
                            </HStack>
                        </>
                    )}

                    {ad.properties.searchtags && ad.properties.searchtags.length > 0 && (
                        <>
                            <Heading level="4" size="xsmall" spacing>
                                ad.properties.searchtags
                            </Heading>

                            <HStack gap="4" className="mb-8">
                                {ad.properties.searchtags &&
                                    ad.properties.searchtags.map((tag) => (
                                        <BodyLong className="metadata">
                                            {tag.label} (score {tag.score})
                                        </BodyLong>
                                    ))}
                            </HStack>
                        </>
                    )}

                    {ad.properties.keywords && (
                        <>
                            <Heading level="4" size="xsmall" spacing>
                                ad.properties.keywords
                            </Heading>
                            <HStack gap="4" className="mb-8">
                                {ad.properties.keywords && (
                                    <BodyLong className="metadata">{ad.properties.keywords}</BodyLong>
                                )}
                            </HStack>
                        </>
                    )}
                </ReadMore>
            )}
        </article>
    );
}

SearchResultItem.defaultProps = {
    shouldAutoFocus: false,
};

SearchResultItem.propTypes = {
    ad: PropTypes.shape({
        uuid: PropTypes.string,
        source: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            hasInterestform: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string,
        }),
        locationList: PropTypes.arrayOf(PropTypes.shape({})),
    }).isRequired,
    shouldAutoFocus: PropTypes.bool,
    showExpired: PropTypes.bool,
    favouriteButton: PropTypes.node,
};

function LinkToAd({ children, stilling, isFinn }) {
    if (isFinn) {
        return (
            <AkselLink href={`https://www.finn.no/${stilling.reference}`}>
                {children} <ExternalLinkIcon width="1.125em" height="1.125em" aria-label="Åpnes på Finn" />
            </AkselLink>
        );
    }
    return (
        <AkselLink as={Link} to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`}>
            {children}
        </AkselLink>
    );
}

LinkToAd.propTypes = {
    children: PropTypes.node,
    isFinn: PropTypes.bool,
    stilling: PropTypes.shape({
        reference: PropTypes.string,
        uuid: PropTypes.string,
    }),
};
