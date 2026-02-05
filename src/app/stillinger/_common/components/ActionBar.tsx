import React from "react";
import { BodyShort, Box, HStack, Bleed } from "@navikt/ds-react";
import { EyeIcon, BriefcaseIcon } from "@navikt/aksel-icons";
import { PageBlock } from "@navikt/ds-react/Page";

type ActionBarProps = {
    buttons?: React.ReactNode[];
    title?: string;
    titleIcon?: string;
};
function ActionBar({ buttons, title, titleIcon }: ActionBarProps) {
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
            <Box className="bg-brand-green-soft" paddingBlock="space-16">
                <PageBlock as="div" width="2xl" gutters>
                    <HStack gap={{ xs: "space-12" }} align="center" justify="space-between">
                        <div>
                            <HStack gap="space-12" align="center">
                                {renderIcon(titleIcon)}

                                <div>
                                    <BodyShort weight="semibold">{`${title || "Forhåndsvisning av annonse"}`}</BodyShort>
                                </div>
                            </HStack>
                        </div>
                        <HStack gap="space-8">{buttons && buttons.map((button) => button)}</HStack>
                    </HStack>
                </PageBlock>
            </Box>
        </Bleed>
    );
}

export default ActionBar;
