import { HStack, Tag } from "@navikt/ds-react";
import type { AkselColor } from "@navikt/ds-react/types/theme";
import type React from "react";
import { type ApplicationStatus, ApplicationStatusEnum } from "@/app/superrask-soknad/mine-soknader/types";

export function getStatusEmoji(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatusEnum.PENDING:
            return "⏳";
        case ApplicationStatusEnum.ACTIVE:
            return "🔎";
        case ApplicationStatusEnum.REJECTED:
            return "😥";
        case ApplicationStatusEnum.WITHDRAWN:
            return "🛑";
    }
}

export function getStatusLabel(status: ApplicationStatus): string {
    switch (status) {
        case ApplicationStatusEnum.PENDING:
            return "Venter på svar";
        case ApplicationStatusEnum.ACTIVE:
            return "Vurderes";
        case ApplicationStatusEnum.REJECTED:
            return "Dessverre avslått";
        case ApplicationStatusEnum.WITHDRAWN:
            return "Trukket av deg";
    }
}

function getStatusTagColor(status: ApplicationStatus): AkselColor {
    switch (status) {
        case ApplicationStatusEnum.PENDING:
            return "brand-beige";
        case ApplicationStatusEnum.ACTIVE:
            return "success";
        case ApplicationStatusEnum.REJECTED:
        case ApplicationStatusEnum.WITHDRAWN:
            return "neutral";
    }
}

export function getStatusTag(status: ApplicationStatus): React.JSX.Element {
    return (
        <Tag size="small" variant="moderate" data-color={getStatusTagColor(status)}>
            <HStack as="span" gap="space-2">
                <span aria-hidden="true">{getStatusEmoji(status)}</span>
                {getStatusLabel(status)}
            </HStack>
        </Tag>
    );
}
