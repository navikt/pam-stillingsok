import React from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal } from "@navikt/ds-react";
import "./FilterModal.css";
import { formatNumber } from "../../../../common/utils/utils";

function FilterModal({ title, children, onCloseClick, searchResult }) {
    return (
        <Modal className="filter-modal" open onClose={onCloseClick} width="100%">
            <Modal.Header>
                <Heading level="1" size="medium">
                    {title}
                </Heading>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onCloseClick}>
                    {searchResult && searchResult.totalAds
                        ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                        : "Vis treff"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

FilterModal.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    title: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    searchResult: PropTypes.shape({
        totalAds: PropTypes.number,
    }),
};

export default FilterModal;
