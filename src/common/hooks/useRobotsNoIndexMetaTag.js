import { useEffect } from "react";

function removeRobotsMetaTag() {
    const metaRobots = document.head.querySelector("meta[name=robots]");
    if (metaRobots) {
        document.head.removeChild(metaRobots);
    }
}

function addRobotsNoIndexMetaTag() {
    const content = "noindex";
    let metaRobots = document.head.querySelector("meta[name=robots]");

    if (!metaRobots) {
        metaRobots = document.createElement("meta");
        metaRobots.setAttribute("name", "robots");
        metaRobots.setAttribute("content", content);
        document.head.appendChild(metaRobots);
    } else {
        metaRobots.setAttribute("content", content);
    }
}

export default (shouldAddNoIndexMetaTag) => {
    useEffect(() => {
        if (shouldAddNoIndexMetaTag) {
            addRobotsNoIndexMetaTag();

            return () => {
                removeRobotsMetaTag();
            };
        }
    }, [shouldAddNoIndexMetaTag]);
};
