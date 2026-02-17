import React, { useCallback } from "react";
import { HStack, LinkCard, Tag, VStack } from "@navikt/ds-react";
import Employer from "@/app/sommerjobb/_components/icons/Employer";
import Location from "@/app/sommerjobb/_components/icons/Location";
import Calendar from "@/app/sommerjobb/_components/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { SOMMERJOBB_KLIKK_ANNONSE } from "@/app/_common/umami/constants";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import DebugItem from "./DebugItem";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import { isNonEmptyString } from "@/app/stillinger/_common/lib/ad-model/transform/coercers";
import { truncateAtWordBoundary } from "@/app/_common/text/truncateAtWordBoundary";
import { formatLocation } from "@/app/_common/geografi/location";
import { useIsDebug } from "@/hooks/useIsDebug";
import { htmlToPlainText } from "@/app/_common/text/htmlToPlainText";
import MetaLine from "@/app/sommerjobb/_components/MetaLine";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps) {
    const isDebug = useIsDebug();
    const link = `/stillinger/stilling/${sommerjobbAd.uuid}`;

    const employerName = sommerjobbAd.employer.name;
    const locationText = formatLocation(sommerjobbAd.location, 3);

    const plainTextDescription = htmlToPlainText(sommerjobbAd.description ?? "");
    const truncatedDescription = truncateAtWordBoundary(plainTextDescription, 185);

    const shortSummary = sommerjobbAd.generatedSearchMetadata?.shortSummary;
    const description = isDebug && shortSummary ? shortSummary : truncatedDescription;

    const deadlineMessage = (() => {
        if (!isNonEmptyString(sommerjobbAd.applicationDue)) {
            return undefined;
        }
        const dueLabel = formatDate(sommerjobbAd.applicationDue);
        return getDeadlineMessage({ dueDateIso: sommerjobbAd.applicationDue, dueLabel });
    })();

    const ariaLabel = [sommerjobbAd.title, employerName, locationText].filter(isNonEmptyString).join(", ");

    const handleClick = useCallback(() => {
        umamiTracking(SOMMERJOBB_KLIKK_ANNONSE, {
            title: sommerjobbAd.title,
            href: link,
        });
    }, [link, sommerjobbAd.title]);

    return (
        <LinkCard aria-label={ariaLabel}>
            <LinkCard.Title as="h3">
                <AkselNextLinkCardAnchor href={link} onClick={handleClick}>
                    {sommerjobbAd.title}
                </AkselNextLinkCardAnchor>
            </LinkCard.Title>

            <LinkCard.Description>{description}</LinkCard.Description>

            <LinkCard.Footer>
                <VStack gap="space-8">
                    <HStack gap="space-8 space-16">
                        {employerName.length > 0 && (
                            <MetaLine icon={<Employer />} label="Arbeidsgiver" value={employerName} />
                        )}

                        {locationText && <MetaLine icon={<Location />} label="Sted" value={locationText} />}
                    </HStack>

                    <HStack align="baseline" justify="start" gap="space-8 space-16">
                        {deadlineMessage && (
                            <MetaLine icon={<Calendar />} label="Søknadsfrist" value={deadlineMessage} />
                        )}
                        {sommerjobbAd.hasSuperraskSoknad && (
                            <Tag size="small" data-color="accent" variant="moderate">
                                Superrask søknad
                            </Tag>
                        )}
                    </HStack>

                    {isDebug && <DebugItem sommerjobbAd={sommerjobbAd} />}
                </VStack>
            </LinkCard.Footer>
        </LinkCard>
    );
}

export default SommerjobbItem;
