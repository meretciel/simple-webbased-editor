import * as StringUtils from "./StringUtils.js";
import * as common from "./common.js";

export enum State {
    IN_PARAGRAPH,
    TYPING_COMMAND_OR_STAY_IN_PARAGRAPH,
    TYPING_COMMAND,
    ENTERING_LINK_INFO,
    INLINE_QUOTE_MODE,
}

export enum ActionEvent {
    ENTRY_KEY_PRESS,
    APOSTROPHE_KEY_PRESS,
    NORMAL_KEY_PRESS,
    PARAGRAPH_UPDATE,
    CLICK,
    SELECT_RANGE,
    START_COMMAND,
    TOGGLE_BOLD,
}



export class StateMachine {
    state: State;
    lastEvent: ActionEvent | null;
    inlineCommand: string | null;
    lastRange: Range | null;


    constructor() {
        this.state = State.IN_PARAGRAPH
        this.lastEvent = null;
        this.inlineCommand = null;
        this.lastRange = null;

    }

    notifyString(s: string) {
        if (!StringUtils.isNullOrEmpty(this.inlineCommand)) {
            this.inlineCommand += s;
        }

        if (this.inlineCommand === '/link') {
            common.logMessage("Captured the /link command.");
            this.state = State.ENTERING_LINK_INFO;
            this.lastRange = common.getCurrRange();

            let linkInputBoxText = document.getElementById("link_input_box_text")! as HTMLInputElement;
            let linkInputBoxLink =document.getElementById("link_input_box_link")! as HTMLInputElement;

            linkInputBoxText.value = "";
            linkInputBoxLink.value = "";
            document.getElementById("link_input_box")!.style.display = "block";

            linkInputBoxText.focus();
        } else if (this.inlineCommand === "/image") {
            common.logMessage("Captured the /image command.");
            this.lastRange = common.getCurrRange();
            common.setImageInputBoxToCreationMode();
            common.displayImageInputBox();

        } else if (this.inlineCommand === "/code") {
            common.logMessage("Captured /code command.");
            this.lastRange = common.getCurrRange();
            common.getCodeInputElem().style.display = "blocK";
        }
    }

    toNextState(event: ActionEvent) {
        let prevStateName = State[this.state];
        let eventName = ActionEvent[event];

        if (this.state == State.IN_PARAGRAPH) {
            if (event == ActionEvent.ENTRY_KEY_PRESS) {
                this.inlineCommand = "";
            } else if (event == ActionEvent.START_COMMAND) {
                this.inlineCommand = "/"
            } else if (event == ActionEvent.APOSTROPHE_KEY_PRESS) {
                this.lastRange = common.getCurrRange();
                this.state = State.INLINE_QUOTE_MODE;
            } else if (event == ActionEvent.TOGGLE_BOLD) {
                this.handleToggleBold();
            }
        } else if (this.state == State.INLINE_QUOTE_MODE) {
            if (event == ActionEvent.APOSTROPHE_KEY_PRESS) {
                this.handleInlineQuote();
                this.state = State.IN_PARAGRAPH;
            }
        }


        let currentStateName = State[this.state];

        document.getElementById("state")!.innerText = currentStateName;
        document.getElementById("event")!.innerText = eventName;
        console.log(`StateMachine: received event ${eventName}. Transit from ${prevStateName} to ${currentStateName}. inlineCommand=${this.inlineCommand}`);
    }

    handleInlineQuote() {
        common.logMessage("Handling inline quote.");
        let currentRange = common.getCurrRange()!;
        let refNode = currentRange.startContainer;
        let startOffset = this.lastRange?.startOffset;

        if (startOffset !== undefined) {
            currentRange.setStart(refNode, startOffset);
            let fragment = currentRange.cloneContents();
            if (fragment.textContent !== null) {
                console.log("text content: |" + fragment.textContent + "|" );
                fragment.textContent = fragment.textContent.slice(1);
            }
            currentRange.deleteContents();
            let elem = document.createElement("code")
            elem.appendChild(fragment);
            currentRange.insertNode(elem);
            currentRange.setEndAfter(elem);
            currentRange.setStartAfter(elem);
        }

    }

    handleToggleBold() {
        console.log("Handle toggle bold.");
        let range = common.getCurrRange();
        if (range !== null) {
            let node = range!.startContainer;
            console.log(`handleToggleBold: node type is ${node.nodeType}, node name is ${node.nodeName}`);
            // In this implementation, we only focus on simple case where the selection is text.



            if (node.nodeType === Node.TEXT_NODE) {

                let refNode = range.startContainer;
                console.log(`Ref node name: ${refNode.nodeName}, parent node name: ${refNode.parentNode!.nodeName}`);
                let parentNode = refNode.parentNode!;

                if (parentNode.nodeType === Node.ELEMENT_NODE && parentNode.nodeName === "B") {
                    console.log("Make selection un-bold.");
                    let boldEnclosingElem = parentNode as HTMLElement;
                    range.setStartBefore(parentNode.parentNode!);
                    range.setEndAfter(parentNode.parentNode!);
                    range.deleteContents();
                    boldEnclosingElem.childNodes.forEach(cn => range.insertNode(cn));

                } else {
                    // In this case, we will make the selection bold.
                    console.log("Make selection bold.");

                    let enclosingElem = document.createElement("div");
                    enclosingElem.classList.add("component_bold");

                    let boldElem = document.createElement("b");
                    let childNodes = node.childNodes;

                    if (childNodes.length == 0) {
                        boldElem.appendChild(range.cloneContents());
                    } else {
                        childNodes.forEach(cn => {
                            console.log("\tchild node name: " + cn.nodeName);
                            boldElem.appendChild(cn);
                        })
                    }

                    enclosingElem.appendChild(boldElem);
                    range!.deleteContents();
                    range!.insertNode(enclosingElem);

                }


            }
        }
    }

    reset_link_input() {
        this.inlineCommand = "";
        this.state = State.IN_PARAGRAPH;
        common.getLinkTextInputElem().value = "";
        common.getLinkUrlInputElem().value = "";
    }

    reset() {
        this.inlineCommand = "";
        this.state = State.IN_PARAGRAPH;
    }
}
