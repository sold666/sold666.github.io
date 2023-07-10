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
    const linkCoordinates = [];

    linkElements.forEach((linkElement) => {
        const {x, y, width} = getLinkCoordinates(linkElement);
        linkCoordinates.push({x, y, width, href: linkElement.href});
    });

    linkCoordinates.forEach((coordinates) => {
        const platform = new Platform(coordinates.x + 70, coordinates.y + 90, coordinates.width / 1.5,
            20, coordinates.href);
        platforms.push(platform);
    });
    return platforms;
}
