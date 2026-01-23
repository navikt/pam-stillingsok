import React from "react";
import XIcon from "@/app/_common/components/XIcon";

interface VisualChipProps {
    text: string;
}

export default function VisualChip({ text }: VisualChipProps) {
    return (
        <span className="aksel-chips__chip aksel-chips__removable aksel-chips--icon-right non-interactive-chip">
            <span className="aksel-chips__chip-text">{text}</span>
            <span className="aksel-chips__removable-icon">
                <XIcon />
            </span>
        </span>
    );
}
