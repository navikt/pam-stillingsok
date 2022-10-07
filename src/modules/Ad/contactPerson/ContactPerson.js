import React from "react";
import PropTypes from "prop-types";
import PersonIcon from "../../../components/Icon/PersonIcon";

export default function ContactPerson({ contactList }) {
    if (contactList && contactList.length > 0) {
        return (
            <section className="JobPosting__section">
                <h2 className="JobPosting__h2">
                    <PersonIcon />
                    Kontaktperson for stillingen
                </h2>
                <dl className="JobPosting__dl">
                    {contactList[0].name && (
                        <React.Fragment>
                            <dt>Kontaktperson:</dt>
                            <dd>{contactList[0].name}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].title && (
                        <React.Fragment>
                            <dt>Stillingstittel:</dt>
                            <dd>{contactList[0].title}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].phone && (
                        <React.Fragment>
                            <dt>Telefon:</dt>
                            <dd>{contactList[0].phone}</dd>
                        </React.Fragment>
                    )}
                    {contactList[0].email && (
                        <React.Fragment>
                            <dt>Epost:</dt>
                            <dd>
                                <a className="link" rel="nofollow" href={`mailto:${contactList[0].email}`}>
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
