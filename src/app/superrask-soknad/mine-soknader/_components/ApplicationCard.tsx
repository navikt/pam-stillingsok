import React from "react";
import { BodyShort, Box, Button, Heading, HStack, Link, Tag } from "@navikt/ds-react";
import styles from "./ApplicationCard.module.css";
import { ExternalLinkIcon, TrashIcon } from "@navikt/aksel-icons";
import NextLink from "next/link";
import { ApplicationStatusEnum, type Application } from "@/app/superrask-soknad/mine-soknader/types";
import { getStatusTag } from "./ApplicationStatusTag";
import { format as formatDateFns } from "date-fns/format";
import { nb } from "date-fns/locale";

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
        <Box
            as="article"
            borderWidth="1"
            borderRadius="12"
            borderColor="neutral-subtle"
            padding={{ xs: "space-16", md: "space-20" }}
            aria-label={`${adTitle}, ${organizationName}`}
        >
            <HStack gap="space-4" wrap className="mb-8">
                <Tag size="small" variant="moderate" data-color="info">
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
                {canOpenDetails ? (
                    <Link as="button" className={styles.asLink} onClick={() => onOpenDetails(application)}>
                        {adTitle}
                    </Link>
                ) : (
                    adTitle
                )}
            </Heading>
            <BodyShort weight="semibold" className="mb-4">
                {organizationName}
            </BodyShort>

            <BodyShort weight="semibold" size="small" textColor="subtle">
                Du søkte {formatDateFns(createdAt, "EEEE d. MMMM", { locale: nb })}
            </BodyShort>

            <HStack justify="space-between" gap="space-8" align="center" wrap className="mt-4">
                <Button
                    variant="tertiary"
                    size="small"
                    icon={<ExternalLinkIcon aria-hidden />}
                    iconPosition="right"
                    as={NextLink}
                    prefetch={false}
                    href={`/stillinger/stilling/${adId}`}
                    target="_blank"
                >
                    Vis annonsen
                </Button>

                {canWithdraw && (
                    <Button
                        variant="tertiary"
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
        </Box>
    );
}
