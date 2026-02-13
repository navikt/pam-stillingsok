import React from "react";
import { Box, VStack } from "@navikt/ds-react";

type WrapperProps = {
    readonly children: React.ReactNode;
};
function SommerjobbStedVelgerWrapper({ children }: WrapperProps) {
    return (
        <>
            <VStack>
                <Box maxWidth={{ md: "340px" }} width="100%">
                    {children}
                </Box>
            </VStack>
        </>
    );
}

export default SommerjobbStedVelgerWrapper;
