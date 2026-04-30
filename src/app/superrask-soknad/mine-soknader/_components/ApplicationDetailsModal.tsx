import React from "react";
import { BodyLong, BodyShort, Box, Button, Heading, HStack, Label, Modal, Tag, VStack } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ApplicationStatusEnum, type Application, Qualification } from "@/app/superrask-soknad/mine-soknader/types";
import { getStatusTag } from "./ApplicationStatusTag";
import { format as formatDateFns } from "date-fns/format";
import { nb } from "date-fns/locale";
import { AkselColor } from "@navikt/ds-react/types/theme";

type ApplicationDetailModalProps = {
    application: Application;
    onClose: () => void;
};

function getSuccessColorIfAllChecked(qualifications: Qualification[]): { "data-color"?: AkselColor } {
    if (qualifications.length > 0 && qualifications.every((q) => q.checked)) {
        return { "data-color": "success" };
    } else {
        return {};
    }
}

export default function ApplicationDetailsModal({
    application,
    onClose,
}: ApplicationDetailModalProps): React.JSX.Element | null {
    const { adId, adTitle, organizationName, status, qualifications, motivation, contactInfo, createdAt } = application;

    if (
        application.status === ApplicationStatusEnum.REJECTED ||
        application.status === ApplicationStatusEnum.WITHDRAWN ||
        contactInfo === null
    ) {
        return null;
    }

    const checkedQualifications = qualifications.filter((q) => q.checked);
    const uncheckedQualifications = qualifications.filter((q) => !q.checked);
    const qualificationTagExtraProps = getSuccessColorIfAllChecked(qualifications);

    return (
        <Modal open onClose={onClose} header={{ heading: "Din søknad" }} width="medium">
            <Modal.Body>
                <VStack>
                    <AkselNextLink href={`/stillinger/stilling/${adId}`} target="_blank">
                        {adTitle}
                    </AkselNextLink>
                    <Label as="span">{organizationName}</Label>

                    <HStack gap="space-16" align="center" className="mt-8" wrap>
                        <Heading size="small" as="p">
                            {contactInfo.name}
                        </Heading>
                        {getStatusTag(status)}
                    </HStack>

                    <BodyShort size="small" textColor="subtle" weight="semibold" className="mt-2 capitalize">
                        {formatDateFns(createdAt, "EEEE d. MMMM", { locale: nb })}
                    </BodyShort>

                    {motivation && <BodyLong>{motivation}</BodyLong>}

                    {qualifications.length > 0 && (
                        <Tag
                            size="small"
                            variant="moderate"
                            className="mt-3"
                            style={{ alignSelf: "flex-start" }}
                            {...qualificationTagExtraProps}
                        >
                            {checkedQualifications.length} av {qualifications.length} kvalifikasjoner
                        </Tag>
                    )}

                    {checkedQualifications.length > 0 && (
                        <>
                            <Label as="span" className="mt-6">
                                Oppfylte kvalifikasjoner
                            </Label>
                            <ul className="mt-0 mb-0">
                                {checkedQualifications.map((q) => (
                                    <li key={q.label}>{q.label}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {uncheckedQualifications.length > 0 && (
                        <>
                            <Label as="span" className="mt-6">
                                Kvalifikasjoner som ikke er oppfylt
                            </Label>
                            <ul className="mt-0 mb-0">
                                {uncheckedQualifications.map((q) => (
                                    <li key={q.label} className="line-through">
                                        {q.label}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <Box className="bg-brand-green-subtle mt-6" borderRadius="4" padding="space-16">
                        <HStack gap="space-24">
                            <VStack gap="space-4">
                                <Label as="p">Telefonnummer</Label>
                                <BodyShort>{contactInfo.telephone}</BodyShort>
                            </VStack>
                            <VStack gap="space-4">
                                <Label as="p">E-post</Label>
                                <BodyShort>{contactInfo.email}</BodyShort>
                            </VStack>
                        </HStack>
                    </Box>
                </VStack>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="button"
                    variant="secondary"
                    as={Link}
                    prefetch={false}
                    href={`/stillinger/stilling/${adId}`}
                >
                    Gå til annonsen
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    icon={<TrashIcon aria-hidden />}
                    as={Link}
                    prefetch={false}
                    href={`/stillinger/trekk-soknad/${application.id}/${application.adId}?from=mine-soknader`}
                >
                    Trekk søknaden
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
