import React, { useState } from "react";
import NyaasiSearchAndDownload from "../new_download_components/NyaasiSearchAndDownload";
import MultipleDownloads from "../new_download_components/MultipleDownloads";
import GoBack from "../helper_components/GoBack"

const display = (data)=>{
    if(typeof data === "string"){
        alert(data)
    }else{
        alert(JSON.stringify(data))
    }
}
const displayError = display

const helper = require("../../helpers/helper")

const addNewDownload = helper.requests.addNewDownload
const addMultipleNewDownloads = helper.requests.addMultipleNewDownloads

const isTorrentFileURL = helper.validators.isTorrentFileURL
const isValidWindowsFolderName = helper.validators.isValidWindowsFolderName

function AddNewDownloadPopUp(props) {
    const [popUpVis, setPopUpVis] = props.popUpVisState

    // Download Methods Visibilty States
    const [nyaasiVis, setNyaasiVis] = useState(false)
    const [multipleDlVis, setMultipleDlVis] = useState(false)

    // Add onclicks
    const addOneURLOnClick = async ()=>{
        const torrentURL = prompt("Torrent URL")
        const folderName = prompt("Folder Name")

        if(torrentURL === null || folderName === null){
            displayError("null params")
            return
        }
        
        if(folderName !== "" & !isValidWindowsFolderName(folderName)){
            displayError("invalid folder name")
            return
        }

        if(!isTorrentFileURL(torrentURL)){
            displayError("invalid url")
            return
        }

        const response = await addNewDownload(torrentURL, folderName)
        display(response)
    }

    const addMultiURLsOnClick = ()=>{
        setMultipleDlVis(true)
    }

    const addNyaasiOnClick = ()=>{
        setNyaasiVis(true)
    }

    if(nyaasiVis){
        return <NyaasiSearchAndDownload
            nyaasiVisState = {[nyaasiVis, setNyaasiVis]}
        />
    }
    else if(multipleDlVis){
        return <MultipleDownloads
            multipleDlVisState = {[multipleDlVis, setMultipleDlVis]}
        />
    }

    return (
        <div>
            <GoBack 
                callThis = {
                    ()=>{setPopUpVis(false)}
                }
            />
            
            <div className="download-methods-container">
                <div onClick={addOneURLOnClick} className="download-method-choice">
                    <span>One Torrent URL</span>
                </div>
                <div onClick={addMultiURLsOnClick} className="download-method-choice">
                    <span>Multiple Torrents</span>
                </div>
                <div onClick={addNyaasiOnClick} className="download-method-choice">
                    <span>Nyaa.si Keyword</span>
                </div>
            </div>

        </div>
    );
}

export default AddNewDownloadPopUp;
