import { useEffect } from "react";

function removeRobotsMetaTag() {
    let metaRobots = document.querySelector("meta[name=robots]");
    if (metaRobots) {
        document.querySelector("head").removeChild(metaRobots);
    }
}

function addRobotsNoIndexMetaTag() {
    const content = "noindex";
    let metaRobots = document.querySelector("meta[name=robots]");

    if (!metaRobots) {
        metaRobots = document.createElement("meta");
        metaRobots.setAttribute("name", "robots");
        metaRobots.setAttribute("content", content);
        document.querySelector("head").appendChild(metaRobots);
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
