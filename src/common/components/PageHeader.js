import { Column, Container, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import './PageHeader.less';
import BackLink from '../../backLink/BackLink';

export default function PageHeader({
    title
}) {
    return (
        <div className="PageHeader">
            <Container className="PageHeader__container">
                <Row className="PageHeader__row">
                    <Column xs="12" sm="3">
                        <div className="PageHeader__left">
                            <BackLink />
                        </div>
                    </Column>
                    <Column xs="12" sm="6">
                        <h1 tabIndex={0} className="PageHeader__title">{title}</h1>
                    </Column>
                    <Column xs="12" sm="3" />
                </Row>
            </Container>
        </div>
    );
}

PageHeader.defaultProps = {
    buttons: undefined
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

