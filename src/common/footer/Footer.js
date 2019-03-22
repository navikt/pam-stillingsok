/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Footer.less';

const InternalOrExternalLink = ({ href, isInternalLink, children }) => {
    if (isInternalLink) {
        return (
            <Link to={href} className="Footer__links__ul__li__link">
                {children}
            </Link>
        );
    }
    return (
        <a href={href} className="Footer__links__ul__li__link">
            {children}
        </a>
    );
};

InternalOrExternalLink.propTypes = {
    href: PropTypes.string.isRequired,
    isInternalLink: PropTypes.bool.isRequired,
    children: PropTypes.string.isRequired
};

const Footer = ({ useInternalLinks }) => (
    <div className="Footer">
        <div className="Footer__inner">
            <p className="Footer__slogan">Arbeidsmarkedet på ett sted</p>
            <nav className="Footer__links">
                <a className="Footer__logo link" href="https://www.nav.no/Forsiden" title="Gå til nav.no">
                    <i className="Footer__logo__nav-icon" aria-label="NAV logo" />
                </a>
                <ul className="Footer__links__ul">
                    <li className="Footer__links__ul__li">
                        <InternalOrExternalLink isInternalLink={useInternalLinks} href="/kontakt">
                            Kontakt oss
                        </InternalOrExternalLink>
                    </li>
                    <li className="Footer__links__ul__li">
                        <InternalOrExternalLink isInternalLink={useInternalLinks} href="/tilgjengelighet">
                            Tilgjengelighet
                        </InternalOrExternalLink>
                    </li>
                    <li className="Footer__links__ul__li">
                        <InternalOrExternalLink isInternalLink={useInternalLinks} href="/personvern">
                            Personvern
                        </InternalOrExternalLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
);

Footer.propTypes = {
    useInternalLinks: PropTypes.bool
};

Footer.defaultProps = {
    useInternalLinks: false
};

export default Footer;
