import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal } from "@navikt/ds-react";
import "./FilterModal.css";
import { XMarkIcon } from "@navikt/aksel-icons";

function FilterModal({ title, children, onCloseClick, numberOfHits, onShowResultClick }) {
    useEffect(() => {
        Modal.setAppElement("#app");
    }, []);

    return (
        <Modal
            className="FilterModal"
            overlayClassName="FilterModal__overlay"
            closeButton={false}
            open={true}
            onClose={onCloseClick}
        >
            <div className="FilterModal__heading">
                <Heading level="1" size="medium">
                    {title}
                </Heading>
                <Button
                    variant="tertiary"
                    onClick={onCloseClick}
                    icon={<XMarkIcon aria-label="Lukk" width="1.5em" height="1.5em" />}
                />
            </div>
            <div className="FilterModal__content">{children}</div>
            <div className="FilterModal__bottom">
                <Button variant="primary" onClick={onShowResultClick}>
                    Vis {numberOfHits} treff
                </Button>
            </div>
        </Modal>
    );
}

FilterModal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired
};

export default FilterModal;
