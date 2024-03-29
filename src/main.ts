import * as common from "./common.js";
import {ActionEvent, State, StateMachine} from "./state.js";

console.log("This is a test")

let PRESSED_KEYS = new Set();

interface ElemRange {
    startIndex: number;
    endIndex: number;
}



class DivElement implements ElemRange {
    elem: Element;
    startIndex: number;
    endIndex: number;

    constructor(elem: Element, startIndex: number, endIndex: number) {
        this.elem = elem;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

}

function divOnChange(event: InputEvent, stateMachine: StateMachine) {

    if (event.inputType === "insertLineBreak") {
        stateMachine.toNextState(ActionEvent.ENTRY_KEY_PRESS);
    } else {
        if (event.data === "/") {
            stateMachine.toNextState(ActionEvent.START_COMMAND);
        } else {
            stateMachine.toNextState(ActionEvent.PARAGRAPH_UPDATE);
            if (event.data !== null) {
                stateMachine.notifyString(event.data);
            }
        }
    }
}

function handleKeyDownEvent(event: KeyboardEvent, stateMachine: StateMachine) {
    common.logMessage(`Pressed key: ${event.key}`);
    if (event.key === "Enter") {
        common.appendMessage("Detected enter key.");
        event.preventDefault();
        stateMachine.toNextState(ActionEvent.ENTRY_KEY_PRESS);

        // let selection = window.getSelection();
        // if (selection !== null) {
        //     let range = selection.getRangeAt(0);
        //     let node = document.createElement("br");
        //     range.insertNode(node);
        //     range.setEndAfter(node);
        //     range.setStartAfter(node);
        // }
    } else if (event.key === "`") {
        stateMachine.toNextState(ActionEvent.APOSTROPHE_KEY_PRESS);
        if (stateMachine.state === State.IN_PARAGRAPH) {
            event.preventDefault();
        }
    } else if (event.key === "b") {
        if (PRESSED_KEYS.has("Control")) {
            event.preventDefault();
            stateMachine.toNextState(ActionEvent.TOGGLE_BOLD)
        }
    } else if (event.key === "Tab") {
        event.preventDefault();
        if (PRESSED_KEYS.has("Shift")) {
            stateMachine.toNextState(ActionEvent.EXIT_LIST_ONE_LEVEL);
        } else {
            stateMachine.toNextState(ActionEvent.TAB_KEY_PRESS);
        }
    }

    PRESSED_KEYS.add(event.key);
}

function handleKeyUpEvent(event: KeyboardEvent, stateMachine: StateMachine) {
    PRESSED_KEYS.delete(event.key);

}

class ContentManager {
    stateMachine: StateMachine;

    constructor(stateMachine: StateMachine) {
        this.stateMachine = stateMachine;
    }

    appendDiv(): void {
        console.log("Append new div.")
        let main = document.getElementById("main");
        if (main === null) {
            console.log("main element is null");
        }
        let elem = document.createElement("div");
        elem.id = "editing-space";
        elem.contentEditable = "true";
        elem.style.minHeight = "1em";
        elem.innerHTML="<br>";
        elem.oninput = (event: InputEvent) => divOnChange(event, this.stateMachine);
        elem.onkeydown = (event: KeyboardEvent) => handleKeyDownEvent(event, this.stateMachine);
        elem.onkeyup = (event: KeyboardEvent) => handleKeyUpEvent(event, this.stateMachine);
        main?.appendChild(elem);
    }
}



let contentManager = new ContentManager(common.STATE_MACHINE);

contentManager.appendDiv();

export function initialization() {

}
