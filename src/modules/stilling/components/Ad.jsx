import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Tag } from "@navikt/ds-react";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import FinnAd from "./FinnAd";
import HowToApply from "./HowToApply";
import "./Ad.css";
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

    const isFinn = ad && ad._source && ad._source.source && ad._source.source.toLowerCase() === "finn";

    return (
        <div className="container-large mb-16 mt-16">
            <article className="JobPosting__flex">
                <div className="JobPosting__left">
                    <H1WithAutoFocus className="overflow-wrap-anywhere">{ad._source.title}</H1WithAutoFocus>

                    {ad._source.status !== "ACTIVE" && (
                        <Tag variant="warning-moderate" className="mb-4">
                            Stillingsannonsen er inaktiv.
                        </Tag>
                    )}

                    {isFinn && <FinnAd stilling={ad} />}

                    {!isFinn && (
                        <>
                            <Summary stilling={ad._source} />
                            <AdText adText={ad._source.properties.adtext} />
                            <EmployerDetails stilling={ad._source} />
                            <EmploymentDetails stilling={ad._source} />
                        </>
                    )}
                </div>

                <div className="JobPosting__right">
                    <HowToApply stilling={ad} showFavouriteButton />
                    {!isFinn && (
                        <ContactPerson contactList={ad._source.contactList} adId={ad._id} adTitle={ad._source.title} />
                    )}
                    {!isFinn && <ShareAd source={ad._source} shareAdRedirectUrl={shareAdRedirectUrl} />}
                    <AdDetails id={ad._id} source={ad._source} />
                </div>
            </article>
        </div>
    );
}

Ad.propTypes = {
    ad: PropTypes.shape({}).isRequired,
    shareAdRedirectUrl: PropTypes.string.isRequired,
};

export default Ad;
