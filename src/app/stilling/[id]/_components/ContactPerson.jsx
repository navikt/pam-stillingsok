import React from "react";
import PropTypes from "prop-types";
import { BodyLong, CopyButton, Heading, HStack, Label, Link as AkselLink } from "@navikt/ds-react";
import { isValidEmail } from "@/app/_common/utils/utils";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

function logCopyContactInfoEvent(type, id, title) {
    logAmplitudeEvent("copy contact info", { type, id, title });
}

function logClickEmailEvent(id, title) {
    logAmplitudeEvent("click contact info email", { id, title });
}

export default function ContactPerson({ contactList, adId, adTitle }) {
    if (contactList && contactList.length > 0) {
        return (
            <section className="full-width mb-10">
                <Heading level="2" size="medium">
                    {contactList.length > 1 ? "Kontaktpersoner for stillingen" : "Kontaktperson for stillingen"}
                </Heading>
                {contactList.map((contact) => (
                    <div className="mt-4" key={`${adId}-contact-name`}>
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
                                            if (state) logCopyContactInfoEvent("phone", adId, adTitle);
                                        }}
                                    />
                                </HStack>
                            </BodyLong>
                        )}
                        {contact.email && (
                            <BodyLong className="overflow-wrap-anywhere">
                                <HStack gap="2" as="span" wrap={false}>
                                    {isValidEmail(contact.email) ? (
                                        <AkselLink
                                            rel="nofollow"
                                            href={`mailto:${contact.email}`}
                                            onClick={() => logClickEmailEvent(adId, adTitle)}
                                        >
                                            {contact.email}
                                        </AkselLink>
                                    ) : (
                                        contact.email
                                    )}
                                    <CopyButton
                                        title="Kopier e-postadresse"
                                        size="xsmall"
                                        copyText={contact.email}
                                        variant="action"
                                        onActiveChange={(state) => {
                                            if (state) logCopyContactInfoEvent("email", adId, adTitle);
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

ContactPerson.propTypes = {
    contactList: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            title: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
        }),
    ),
    adId: PropTypes.string,
    adTitle: PropTypes.string,
};
