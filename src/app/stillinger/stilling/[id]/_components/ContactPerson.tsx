import React, { ReactNode } from "react";
import { BodyLong, CopyButton, Heading, HStack, Label } from "@navikt/ds-react";
import { type Contact } from "@/app/stillinger/_common/lib/ad-model/schemas/ad.dto";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type PageProps = {
    adId: string | undefined;
    adTitle: string | null;
    contactList: Contact[] | null;
};
export default function ContactPerson({ contactList, adId }: PageProps): ReactNode {
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
                                    />
                                </HStack>
                            </BodyLong>
                        )}
                        {contact.email && (
                            <BodyLong className="overflow-wrap-anywhere">
                                <HStack gap="2" as="span" wrap={false}>
                                    <AkselNextLink rel="nofollow" href={`mailto:${contact.email}`}>
                                        {contact.email}
                                    </AkselNextLink>
                                    <CopyButton
                                        title="Kopier e-postadresse"
                                        size="xsmall"
                                        copyText={contact.email}
                                        variant="action"
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
