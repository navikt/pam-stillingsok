import React, { ReactNode } from "react";
import { BodyLong, CopyButton, Heading, HStack, Label, Link as AkselLink } from "@navikt/ds-react";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { ContactDTO } from "@/app/stilling/_data/types";

function logCopyContactInfoEvent(type: string, id: string | undefined, title: string): void {
    logAmplitudeEvent("copy contact info", { type, id, title });
}

function logClickEmailEvent(id: string | undefined, title: string): void {
    logAmplitudeEvent("click contact info email", { id, title });
}

type PageProps = {
    adId: string | undefined;
    adTitle: string | undefined;
    contactList: ContactDTO[] | undefined;
};
export default function ContactPerson({ contactList, adId, adTitle }: PageProps): ReactNode {
    if (contactList && contactList.length > 0) {
        return (
            <section className="full-width mb-10">
                <Heading level="2" size="medium">
                    {contactList.length > 1 ? "Kontaktpersoner for stillingen" : "Kontaktperson for stillingen"}
                </Heading>
                {contactList.map((contact) => (
                    <div className="mt-4" key={`${adId}-contact-name-${contact.email}-${contact.phone}`}>
                        {contact.name && <Label as="p">{contact.name}</Label>}
                        {contact.title && <BodyLong>{contact.title}</BodyLong>}
                        {contact.phone && (
                            <BodyLong>
                                <HStack gap="2" as="span" wrap={false}>
                                    {contact.phone}
                                    <CopyButton
                                        title="Kopier telefonnummer"
                                        size="xsmall"
                                        copyText={contact.phone}
                                        variant="action"
                                        onActiveChange={(state) => {
                                            if (state && adId && adTitle)
                                                logCopyContactInfoEvent("phone", adId, adTitle);
                                        }}
                                    />
                                </HStack>
                            </BodyLong>
                        )}
                        {contact.email && (
                            <BodyLong className="overflow-wrap-anywhere">
                                <HStack gap="2" as="span" wrap={false}>
                                    <AkselLink
                                        rel="nofollow"
                                        href={`mailto:${contact.email}`}
                                        onClick={() => {
                                            if (adId && adTitle) {
                                                logClickEmailEvent(adId, adTitle);
                                            }
                                        }}
                                    >
                                        {contact.email}
                                    </AkselLink>
                                    <CopyButton
                                        title="Kopier e-postadresse"
                                        size="xsmall"
                                        copyText={contact.email}
                                        variant="action"
                                        onActiveChange={(state) => {
                                            if (state && adId && adTitle)
                                                logCopyContactInfoEvent("email", adId, adTitle);
                                        }}
                                    />
                                </HStack>
                            </BodyLong>
                        )}
                    </div>
                ))}
            </section>
        );
    }
    return null;
}
