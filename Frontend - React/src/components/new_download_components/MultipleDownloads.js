import React, { useState } from "react";
import GoBack from "../helper_components/GoBack"

const helper = require("../../helpers/helper")
const addMultipleNewDownloads = helper.requests.addMultipleNewDownloads
const isValidWindowsFolderName = helper.validators.isValidWindowsFolderName
const isTorrentFileURL = helper.validators.isTorrentFileURL

const display = (data) => {
    if (typeof data === "string") {
        alert(data)
    } else {
        alert(JSON.stringify(data))
    }
    console.log(data)
}
const displayError = (data)=>{
    alert("ERROR")
    display(data)
}

function MultipleDownloads(props) {

    // multipleDlVis = Multiple Downloads Visibility
    const [multipleDlVis, setMultipleDlVis] = props.multipleDlVisState

    const [urlsInput, setUrlsInput] = useState("")
    const [folderInput, setFolderInput] = useState("")

    const doneOnClick = async () => {
        if (urlsInput.trim() === "" || folderInput.trim() === "") {
            alert("empty input")
            alert(urlsInput)
            alert(folderInput)
            return
        }

        const urls = urlsInput.split("\n")
        const folderName = folderInput

        // Verifying the folder name. empty folder name is allowed.

        // empty folder name means to download directly in the downloading
        // path. can be useful when downloading Batches.
        if (folderName !== "" & !isValidWindowsFolderName(folderName)) {
            displayError("invalid folder name")
            return
        }

        // Verifying URLs

        // must be a URL
        // must be .torrent

        var emptyLinesCount = 0
        for (var i = 0; i !== urls.length; i++) {
            if (urls[i] === "") {
                emptyLinesCount += 1
                continue
            }

            if (!isTorrentFileURL(urls[i])) {
                displayError("invalid url: " + urls[i])
                return
            }
        }
        if(emptyLinesCount === urls.length){
            alert("empty")
        }

        const response = await addMultipleNewDownloads(urls, folderName)
        display(response)
    }

    return (
        <div>
            <GoBack
                callThis={
                    () => { setMultipleDlVis(false) }
                }
            />
            <div style={{ width: "100%" }}>
                <textarea placeholder="Torrent URLs (Expandable Input)" onChange={
                    (e) => {
                        setUrlsInput(e.target.value)
                    }
                } className="multiple-urls-input">

                </textarea>
            </div>

            <div style={{ width: "100%" }}>
                <input placeholder="Folder Name" onChange={
                    (e) => {
                        setFolderInput(e.target.value)
                    }
                    // it's not a multiple-urls-input. i wanted same properties, so i used same class.
                } className="multiple-urls-input">

                </input>
            </div>




            <button onClick={doneOnClick}>Done</button>
        </div>
    );
}

export default MultipleDownloads;
