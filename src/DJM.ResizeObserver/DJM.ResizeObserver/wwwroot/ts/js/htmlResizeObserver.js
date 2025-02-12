"use strict";
var resizeObserver;
function initialize(dotNetHelper) {
    if (resizeObserver) {
        return;
    }
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                let width;
                let height;
                // The standard makes contentBoxSize an array...
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                }
                else {
                    // ...but old versions of Firefox treat it as a single item
                    width = entry.contentRect.width;
                    height = entry.contentRect.height;
                }
                dotNetHelper.invokeMethodAsync('OnResized', entry.target.id, height, width);
            }
        });
    }
    else {
        console.log('Resize observer not supported!');
    }
}
export function observe(id, dotNetHelper) {
    initialize(dotNetHelper);
    if (resizeObserver) {
        const elem = document.getElementById(id);
        resizeObserver.observe(elem);
    }
}
export function unobserve(id) {
    if (resizeObserver) {
        const elem = document.getElementById(id);
        resizeObserver.unobserve(elem);
    }
}
