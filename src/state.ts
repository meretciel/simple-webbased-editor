import * as StringUtils from "./StringUtils.js";
import * as common from "./common.js";

export enum State {
    IN_PARAGRAPH,
    TYPING_COMMAND_OR_STAY_IN_PARAGRAPH,
    TYPING_COMMAND,
    ENTERING_LINK_INFO,
}

export enum ActionEvent {
    ENTRY_KEY_PRESS,
    NORMAL_KEY_PRESS,
    PARAGRAPH_UPDATE,
    CLICK,
    SELECT_RANGE,
    START_COMMAND,
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
        }
    }

    toNextState(event: ActionEvent) {
        let prevStateName = State[this.state];
        let eventName = ActionEvent[event];

        if (this.state == State.IN_PARAGRAPH) {
            if (event == ActionEvent.ENTRY_KEY_PRESS) {
                this.inlineCommand = "";
                this.state = State.TYPING_COMMAND_OR_STAY_IN_PARAGRAPH;
            } else if (event == ActionEvent.START_COMMAND) {
                this.inlineCommand = "/"
            }
        } else if (this.state == State.TYPING_COMMAND_OR_STAY_IN_PARAGRAPH) {
            if (event == ActionEvent.START_COMMAND) {
                this.state = State.TYPING_COMMAND
            } else if (event == ActionEvent.PARAGRAPH_UPDATE) {
                this.state = State.IN_PARAGRAPH;
            }

        } else if (this.state == State.TYPING_COMMAND) {

        }
        let currentStateName = State[this.state];

        document.getElementById("state")!.innerText = currentStateName;
        document.getElementById("event")!.innerText = eventName;
        console.log(`StateMachine: received event ${eventName}. Transit from ${prevStateName} to ${currentStateName}. inlineCommand=${this.inlineCommand}`);
    }

    reset_link_input() {
        this.inlineCommand = "";
        this.state = State.IN_PARAGRAPH;
        common.getLinkTextInputElem().value = "";
        common.getLinkUrlInputElem().value = "";
    }
}
