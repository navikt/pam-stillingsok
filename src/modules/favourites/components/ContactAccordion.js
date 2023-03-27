import React, { useState } from "react";
import "./ContactAccordion.css";
import ChevronCollapseIcon from "../../../common/components/icons/ChevronCollapseIcon";
import ChevronExpandIcon from "../../../common/components/icons/ChevronExpandIcon";

const ContactAccordion = ({ title, contact }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <button className="accordion-button" onClick={() => setIsActive(!isActive)}>
                {!isActive ? <ChevronCollapseIcon ariaHidden={true} /> : <ChevronExpandIcon ariaHidden={true} />}
                <h3 className="accordion-title">{title}</h3>
            </button>
            {isActive && (
                <div>
                    {
                        <dl key={contact} className="JobPosting__dl accordion-dl">
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
                                        <a rel="nofollow" href={`mailto:${contact.email}`}>
                                            {contact.email}
                                        </a>
                                    </dd>
                                </React.Fragment>
                            )}
                        </dl>
                    }
                </div>
            )}
        </div>
    );
};

export default ContactAccordion;
