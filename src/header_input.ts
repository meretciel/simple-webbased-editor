

import * as common from "./common.js";

export function submitHeader() {

    let level = common.getHeaderInputHeaderLevel().value;
    let headerLine = common.getHeaderInputHeaderLine().value;

    let range = common.STATE_MACHINE.lastRange!;
    let refNode = range.startContainer;
    let offset = range.startOffset;
    let currentRange = common.getCurrRange()!;

    currentRange.setStart(refNode, offset - 3);
    currentRange.setEnd(refNode, offset);
    currentRange.deleteContents();


    let enclosingElem = document.createElement(level);
    enclosingElem.innerText = headerLine;
    let elemId = Math.random().toString();
    enclosingElem.id = elemId;

    enclosingElem.onclick = function() {
        common.setHeaderInputToUpdateMode();
        common.displayHeaderInputElem();

        let target = document.getElementById(elemId)!;
        common.getHeaderInputHeaderLevel().value = target.tagName;
        common.getHeaderInputHeaderLine().value = target.innerText;

        common.getHeaderInputHeaderLine().onkeydown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();
                common.getHeaderInputUpdateButton().click();
            }
        }

        common.getHeaderInputUpdateButton().onclick = function() {
            // populate existing values.
            // target.tagName = common.getHeaderInputHeaderLevel().value;
            target.innerText = common.getHeaderInputHeaderLine().value;
            common.hideHeaderInputElem();
        }

        common.getHeaderInputDeleteButton().onclick = function() {
            enclosingElem.remove();
            common.setHeaderInputToCreationMode();
            common.hideHeaderInputElem();
        }

    }


    currentRange.insertNode(enclosingElem);
    currentRange.setEndAfter(enclosingElem);
    currentRange.setStartAfter(enclosingElem);

    let spaceNode = document.createTextNode("\n\n");
    currentRange.insertNode(spaceNode);
    currentRange.setEndAfter(spaceNode);
    currentRange.setStartAfter(spaceNode);
    common.hideHeaderInputElem();
    common.focusOnEditingSpace();
}

export function cancelHeader() {
    common.getHeaderInputHeaderLevel().value = "";
    common.getHeaderInputHeaderLine().value = "";
    common.hideHeaderInputElem();
}

