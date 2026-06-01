import { TrashIcon } from "@navikt/aksel-icons";
import { BodyShort, Button, Heading, HStack, Tag } from "@navikt/ds-react";
import { format as formatDateFns } from "date-fns/format";
import { nb } from "date-fns/locale";
import NextLink from "next/link";
import type React from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { type Application, ApplicationStatusEnum } from "@/app/superrask-soknad/mine-soknader/types";
import { getStatusTag } from "./ApplicationStatusTag";

type ApplicationCardProps = {
    application: Application;
    canOpenDetails: boolean;
    onOpenDetails: (application: Application) => void;
};

export default function ApplicationCard({
    application,
    canOpenDetails,
    onOpenDetails,
}: ApplicationCardProps): React.JSX.Element {
    const { adId, adTitle, organizationName, status, createdAt, removedAt, emailVerified } = application;
    const canWithdraw = status === ApplicationStatusEnum.PENDING || status === ApplicationStatusEnum.ACTIVE;
    const isWithdrawn = status === ApplicationStatusEnum.WITHDRAWN;
    const isRejected = status === ApplicationStatusEnum.REJECTED;

    return (
        <article aria-label={`${adTitle}, ${organizationName}`}>
            <HStack gap="space-4" wrap className="mb-8">
                <Tag size="small" variant="moderate" data-color="accent">
                    Superrask søknad
                </Tag>
                {getStatusTag(status)}
                {!emailVerified && (
                    <Tag size="small" variant="moderate" data-color="neutral">
                        E-posten er ikke bekreftet
                    </Tag>
                )}
            </HStack>

            <Heading level="2" size="small" className="overflow-wrap-anywhere mb-1">
                <AkselNextLink href={`/stillinger/stilling/${adId}`} target="_blank" rel="noopener noreferrer">
                    {adTitle}
                    <span className="visually-hidden"> (Åpner i ny fane)</span>
                </AkselNextLink>
            </Heading>
            <BodyShort weight="semibold" className="mb-4">
                {organizationName}
            </BodyShort>

            <BodyShort weight="semibold" size="small" textColor="subtle">
                Du søkte {formatDateFns(createdAt, "EEEE d. MMMM", { locale: nb })}
            </BodyShort>

            <HStack gap="space-8" align="center" wrap className="mt-4">
                {canOpenDetails && (
                    <Button variant="secondary-neutral" size="small" onClick={() => onOpenDetails(application)}>
                        Vis søknad
                    </Button>
                )}

                {canWithdraw && (
                    <Button
                        variant="tertiary-neutral"
                        size="small"
                        icon={<TrashIcon aria-hidden />}
                        as={NextLink}
                        prefetch={false}
                        href={`/stillinger/trekk-soknad/${application.id}/${application.adId}?from=mine-soknader`}
                    >
                        Trekk søknaden
                    </Button>
                )}
                {isWithdrawn && removedAt && (
                    <BodyShort weight="semibold" size="small" textColor="subtle">
                        Du trakk søknaden {formatDateFns(removedAt, "d. MMMM", { locale: nb })}
                    </BodyShort>
                )}
                {isRejected && removedAt && (
                    <BodyShort weight="semibold" size="small" textColor="subtle">
                        Avslått {formatDateFns(removedAt, "d. MMMM", { locale: nb })}
                    </BodyShort>
                )}
            </HStack>
        </article>
    );
}
