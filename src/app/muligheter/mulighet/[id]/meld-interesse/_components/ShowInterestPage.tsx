"use client";

import React, { ReactElement } from "react";
import Failure from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/Failure";
import Success from "@/app/muligheter/mulighet/[id]/meld-interesse/_components/Success";

type ShowInterestProps = {
    success: boolean;
};

function ShowInterestPage({ success }: ShowInterestProps): ReactElement {
    if (success) return <Success />;
    else return <Failure />;
}

export default ShowInterestPage;
