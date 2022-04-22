import { useEffect } from "react";
import { captureMessage } from "@sentry/browser";

function removeRobotsMetaTag() {
    let metaRobots;
    try {
        metaRobots = document.head.querySelector("meta[name=robots]");
        if (metaRobots) {
            document.head.removeChild(metaRobots);
        }
    } catch (e) {
        captureMessage("Error in removeRobotsMetaTag. metaRobots is " + metaRobots);
    }
}

function addRobotsNoIndexMetaTag() {
    try {
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
    } catch (e) {
        captureMessage("Error in addRobotsNoIndexMetaTag");
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
