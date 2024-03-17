
import * as common from "./common.js";
import {getCurrRange, getImageInputElem, getImageUpdateButtonElem} from "./common.js";

class ImageRecord {
    filename: string;
    url: string;
    width: string;
    height: string;
    fileList: FileList | null;

    constructor(fileList: FileList | null, filename:string, url:string, width:string = "100%", height:string = "") {
        this.fileList = fileList;
        this.filename = `${filename}`;
        this.url = url;
        this.width = width;
        this.height = height;
    }
}


let IMAGE_RECORDS: Map<string, ImageRecord> = new Map();



export function submitImage() {
    let value = common.getImageFileInputElem().value;
    let files = common.getImageFileInputElem().files;
    let fakeUrl = null;
    let filename = null;

    if (files !== null) {
        fakeUrl = URL.createObjectURL(files[0]);
        filename = files[0].name;
    }

    let width = common.getImageWidthInputElem().value;
    let height = common.getImageHeightInputElem().value;

    console.log(`image value=${value}, width=${width}, height=${height}`);

    if (fakeUrl != null && filename != null) {
        let enclosingElem = document.createElement("div");
        enclosingElem.classList.add("component_image");

        let imageRecord = new ImageRecord(files, filename, fakeUrl, width, height);
        let imageId = Math.random().toString();
        IMAGE_RECORDS.set(imageId, imageRecord);
        enclosingElem.setAttribute("imageId", imageId);

        enclosingElem.onclick = function() {
            let target = common.getImageInputElem();
            common.setImageInputBoxToUpdateMode();
            target.style.display = "block";
            // populate existing values.
            let imageRecord = IMAGE_RECORDS.get(imageId)!;

            common.getImageFileInputElem().files = imageRecord.fileList;
            common.getImageWidthInputElem().value = imageRecord.width;
            common.getImageHeightInputElem().value = imageRecord.height;

            // Set the update handler.
            common.getImageUpdateButtonElem().onclick = function() {

                let newFile = common.getImageFileInputElem().files![0];
                let newUrl = URL.createObjectURL(newFile);
                let newRecord = new ImageRecord(
                    common.getImageFileInputElem().files!,
                    newFile.name,
                    newUrl,
                    common.getImageWidthInputElem().value,
                    common.getImageHeightInputElem().value,
                )

                IMAGE_RECORDS.set(imageId, newRecord);

                console.log(`update image. original url: ${imageRecord.url}, new url: ${newRecord.url}`);
                let imageElement = document.getElementById(imageId)! as HTMLImageElement;

                console.log("existing image element src: " + imageElement.src);
                imageElement.src = newRecord.url;
                imageElement.style.width = newRecord.width;
                imageElement.style.height = newRecord.height;

                common.hideImageInputBox();
            }

            common.getImageDeleteButtonElem().onclick = function() {
                let target = document.getElementById(imageId)!;
                let parent = target.parentNode!; // this is the component_image div
                parent.parentNode!.removeChild(parent);
                IMAGE_RECORDS.delete(imageId);
                common.hideImageInputBox();
            }
        }

        let elem = document.createElement("img");
        elem.src = fakeUrl;
        elem.style.width = width;
        elem.style.height = height;
        elem.id = imageId;
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

                let spaceNode = document.createTextNode("\n\n");
                currRange.insertNode(spaceNode);
                currRange.setEndAfter(spaceNode);
                currRange.setStartAfter(spaceNode);
            }

            common.hideImageInputBox();
            common.focusOnEditingSpace();
            common.STATE_MACHINE.reset();
        } else {
            common.logMessage("Current range is empty");
        }
    }
}

export function cancelImage() {
    common.getImageInputElem().style.display = "none";
}

