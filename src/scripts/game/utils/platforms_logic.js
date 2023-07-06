import {Platform} from "../entities/platform.js";

function getLinkCoordinates(linkElement) {
    const linkRect = linkElement.getBoundingClientRect();
    const {left, top, width, height} = linkRect;
    const x = left + window.pageXOffset;
    const y = top + window.pageYOffset;
    return {x, y, width, height};
}

export function createPlatformsFromLinks() {
    let platforms = [];
    const linkElements = document.querySelectorAll('.links a');
    linkElements.forEach((linkElement) => {
        const {x, y, width} = getLinkCoordinates(linkElement);
        const platform = new Platform(x + 70, y + 90, width / 1.5, 20, linkElement.href);
        platforms.push(platform);
    });
    return platforms;
}
