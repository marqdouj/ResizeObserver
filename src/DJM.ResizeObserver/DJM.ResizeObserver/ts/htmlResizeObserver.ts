"use strict";

var resizeObserver: ResizeObserver;

function initialize(dotNetHelper: any) {
    if (resizeObserver) {
        return;
    }

    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                let width: number;
                let height: number;

                // The standard makes contentBoxSize an array...
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                } else {
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

export function observe(id: string, dotNetHelper: any) {
    initialize(dotNetHelper);

    if (resizeObserver) {
        const elem = <Element>document.getElementById(id);
        resizeObserver.observe(elem);
    }
}

export function unobserve(id: string) {
    if (resizeObserver) {
        const elem = <Element>document.getElementById(id);
        resizeObserver.unobserve(elem);
    }
}
