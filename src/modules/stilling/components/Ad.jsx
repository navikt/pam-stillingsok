import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Box, HGrid, Tag } from "@navikt/ds-react";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import { logStillingVisning } from "../../common/tracking/amplitude";
import ShareAd from "./ShareAd";
import Summary from "./Summary";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";

function Ad({ ad, shareAdRedirectUrl }) {
    /**
     * Track page view for all ads
     */
    useEffect(() => {
        if (ad && ad._source && ad._id && ad._source.title) {
            try {
                logStillingVisning(ad);
            } catch (e) {
                // ignore
            }
        }
    }, [ad]);

    return (
        <Box className="container-large" paddingBlock={{ xs: "4 12", md: "16" }}>
            <HGrid as="article" columns={{ xs: 1, lg: "auto 340px" }} gap="16">
                <div>
                    <H1WithAutoFocus className="overflow-wrap-anywhere">{ad._source.title}</H1WithAutoFocus>

                    {ad._source.status !== "ACTIVE" && (
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
                    <HowToApply stilling={ad} showFavouriteButton />
                    <ContactPerson contactList={ad._source.contactList} adId={ad._id} adTitle={ad._source.title} />
                    <ShareAd source={ad._source} shareAdRedirectUrl={shareAdRedirectUrl} />
                    <AdDetails id={ad._id} source={ad._source} />
                </div>
            </HGrid>
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
            }),
        }),
    }).isRequired,
    shareAdRedirectUrl: PropTypes.string.isRequired,
};

export default Ad;
