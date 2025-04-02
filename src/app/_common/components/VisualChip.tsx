import React from "react";
import XIcon from "@/app/_common/components/XIcon";

interface VisualChipProps {
    text: string;
}

export default function VisualChip({ text }: VisualChipProps) {
    return (
        <span className="navds-chips__chip navds-chips__removable navds-chips--icon-right non-interactive-chip">
            <span className="navds-chips__chip-text">{text}</span>
            <span className="navds-chips__removable-icon">
                <XIcon />
            </span>
        </span>
    );
}
