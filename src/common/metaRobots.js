// Functions to set and remove head meta tag with robot directives

export function setMetaRobotsTag(content) {
    let metaRobots = document.querySelector('meta[name=robots]');

    if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        metaRobots.setAttribute('content', content);
        document.querySelector('head').appendChild(metaRobots);
    } else {
        metaRobots.setAttribute('content', content);
    }
}

export function removeMetaRobotsTag() {
    let metaRobots = document.querySelector('meta[name=robots]');
    if (metaRobots) {
        document.querySelector('head').removeChild(metaRobots);
    }
}
