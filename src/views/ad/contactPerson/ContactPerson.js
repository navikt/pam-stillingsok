import React from "react";
import PropTypes from "prop-types";
import { Undertittel } from "nav-frontend-typografi";

export default function ContactPerson({ contactList }) {
    if (contactList && contactList.length > 0) {
        return (
            <div className="detail-section">
                <Undertittel className="detail-section__head">
                    <svg
                        aria-hidden="true"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17 7A5 5 0 117 7a5 5 0 0110 0zm2 0A7 7 0 115 7a7 7 0 0114 0zm-6 17v-5h-2v5l-2.778-8.334A11.011 11.011 0 001.182 24h2.041a9.012 9.012 0 013.829-5.52L8.892 24H13zm7.777 0h2.042a11.01 11.01 0 00-7.041-8.334L13 24h2.108l1.84-5.52A9.012 9.012 0 0120.777 24zM13 16v2h-2v-2h2z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    Kontaktperson for stillingen
                </Undertittel>
                <div className="detail-section__body">
                    <dl className="dl-flex typo-normal">
                        {contactList[0].name && [
                            <dt key="dt">Kontaktperson:</dt>,
                            <dd key="dd">{contactList[0].name}</dd>
                        ]}
                        {contactList[0].title && [
                            <dt key="dt">Stillingstittel:</dt>,
                            <dd key="dd">{contactList[0].title}</dd>
                        ]}
                        {contactList[0].phone && [<dt key="dt">Telefon:</dt>, <dd key="dd">{contactList[0].phone}</dd>]}
                        {contactList[0].email && [
                            <dt key="dt">Epost:</dt>,
                            <dd key="dd">
                                <a className="link" rel="nofollow" href={`mailto:${contactList[0].email}`}>
                                    {contactList[0].email}
                                </a>
                            </dd>
                        ]}
                    </dl>
                </div>
            </div>
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
