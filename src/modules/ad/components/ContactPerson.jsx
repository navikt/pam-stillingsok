import React from "react";
import PropTypes from "prop-types";
import { BodyLong, CopyButton, Heading, Label, Link as AkselLink, Tooltip } from "@navikt/ds-react";
import { isValidEmail } from "../../../common/components/utils";
import logAmplitudeEvent from "../../../common/tracking/amplitude";

export default function ContactPerson({ contactList }) {
    if (contactList && contactList.length > 0) {
        return (
            <section className="JobPosting__section">
                <Heading level="2" size="medium">
                    {contactList.length > 1 ? "Kontaktpersoner for stillingen" : "Kontaktperson for stillingen"}
                </Heading>
                {contactList.map((contact) => (
                    <div className="mt-1">
                        {contact.name && <Label as="p">{contact.name}</Label>}
                        {contact.title && <BodyLong>{contact.title}</BodyLong>}
                        {contact.phone && (
                            <BodyLong className="flex">
                                {contact.phone}
                                <Tooltip content="Kopier telefonnummer">
                                    <CopyButton
                                        className="ml-0_5"
                                        size="xsmall"
                                        copyText={contact.phone}
                                        variant="action"
                                        onActiveChange={(state) => {
                                            if (state) logAmplitudeEvent("copy contact info", { type: "phone" });
                                        }}
                                    />
                                </Tooltip>
                            </BodyLong>
                        )}
                        {contact.email && (
                            <BodyLong className="JobPosting__overflow flex">
                                {isValidEmail(contact.email) ? (
                                    <AkselLink rel="nofollow" href={`mailto:${contact.email}`}>
                                        {contact.email}
                                    </AkselLink>
                                ) : (
                                    contact.email
                                )}
                                <Tooltip content="Kopier e-postadresse">
                                    <CopyButton
                                        className="ml-0_5"
                                        size="xsmall"
                                        copyText={contact.email}
                                        variant="action"
                                        onActiveChange={(state) => {
                                            if (state) logAmplitudeEvent("copy contact info", { type: "email" });
                                        }}
                                    />
                                </Tooltip>
                            </BodyLong>
                        )}
                    </div>
                ))}
            </section>
        );
    }
    return null;
}

ContactPerson.defaultProps = {
    contactList: undefined,
};

ContactPerson.propTypes = {
    contactList: PropTypes.arrayOf(
        PropTypes.shape({
            person: PropTypes.string,
            title: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
        }),
    ),
};
