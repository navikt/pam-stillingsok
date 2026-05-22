import { Box, Heading, HStack } from "@navikt/ds-react";
import LoggedInButtons from "@/app/stillinger/(sok)/_components/loggedInButtons/LoggedInButtons";
import TmpSearchField from "@/app/stillinger/(sok)/_components/searchBox/TmpSearchField";

export default function TmpSearchBox() {
    return (
        <Box paddingBlock={{ xs: "space-0", lg: "space-40 space-0" }}>
            <Box
                paddingInline={{ xs: "space-16", md: "space-32" }}
                paddingBlock={{ xs: "space-16 space-0", md: "space-24 space-0" }}
                borderRadius={{ lg: "8" }}
                maxWidth={{ lg: "800px" }}
                className="search-container bg-brand-green-subtle"
            >
                <HStack justify="space-between" align="center" className="mb-4">
                    <Heading level="1" size="large">
                        Søk etter jobber
                    </Heading>
                    <LoggedInButtons />
                </HStack>

                <TmpSearchField />
            </Box>
        </Box>
    );
}
