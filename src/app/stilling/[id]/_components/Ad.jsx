import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, HGrid, Tag } from "@navikt/ds-react";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import ShareAd from "./ShareAd";
import Summary from "./Summary";

function Ad({ ad }) {
    const annonseErAktiv = ad._source.status === "ACTIVE";

    return (
        <Box className="container-large" paddingBlock={{ xs: "4 12", md: "16" }}>
            <article>
                <HGrid columns={{ xs: 1, lg: "auto 340px" }} gap="16">
                    <div>
                        <Heading level="1" size="xlarge" className="overflow-wrap-anywhere" spacing>
                            {ad._source.title}
                        </Heading>

                        {!annonseErAktiv && (
                            <Tag variant="warning-moderate" className="mb-4">
                                Stillingsannonsen er inaktiv.
                            </Tag>
                        )}

                        <Summary stilling={ad._source} />
                        <AdText adText={ad._source.properties.adtext} />
                        <EmployerDetails stilling={ad._source} />
                        <EmploymentDetails stilling={ad._source} />
                    </div>
                    <div>
                        {annonseErAktiv && (
                            <>
                                <HowToApply stilling={ad} showFavouriteButton />
                                <ContactPerson
                                    contactList={ad._source.contactList}
                                    adId={ad._id}
                                    adTitle={ad._source.title}
                                />
                                <ShareAd source={ad._source} id={ad._id} />
                            </>
                        )}
                        <AdDetails id={ad._id} source={ad._source} />
                    </div>
                </HGrid>
            </article>
        </Box>
    );
}

Ad.propTypes = {
    ad: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            status: PropTypes.string,
            contactList: PropTypes.array,
            source: PropTypes.string,
            title: PropTypes.string,
            properties: PropTypes.shape({
                adtext: PropTypes.string,
                sourceurl: PropTypes.string,
            }),
        }),
    }).isRequired,
};

export default Ad;
