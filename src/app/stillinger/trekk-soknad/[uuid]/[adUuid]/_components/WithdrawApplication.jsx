import React from "react";
import PropTypes from "prop-types";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../../_common/hooks/useFetchReducer";
import SuperraskSoknadAPI from "../../../../stilling/[id]/superrask-soknad/SuperraskSoknadAPI";
import WithdrawApplicationSuccess from "./WithdrawApplicationSuccess";
import WithdrawApplicationConfirmationRequired from "./WithdrawApplicationConfirmationRequired";

function WithdrawApplication({ ad, adUuid, uuid }) {
    const [removeApplicationResponse, removeApplicationDispatch] = useFetchReducer();

    const handleWithDrawClick = async () => {
        removeApplicationDispatch({ type: FetchAction.BEGIN });

        await SuperraskSoknadAPI.withdrawApplication(adUuid, uuid)
            .then((data) => {
                removeApplicationDispatch({ type: FetchAction.RESOLVE, data });
            })
            .catch((error) => {
                removeApplicationDispatch({ type: FetchAction.REJECT, error });
            });
    };

    return (
        <div className="container-small mt-12 mb-12">
            {removeApplicationResponse.status !== FetchStatus.SUCCESS ? (
                <WithdrawApplicationConfirmationRequired
                    handleWithDrawClick={handleWithDrawClick}
                    isDeleting={removeApplicationResponse.status === FetchStatus.IS_FETCHING}
                    hasError={removeApplicationResponse.status === FetchStatus.FAILURE}
                    ad={ad}
                />
            ) : (
                <WithdrawApplicationSuccess />
            )}
        </div>
    );
}

WithdrawApplication.propTypes = {
    adUuid: PropTypes.string,
    uuid: PropTypes.string,
    ad: PropTypes.shape({}),
};

export default WithdrawApplication;
