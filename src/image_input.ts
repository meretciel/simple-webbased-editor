
import * as common from "./common.js";
import {getCurrRange} from "./common.js";
export function submitImage() {
    let imageFile = common.getImageFileInputElem().value;
    let files = common.getImageFileInputElem().files;
    let fakeUrl = null;

    if (files !== null) {
        fakeUrl = URL.createObjectURL(files[0]);
    }

    let width = common.getImageWidthInputElem().value;
    let height = common.getImageHeightInputElem().value;
    common.logMessage(`image filename=${imageFile}, width=${width}, height=${height}`);


    if (fakeUrl != null) {
        let enclosingElem = document.createElement("div");
        enclosingElem.classList.add("component_image");
        enclosingElem.setAttribute("image_width", width);
        enclosingElem.setAttribute("image_height", height);
        enclosingElem.onclick = function() {
            let target = common.getImageInputElem();
            target.style.display = "block";
            let prevWidth = target.getAttribute("image_width");
            let prevHeight = target.getAttribute("image_height");
        }

        let elem = document.createElement("img");
        elem.src = fakeUrl;
        elem.style.width = width;
        elem.style.height = height;
        // common.getImagePreview().innerHTML = "";
        // common.getImagePreview().appendChild(elem);

        enclosingElem.appendChild(elem);

        let range = common.STATE_MACHINE.lastRange;
        if (range !== null) {
            common.logMessage("Insert the image element.");
            range.insertNode(enclosingElem);
            let offset = range.startOffset;
            let refNode = range.startContainer;
            let currRange = getCurrRange();

            if (currRange != null) {
                // delete /link command in the div
                currRange.setStart(refNode, offset - 6);
                currRange.setEnd(refNode, offset);
                currRange.deleteContents();

                // Move the caret to the end of the link element.
                currRange.setEndAfter(enclosingElem);
                currRange.setStartAfter(enclosingElem);

                currRange.insertNode(document.createTextNode("\n\n"));
            }

            common.STATE_MACHINE.reset();
        } else {
            common.logMessage("Current range is empty");
        }
    }
}

export function cancelImage() {
    common.getImageInputElem().style.display = "none";
}

