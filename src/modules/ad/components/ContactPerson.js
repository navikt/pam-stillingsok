import React from "react";
import PropTypes from "prop-types";
import PersonIcon from "../../../common/components/icons/PersonIcon";

export default function ContactPerson({contactList}) {
    if (contactList && contactList.length > 0) {
        return (
            <section className="JobPosting__section">
                <h2 className="JobPosting__h2">
                    <PersonIcon/>
                    Kontaktpersoner for stillingen
                </h2>
                {contactList.map(contact =>
                    <dl className="JobPosting__dl">
                        {contact.name && (
                            <React.Fragment>
                                <dt>Kontaktperson:</dt>
                                <dd>{contact.name}</dd>
                            </React.Fragment>
                        )}
                        {contact.title && (
                            <React.Fragment>
                                <dt>Stillingstittel:</dt>
                                <dd>{contact.title}</dd>
                            </React.Fragment>
                        )}
                        {contact.phone && (
                            <React.Fragment>
                                <dt>Telefon:</dt>
                                <dd>{contact.phone}</dd>
                            </React.Fragment>
                        )}
                        {contact.email && (
                            <React.Fragment>
                                <dt>Epost:</dt>
                                <dd>
                                    <a className="link" rel="nofollow" href={`mailto:${contact.email}`}>
                                        {contact.email}
                                    </a>
                                </dd>
                            </React.Fragment>
                        )}

                    </dl>
                )}
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
