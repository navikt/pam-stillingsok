import React from "react";
import PropTypes from "prop-types";
import { Button, Heading, Modal } from "@navikt/ds-react";
import "./FilterModal.css";
import { XMarkIcon } from "@navikt/aksel-icons";
import { formatNumber } from "../../../../common/utils/utils";

function FilterModal({ title, children, onCloseClick, searchResult }) {
    return (
        <Modal
            className="FilterModal"
            closeButton={false}
            overlayClassName="FilterModal__overlay"
            open
            onClose={onCloseClick}
        >
            <section className="flex flex-column flex-grow">
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
                    <Button variant="primary" onClick={onCloseClick}>
                        {searchResult && searchResult.totalAds
                            ? `Vis ${formatNumber(searchResult.totalAds)} treff`
                            : "Vis treff"}
                    </Button>
                </div>
            </section>
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