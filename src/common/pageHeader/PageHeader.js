import { Column, Container, Row } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PageHeader.less';

export default function PageHeader({
    backUrl, title, backLabel, isInternalRedirect
}) {
    return (
        <div className="PageHeader">
            <Container className="PageHeader__container">
                <Row className="PageHeader__row">
                    <Column xs="12" sm="3">
                        {backUrl && (
                            <div className="PageHeader__left">
                                {isInternalRedirect ? (
                                    <Link
                                        to={backUrl}
                                        className="PageHeader__back typo-normal lenke no-print"
                                    >
                                        <Chevron type="venstre" className="PageHeader__back__chevron" />
                                        <span className="PageHeader__back__text">
                                            {backLabel || 'Til stillingsøk'}
                                        </span>
                                    </Link>
                                ) : (
                                    <a
                                        href={backUrl}
                                        className="PageHeader__back typo-normal lenke no-print"
                                    >
                                        <Chevron type="venstre" className="PageHeader__back__chevron" />
                                        <span className="PageHeader__back__text">
                                            {backLabel || 'Til stillingsøk'}
                                        </span>
                                    </a>
                                )}
                            </div>
                        )}
                    </Column>
                    <Column xs="12" sm="6">
                        <Sidetittel className="PageHeader__title">{title}</Sidetittel>
                    </Column>
                    <Column xs="12" sm="3" />
                </Row>
            </Container>
        </div>
    );
}

PageHeader.defaultProps = {
    backUrl: undefined,
    backLabel: undefined,
    buttons: undefined,
    isInternalRedirect: true
};

PageHeader.propTypes = {
    backUrl: PropTypes.string,
    backLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    isInternalRedirect: PropTypes.bool
};

