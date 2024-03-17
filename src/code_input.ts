import * as common from "./common.js";
import {getCurrRange, setCodeInputToCreationMode} from "./common.js";

class CodeRecord {
    sourceCode: string;
    language: string;

    constructor(sourceCode: string, language: string) {
        this.sourceCode = sourceCode;
        this.language = language;
    }
}


let SOURCE_CODE_RECORDS: Map<string, CodeRecord> = new Map();

function setCodeElement(target: HTMLDivElement, codeRecord: CodeRecord) {
    target.classList.add("component_code");
    target.classList.add("code-box");
    let lineNumberDiv = document.createElement("div");
    lineNumberDiv.classList.add("line-number");

    let numOfLines = codeRecord.sourceCode.split('\n').length;
    let arr = []

    for (var k = 1; k <= numOfLines; ++k) {
        arr.push(`<b>${k}</b><br/>`);
    }

    lineNumberDiv.innerHTML = arr.join("");
    let content = document.createElement("pre");
    content.style.padding = "0px";

    let codeElem = document.createElement("code");
    codeElem.classList.add("java");
    codeElem.innerText = codeRecord.sourceCode;

    content.appendChild(codeElem);
    target.appendChild(lineNumberDiv);
    target.appendChild(content);
}


export function submitCode() {
    let sourceCode = common.getCodeInputSourceCode().value;
    let sourceCodeId = Math.random().toString();
    let record = new CodeRecord(sourceCode, common.getCodeInputLanguage().value)
    SOURCE_CODE_RECORDS.set(sourceCodeId, record);
    let numOfLines = sourceCode.split('\n').length;

    let enclosingElem = document.createElement("div");
    enclosingElem.id = sourceCodeId;
    setCodeElement(enclosingElem, record);
    // enclosingElem.classList.add("component_code");
    // enclosingElem.classList.add("code-box");
    // enclosingElem.setAttribute("sourceCodeId", sourceCodeId);
    //
    //
    // let lineNumberDiv = document.createElement("div");
    // lineNumberDiv.classList.add("line-number");
    //
    // let arr = []
    //
    // for (var k = 1; k <= numOfLines; ++k) {
    //     arr.push(`<b>${k}</b><br/>`);
    // }
    //
    // lineNumberDiv.innerHTML = arr.join("");
    //
    // let content = document.createElement("pre");
    // content.style.padding = "0px";
    //
    // let codeElem = document.createElement("code");
    // codeElem.classList.add("java");
    // codeElem.id = "code-content-" + sourceCodeId;
    //
    // codeElem.innerText = sourceCode;
    //
    // content.appendChild(codeElem);
    // enclosingElem.appendChild(lineNumberDiv);
    // enclosingElem.appendChild(content);


    enclosingElem.onclick = function() {
        common.setCodeInputToUpdateMode();
        common.displayCodeInputElem();

        // Populate existing value.
        let record = SOURCE_CODE_RECORDS.get(sourceCodeId)!;
        common.getCodeInputLanguage().value = record.language;
        common.getCodeInputSourceCode().value = record.sourceCode;

        common.getCodeInputUpdateButton().onclick = function() {
            let target = document.getElementById(sourceCodeId)! as HTMLDivElement;
            target.innerHTML = "";
            let newRecord = new CodeRecord(common.getCodeInputSourceCode().value, common.getCodeInputLanguage().value);
            setCodeElement(target, newRecord);
            SOURCE_CODE_RECORDS.set(sourceCodeId, newRecord);
            common.setCodeInputToCreationMode();
            common.hideCodeInputElem();
        }
        common.getCodeInputDeleteButton().onclick = function() {
            enclosingElem.remove();
            common.setCodeInputToCreationMode();
            common.hideCodeInputElem();
        }
    }

    let range = common.STATE_MACHINE.lastRange;
    if (range !== null) {
        common.logMessage("Insert the code element.");
        range.insertNode(enclosingElem);
        let offset = range.startOffset;
        let refNode = range.startContainer;
        let currRange = getCurrRange();

        if (currRange != null) {
            // delete /link command in the div
            currRange.setStart(refNode, offset - 5);
            currRange.setEnd(refNode, offset);
            currRange.deleteContents();

            // Move the caret to the end of the link element.
            currRange.setEndAfter(enclosingElem);
            currRange.setStartAfter(enclosingElem);

            let spaceNode = document.createTextNode("\n\n");
            currRange.insertNode(spaceNode);
            currRange.setEndAfter(spaceNode);
            currRange.setStartAfter(spaceNode);

            common.focusOnEditingSpace();
        }

        common.hideCodeInputElem();
        common.STATE_MACHINE.reset();
    } else {
        common.logMessage("Current range is empty");
    }

}


export function cancelCode() {
    let target = common.getCodeInputElem();
    common.getCodeInputSourceCode().value = "";
    common.getCodeInputLanguage().value = "";
    target.style.display = "none";
}