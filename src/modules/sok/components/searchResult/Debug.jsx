import React from "react";
import { BodyLong, Heading, HStack, ReadMore, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";

function Debug({ ad }) {
    return (
        <ReadMore header="Metadata" className="mt-2">
            {ad.properties.jobtitle && ad.properties.jobtitle !== "" && (
                <>
                    <Heading level="4" size="xsmall" spacing>
                        ad.properties.jobtitle
                    </Heading>
                    <HStack gap="4" className="mb-8">
                        <BodyLong className="metadata">{ad.properties.jobtitle}</BodyLong>
                    </HStack>
                </>
            )}
            {ad.occupationList && ad.occupationList.length > 0 && (
                <>
                    <Heading level="4" size="xsmall" spacing>
                        ad.occupationList
                    </Heading>
                    <VStack gap="4" className="mb-8">
                        {ad.occupationList &&
                            ad.occupationList.map((occupation) => (
                                <BodyLong className="metadata">
                                    {occupation.level1}: {occupation.level2}
                                </BodyLong>
                            ))}
                    </VStack>
                </>
            )}

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
                        {ad.properties.keywords && <BodyLong className="metadata">{ad.properties.keywords}</BodyLong>}
                    </HStack>
                </>
            )}
        </ReadMore>
    );
}

Debug.propTypes = {
    ad: PropTypes.shape({
        categoryList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, categoryType: PropTypes.string })),
        occupationList: PropTypes.arrayOf(PropTypes.shape({ level1: PropTypes.string, level2: PropTypes.string })),
        properties: {
            keywords: PropTypes.string,
            searchtags: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, score: PropTypes.score })),
        },
    }),
};

export default Debug;
