import * as common from "./common.js";
import {getCurrRange} from "./common.js";






export function submit_link() {
    console.log("click submit button")
    let linkId = Math.random().toString();
    let textElem = common.getLinkTextInputElem();
    let urlElem = common.getLinkUrlInputElem();

    common.logMessage(`Text: ${textElem.value}, Url: ${urlElem.value}`);
    document.getElementById("link_input_box")!.style.display = "none";
    let divElem = document.createElement("div");
    divElem.classList.add("component_link");
    let aElem = document.createElement("a");
    aElem.style.cursor = "pointer";
    aElem.id = linkId;



    divElem.appendChild(aElem);
    divElem.onclick = function() {
        common.setLinkInputToUpdateMode()
        common.displayLinkInputElem();
        let anchors = divElem.getElementsByTagName("a");
        if (anchors.length == 1) {
            common.getLinkTextInputElem().value = anchors[0].innerText;
            common.getLinkUrlInputElem().value = anchors[0].getAttribute("href") ?? "";
        }


        common.getLinkDeleteButton().onclick = function() {delete_link(divElem);}
        common.getLinkUpdateButton().onclick = function() {
            let target = document.getElementById(linkId)!;
            target.innerText = common.getLinkTextInputElem().value;
            target.setAttribute("href", common.getLinkUrlInputElem().value);
            common.setLinkInputToCreationMode();
            common.hideLinkInputElem();
        }


    }

    aElem.href = urlElem.value;
    aElem.innerText = textElem.value;

    let range = common.STATE_MACHINE.lastRange;
    if (range !== null) {
        common.logMessage("Insert the link element.");
        range.insertNode(divElem);
        let offset = range.startOffset;
        let refNode = range.startContainer;
        let currRange = getCurrRange();

        if (currRange != null) {
            // delete /link command in the div
            currRange.setStart(refNode, offset - 5);
            currRange.setEnd(refNode, offset);
            currRange.deleteContents();

            // Move the caret to the end of the link element.
            currRange.setEndAfter(divElem);
            currRange.setStartAfter(divElem);
        }

        common.STATE_MACHINE.reset_link_input();
    } else {
        common.logMessage("Current range is empty");
    }
}

export function cancel_link(): void {
    common.logMessage("cancel link input");
    document.getElementById("link_input_box")!.style.display = "none";

}

export function delete_link(elem: HTMLElement): void {
    common.logMessage("delete link.");
    elem.remove();
    document.getElementById("link_input_box")!.style.display = "none";
}