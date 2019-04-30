import { Column, Container, Row } from 'nav-frontend-grid';
import Chevron from 'nav-frontend-chevron';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PageHeader.less';

export default function PageHeader({
    backUrl, title, backLabel
}) {
    return (
        <div className="PageHeader">
            <Container className="PageHeader__container">
                <Row className="PageHeader__row">
                    <Column xs="12" sm="3">
                        {backUrl && (
                            <div className="PageHeader__left">
                                <Link
                                    to={backUrl}
                                    className="PageHeader__back no-print"
                                >
                                    <Chevron type="venstre" className="PageHeader__back__chevron" />
                                    <span className="PageHeader__back__text">
                                        {backLabel || 'Ledige stillinger'}
                                    </span>
                                </Link>
                            </div>
                        )}
                    </Column>
                    <Column xs="12" sm="6">
                        <h1 className="PageHeader__title">{title}</h1>
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
    buttons: undefined
};

PageHeader.propTypes = {
    backUrl: PropTypes.string,
    backLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

