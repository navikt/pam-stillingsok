"use client";

import React, { ReactElement, useEffect, useState } from "react";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import Failure from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/Failure";
import Success from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/Success";

export const ShowInterestStatus = {
    NOT_FETCHED: "NOT_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
};

function ShowInterestPage(): ReactElement {
    const [showInterestStatus, setShowInterestStatus] = useState(ShowInterestStatus.NOT_FETCHED);

    useEffect(() => {
        const showInterest = async () => {
            setShowInterestStatus(ShowInterestStatus.IS_FETCHING);

            await new Promise((res) => setTimeout(res, 1000));

            setShowInterestStatus(ShowInterestStatus.SUCCESS);

            /*const headers = await getDefaultHeaders();

            const res = await fetch(`${process.env.DIR_API_URL}/meld_interesse/${id}`, {
                headers: headers,
                next: { revalidate: 30 },
            });

            if (res.ok) {
                setShowInterestStatus(ShowInterestStatus.SUCCESS);
            } else {
                setShowInterestStatus(ShowInterestStatus.FAILURE);
            }
            */
        };

        if (showInterestStatus === ShowInterestStatus.NOT_FETCHED) {
            showInterest();
        }
    }, [showInterestStatus]);

    if (
        showInterestStatus === ShowInterestStatus.IS_FETCHING ||
        showInterestStatus === ShowInterestStatus.NOT_FETCHED
    ) {
        return <LoadingPage />;
    }

    if (showInterestStatus === ShowInterestStatus.FAILURE) {
        return <Failure />;
    }

    return <Success />;
}

export default ShowInterestPage;
