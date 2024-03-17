import {StateMachine} from "./state.js"

export function logMessage(message: string) {
    document.getElementById("message")!.innerText = message;
}

export function appendMessage(message: string) {
    let elem = document.getElementById("message")!;
    let v = elem!.innerText;
    elem!.innerText = v + "\n" + message;
}


export function getCurrRange(): Range | null {
    let selection = window.getSelection();
    if (selection !== null) {
        return selection.getRangeAt(0);
    } else {
        return null;
    }
}


export function getEditingSpaceElem(): HTMLElement {return document.getElementById("editing-space")! as HTMLElement;}
export function focusOnEditingSpace(): void {
    getEditingSpaceElem().focus();
}

export function getLinkTextInputElem(): HTMLInputElement {return document.getElementById("link_input_box_text")! as HTMLInputElement;}
export function getLinkUrlInputElem(): HTMLInputElement {return document.getElementById("link_input_box_link")! as HTMLInputElement;}


// Image Input Section

export function getImageInputElem(): HTMLElement {return document.getElementById("image_input_box")!;}
export function getImageFileInputElem(): HTMLInputElement {return document.getElementById("image_input_file")! as HTMLInputElement;}
export function getImageWidthInputElem(): HTMLInputElement {return document.getElementById("image_input_width")! as HTMLInputElement;}
export function getImageHeightInputElem(): HTMLInputElement {return document.getElementById("image_input_height")! as HTMLInputElement;}

export function getImagePreview(): HTMLElement {return document.getElementById("image_input_box_preview")!;}

// Code Input Section
export function getCodeInputElem(): HTMLElement {return document.getElementById("code_input_box")! as HTMLElement;}
export function getCodeInputLanguage(): HTMLInputElement {return document.getElementById("code_input_language")! as HTMLInputElement;}
export function getCodeInputSourceCode(): HTMLInputElement {return document.getElementById("code_input_source_code")! as HTMLInputElement;}

export let STATE_MACHINE = new StateMachine();