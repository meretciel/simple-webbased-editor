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

// Link Input Section
export function getLinkInputElem(): HTMLElement {return document.getElementById("link_input_box")!;}
export function hideLinkInputElem(): void {
    getLinkInputElem().style.display = "none";
}

export function displayLinkInputElem(): void {
    getLinkInputElem().style.display = "block";
}

export function setLinkInputToUpdateMode(): void {
    getLinkSubmitButton().style.display = "none";
    getLinkUpdateButton().style.display = "inline-block";
}

export function setLinkInputToCreationMode(): void {
    getLinkSubmitButton().style.display = "inline-block";
    getLinkUpdateButton().style.display = "none";
}

export function getLinkSubmitButton(): HTMLElement {return document.getElementById("link_input_box_submit")!;}
export function getLinkUpdateButton(): HTMLElement {return document.getElementById("link_input_box_update")!;}
export function getLinkDeleteButton(): HTMLElement {return document.getElementById("link_input_box_delete")!;}


// Image Input Section

export function getImageInputElem(): HTMLElement {return document.getElementById("image_input_box")!;}
export function getImageFileInputElem(): HTMLInputElement {return document.getElementById("image_input_file")! as HTMLInputElement;}
export function getImageWidthInputElem(): HTMLInputElement {return document.getElementById("image_input_width")! as HTMLInputElement;}
export function getImageHeightInputElem(): HTMLInputElement {return document.getElementById("image_input_height")! as HTMLInputElement;}

export function getImageUpdateButtonElem(): HTMLElement {return document.getElementById("image_input_box_update")!;}
export function getImageDeleteButtonElem(): HTMLElement {return document.getElementById("image_input_box_delete")!;}

export function setImageInputBoxToUpdateMode() {
    document.getElementById("image_input_box_update")!.style.display = "inline-block";
    document.getElementById("image_input_box_submit")!.style.display = "none";

}

export function setImageInputBoxToCreationMode() {
    document.getElementById("image_input_box_update")!.style.display = "none";
    document.getElementById("image_input_box_submit")!.style.display = "inline-block";
    getImageFileInputElem().value = "";
}

export function displayImageInputBox() {
    getImageInputElem().style.display = "block";
}
export function hideImageInputBox() {
    getImageInputElem().style.display = "none";
}

export function getImagePreview(): HTMLElement {return document.getElementById("image_input_box_preview")!;}

// Code Input Section
export function getCodeInputElem(): HTMLElement {return document.getElementById("code_input_box")! as HTMLElement;}
export function hideCodeInputElem(): void {
    getCodeInputLanguage().value = "";
    getCodeInputSourceCode().value = "";
    getCodeInputElem().style.display = "none";
}
export function displayCodeInputElem(): void { getCodeInputElem().style.display = "inline-block";}

export function getCodeInputLanguage(): HTMLInputElement {return document.getElementById("code_input_language")! as HTMLInputElement;}
export function getCodeInputSourceCode(): HTMLInputElement {return document.getElementById("code_input_source_code")! as HTMLInputElement;}
export function getCodeInputSubmitButton(): HTMLElement {return document.getElementById("code_input_box_submit")!;}
export function getCodeInputUpdateButton(): HTMLElement {return document.getElementById("code_input_box_update")!;}
export function getCodeInputDeleteButton(): HTMLElement {return document.getElementById("code_input_box_delete")!;}


export function setCodeInputToCreationMode() {
    getCodeInputSubmitButton().style.display = "inline-block";
    getCodeInputUpdateButton().style.display = "none";
}

export function setCodeInputToUpdateMode() {
    getCodeInputSubmitButton().style.display = "none";
    getCodeInputUpdateButton().style.display = "inline-block";
}

// Header Input Section
export function getHeaderInputElem(): HTMLElement {return document.getElementById("header_input_box")!;}

export function displayHeaderInputElem() {
    getHeaderInputElem().style.display = "block";
    getHeaderInputHeaderLine().focus();
}

export function hideHeaderInputElem() {
    getHeaderInputHeaderLevel().value = "";
    getHeaderInputHeaderLine().value = "";
    getHeaderInputElem().style.display = "none";
}

export function setHeaderInputToUpdateMode() {
    getHeaderInputSubmitButton().style.display = "none";
    getHeaderInputUpdateButton().style.display = "inline-block";
}

export function setHeaderInputToCreationMode() {
    getHeaderInputSubmitButton().style.display = "inline-block";
    getHeaderInputUpdateButton().style.display = "none";
}

export function getHeaderInputHeaderLine(): HTMLInputElement {return document.getElementById("header_input_header_line")! as HTMLInputElement;}
export function getHeaderInputHeaderLevel(): HTMLInputElement {return document.getElementById("header_input_header_level")! as HTMLInputElement;}
export function getHeaderInputSubmitButton(): HTMLElement {return document.getElementById("header_input_box_submit")!;}
export function getHeaderInputUpdateButton(): HTMLElement {return document.getElementById("header_input_box_update")!;}
export function getHeaderInputDeleteButton(): HTMLElement {return document.getElementById("header_input_box_delete")!;}


export let STATE_MACHINE = new StateMachine();