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



export function getLinkTextInputElem(): HTMLInputElement {return document.getElementById("link_input_box_text")! as HTMLInputElement;}
export function getLinkUrlInputElem(): HTMLInputElement {return document.getElementById("link_input_box_link")! as HTMLInputElement;}

export let STATE_MACHINE = new StateMachine();