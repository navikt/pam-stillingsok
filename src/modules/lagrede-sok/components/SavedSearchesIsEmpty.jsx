import React from "react";
import EmptyMessage from "../../common/components/messages/EmptyMessage";

function SavedSearchesIsEmpty() {
    return (
        <EmptyMessage
            title="Du har ingen lagrede søk"
            text="For å lagre et søk må du fylle inn søkeord eller andre kriterier.
                Du kan deretter lagre søket og motta e-postvarsler med nye treff."
        />
    );
}

SavedSearchesIsEmpty.propTypes = {};

export default SavedSearchesIsEmpty;
