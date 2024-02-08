import React from "react";
import { BodyLong, Heading, HStack, ReadMore } from "@navikt/ds-react";
import PropTypes from "prop-types";

function Debug({ ad }) {
    return (
        <ReadMore header={`score: ${ad.score.toFixed(2)}`} className="mt-2 monospace">
            {ad.medium !== "" && (
                <>
                    <Heading level="4" size="xsmall" spacing>
                        ad.medium
                    </Heading>
                    <HStack gap="4" className="mb-8">
                        <BodyLong className="metadata">{ad.medium}</BodyLong>
                    </HStack>
                </>
            )}
            {ad.occupationList && ad.occupationList.length > 0 && (
                <>
                    <Heading level="4" size="xsmall" spacing>
                        ad.occupationList
                    </Heading>
                    <HStack gap="4" className="mb-8">
                        {ad.occupationList &&
                            ad.occupationList.map((occupation) => (
                                <BodyLong className="metadata">
                                    {occupation.level1}: {occupation.level2}
                                </BodyLong>
                            ))}
                    </HStack>
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
        medium: PropTypes.string,
        categoryList: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, categoryType: PropTypes.string })),
        occupationList: PropTypes.arrayOf(PropTypes.shape({ level1: PropTypes.string, level2: PropTypes.string })),
        properties: PropTypes.shape({
            keywords: PropTypes.string,
            searchtags: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, score: PropTypes.number })),
        }),
        score: PropTypes.number,
    }),
    score: PropTypes.string,
};

export default Debug;
