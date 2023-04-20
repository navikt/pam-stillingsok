import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import "./StickyBar.css";

function StickyBar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const options = {
                root: null, // The document viewport (default)
                threshold: 1
            };

            const observer = new IntersectionObserver((entries) => {
                setIsVisible(!entries[0].isIntersecting);
            }, options);

            const targetElement = document.getElementById("search-result-count");
            observer.observe(targetElement);

            return () => {
                observer.disconnect();
            };
        } catch (err) {
            // ignore IntersectionObserver error. It may not be supported.
        }
    }, []);

    const handleClick = () => {
        window.scrollTo(0, 0);
        document.getElementById("search-form-fritekst-input").focus();
    };

    if (!isVisible) return null;

    return (
        <div className="StickyBar">
            <Button variant="secondary" onClick={handleClick}>
                Endre søk
            </Button>
        </div>
    );
}

export default StickyBar;
