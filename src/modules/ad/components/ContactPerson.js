import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Heading, Label, Link as AkselLink } from "@navikt/ds-react";
import { isValidEmail } from "../../../common/components/utils";

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
                        {contact.phone && <BodyLong>{contact.phone}</BodyLong>}
                        {contact.email && (
                            <BodyLong className="JobPosting__overflow">
                                {isValidEmail(contact.email) ? (
                                    <AkselLink rel="nofollow" href={`mailto:${contact.email}`}>
                                        {contact.email}
                                    </AkselLink>
                                ) : (
                                    contact.email
                                )}
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
    contactList: undefined
};

ContactPerson.propTypes = {
    contactList: PropTypes.arrayOf(
        PropTypes.shape({
            person: PropTypes.string,
            title: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string
        })
    )
};
