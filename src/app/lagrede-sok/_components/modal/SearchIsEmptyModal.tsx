import React, { ReactElement } from "react";
import AlertModal from "@/app/_common/components/modals/AlertModal";

interface SearchIsEmptyModalProps {
    onClose: () => void;
}

function SearchIsEmptyModal({ onClose }: SearchIsEmptyModalProps): ReactElement {
    return (
        <AlertModal
            id="search-is-empty-modal"
            onCancel={onClose}
            title="Velg søkekriterier først"
            cancelLabel="Lukk"
            useOnlyCancelButton
        >
            Du må fylle inn søkeord eller kriterier for å kunne lagre.
        </AlertModal>
    );
}

export default SearchIsEmptyModal;
