"use client";

import { BodyLong, Box, Chips, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type React from "react";
import { useCallback, useState } from "react";
import {
    type Application,
    type ApplicationStatus,
    ApplicationStatusEnum,
    applicationStatuses,
} from "@/app/superrask-soknad/mine-soknader/types";
import ApplicationCard from "./ApplicationCard";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import { getStatusEmoji, getStatusLabel } from "./ApplicationStatusTag";
import NoApplications from "./NoApplications";

type MineSoknaderPageProps = {
    applications: Application[];
};

function canOpenApplicationDetails(application: Application): boolean {
    return (
        application.contactInfo !== null &&
        application.status !== ApplicationStatusEnum.REJECTED &&
        application.status !== ApplicationStatusEnum.WITHDRAWN
    );
}

export default function MineSoknaderPage({ applications }: MineSoknaderPageProps): React.JSX.Element {
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [activeFilters, setActiveFilters] = useState<Set<ApplicationStatus>>(new Set());

    const handleOpenDetailsModal = useCallback((application: Application) => {
        if (canOpenApplicationDetails(application)) {
            setSelectedApplication(application);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedApplication(null);
    }, []);

    const toggleFilter = useCallback((status: ApplicationStatus) => {
        setActiveFilters((prev) => {
            const next = new Set(prev);
            if (next.has(status)) {
                next.delete(status);
            } else {
                next.add(status);
            }
            return next;
        });
    }, []);

    if (applications.length === 0) {
        return <NoApplications />;
    }

    const filteredApplications =
        activeFilters.size === 0
            ? applications
            : applications.filter((application) => activeFilters.has(application.status));

    return (
        <>
            <PageBlock width="lg" gutters>
                <Heading level="1" size="xlarge" align="center" className="mb-12">
                    Mine søknader
                </Heading>
                <VStack align="center">
                    <Chips aria-label="Filtrer søknader etter status" className="mb-5">
                        {applicationStatuses.map((status) => {
                            const statusLabel = getStatusLabel(status);

                            return (
                                <Chips.Toggle
                                    key={status}
                                    selected={activeFilters.has(status)}
                                    checkmark
                                    onClick={() => toggleFilter(status)}
                                    data-color="accent"
                                    aria-label={statusLabel}
                                >
                                    {`${getStatusEmoji(status)} ${statusLabel}`}
                                </Chips.Toggle>
                            );
                        })}
                    </Chips>
                </VStack>
            </PageBlock>

            <Box className="bg-brand-peach-subtle">
                <PageBlock width="md" gutters>
                    <Box paddingBlock="space-32">
                        <VStack gap="space-20">
                            {filteredApplications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    canOpenDetails={canOpenApplicationDetails(application)}
                                    onOpenDetails={handleOpenDetailsModal}
                                />
                            ))}
                        </VStack>

                        {filteredApplications.length === 0 && activeFilters.size > 0 && (
                            <BodyLong>Ingen søknader samsvarer med valgte filter.</BodyLong>
                        )}

                        {selectedApplication && canOpenApplicationDetails(selectedApplication) && (
                            <ApplicationDetailsModal application={selectedApplication} onClose={handleCloseModal} />
                        )}
                    </Box>
                </PageBlock>
            </Box>
        </>
    );
}
