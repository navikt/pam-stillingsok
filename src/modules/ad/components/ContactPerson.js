import React from "react";
import PropTypes from "prop-types";
import ContactAccordion from "../../favourites/components/ContactAccordion";
import { Heading } from "@navikt/ds-react";

export default function ContactPerson({ contactList }) {
    if (contactList && contactList.length > 1) {
        return (
            <section className="JobPosting__section">
                <Heading level="2" size="medium">
                    Kontaktpersoner for stillingen
                </Heading>
                {contactList.map((contact) => (
                    <ContactAccordion contact={contact} title={contact.name}></ContactAccordion>
                ))}
            </section>
        );
    } else if (contactList && contactList.length == 1) {
        return (
            <section className="JobPosting__section">
                <Heading level="2" size="medium">
                    Kontaktperson for stillingen
                </Heading>
                <dl className="JobPosting__dl">
                    {contactList[0].name && (
                        <React.Fragment>
                            <dt>Kontaktperson</dt>
                            <dd>{contactList[0].name}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].title && (
                        <React.Fragment>
                            <dt>Stillingstittel</dt>
                            <dd>{contactList[0].title}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].phone && (
                        <React.Fragment>
                            <dt>Telefon</dt>
                            <dd>{contactList[0].phone}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].email && (
                        <React.Fragment>
                            <dt>Epost</dt>
                            <dd>
                                <a rel="nofollow" href={`mailto:${contactList[0].email}`}>
                                    {contactList[0].email}
                                </a>
                            </dd>
                        </React.Fragment>
                    )}
                </dl>
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
