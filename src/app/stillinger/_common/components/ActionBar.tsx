import React from "react";
import { BodyShort, Box, HStack, Bleed } from "@navikt/ds-react";
import { EyeIcon, BriefcaseIcon } from "@navikt/aksel-icons";
import { BackgroundColorToken, SurfaceColorToken } from "@navikt/ds-react/esm/layout/utilities/types";

type ActionBarProps = {
    background?: BackgroundColorToken | SurfaceColorToken;
    buttons?: React.ReactNode[];
    title?: string;
    titleIcon?: string;
};
function ActionBar({ background, buttons, title, titleIcon }: ActionBarProps) {
    const renderIcon = (iconType: string | undefined) => {
        switch (iconType) {
            case "briefcase":
                return <BriefcaseIcon aria-hidden="true" height="1.5em" width="1.5em" />;
            default:
                return <EyeIcon aria-hidden="true" height="1.5em" width="1.5em" />;
        }
    };
    return (
        <Bleed marginInline="full">
            <Box background={`${background || "surface-warning-subtle"}`} paddingBlock="4">
                <div className="container-large">
                    <HStack gap={{ xs: "3", md: "3" }} align="center" justify="space-between">
                        <div>
                            <HStack gap="3" align="center">
                                {renderIcon(titleIcon)}

                                <div>
                                    <BodyShort weight="semibold">{`${title || "Forhåndsvisning av annonse"}`}</BodyShort>
                                </div>
                            </HStack>
                        </div>
                        <HStack gap="2">{buttons && buttons.map((button) => button)}</HStack>
                    </HStack>
                </div>
            </Box>
        </Bleed>
    );
}

export default ActionBar;
