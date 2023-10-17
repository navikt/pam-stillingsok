import React from "react";
import PropTypes from "prop-types";
import { BodyLong, CopyButton, Heading, HStack, Label, Link as AkselLink, Tooltip } from "@navikt/ds-react";
import { isValidEmail } from "../../common/utils/utils";
import logAmplitudeEvent from "../../common/tracking/amplitude";

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
                    <div className="mt-4">
                        {contact.name && <Label as="p">{contact.name}</Label>}
                        {contact.title && <BodyLong>{contact.title}</BodyLong>}
                        {contact.phone && (
                            <BodyLong>
                                <HStack gap="2" as="span" wrap={false}>
                                    {contact.phone}
                                    <Tooltip content="Kopier telefonnummer">
                                        <CopyButton
                                            size="xsmall"
                                            copyText={contact.phone}
                                            variant="action"
                                            onActiveChange={(state) => {
                                                if (state) logCopyContactInfoEvent("phone", adId, adTitle);
                                            }}
                                        />
                                    </Tooltip>
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
                                    <Tooltip content="Kopier e-postadresse">
                                        <CopyButton
                                            size="xsmall"
                                            copyText={contact.email}
                                            variant="action"
                                            onActiveChange={(state) => {
                                                if (state) logCopyContactInfoEvent("email", adId, adTitle);
                                            }}
                                        />
                                    </Tooltip>
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
            person: PropTypes.string,
            title: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
        }),
    ),
    adId: PropTypes.string,
    adTitle: PropTypes.string,
};
