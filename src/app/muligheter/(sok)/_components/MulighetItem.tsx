import React, { useCallback } from "react";
import { HStack, LinkCard, Tag, VStack } from "@navikt/ds-react";
import Employer from "@/app/sommerjobb/_components/icons/Employer";
import Location from "@/app/sommerjobb/_components/icons/Location";
import Calendar from "@/app/sommerjobb/_components/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { KLIKK_MULIGHET } from "@/app/_common/umami/constants";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import { isNonEmptyString } from "@/app/stillinger/_common/lib/ad-model/transform/coercers";
import { truncateAtWordBoundary } from "@/app/_common/text/truncateAtWordBoundary";
import { formatLocation } from "@/app/_common/geografi/location";
import { htmlToPlainText } from "@/app/_common/text/htmlToPlainText";
import MetaLine from "@/app/sommerjobb/_components/MetaLine";
import { Mulighet } from "@/app/muligheter/(sok)/_utils/types/Mulighet";

interface MulighetItemProps {
    mulighet: Mulighet;
}

function MulighetItem({ mulighet }: MulighetItemProps) {
    const link = `/muligheter/mulighet/${mulighet.uuid}`;

    const employerName = mulighet.employer.name;
    const locationText = formatLocation(mulighet.location, 3);

    const plainTextDescription = htmlToPlainText(mulighet.description ?? "");
    const truncatedDescription = truncateAtWordBoundary(plainTextDescription, 185);

    const description = truncatedDescription;

    const deadlineMessage = (() => {
        if (!isNonEmptyString(mulighet.applicationDue)) {
            return undefined;
        }
        const dueLabel = formatDate(mulighet.applicationDue);
        return getDeadlineMessage({ dueDateIso: mulighet.applicationDue, dueLabel });
    })();

    const ariaLabel = [mulighet.title, employerName, locationText].filter(isNonEmptyString).join(", ");

    const handleClick = useCallback(() => {
        umamiTracking(KLIKK_MULIGHET, {
            title: mulighet.title,
            href: link,
        });
    }, [link, mulighet.title]);

    return (
        <LinkCard aria-label={ariaLabel} className="muligheter-link-card">
            <LinkCard.Title as="h3">
                <AkselNextLinkCardAnchor href={link} onClick={handleClick}>
                    {mulighet.title}
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

                    {deadlineMessage && <MetaLine icon={<Calendar />} label="Søknadsfrist" value={deadlineMessage} />}
                    <HStack align="baseline" justify="start" gap="space-8 space-16">
                        <Tag size="small" data-color="info" variant="moderate">
                            Kun for registrerte jobbsøkere
                        </Tag>
                    </HStack>
                </VStack>
            </LinkCard.Footer>
        </LinkCard>
    );
}

export default MulighetItem;
