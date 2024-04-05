import React, { useState } from "react";
import NyaasiSearchAndDownload from "./NyaasiSearchAndDownload";

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
    const [nyaasiVis, setNyaasiVis] = useState(false)

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

    const addMultiURLsOnClick = async () =>{
        const torrentURLs = prompt("Torrent URLs (comma seperated)")
        const folderName = prompt("Folder Name")

        if(folderName === null || torrentURLs === null){
            displayError("null params")
            return
        }   

        if(folderName !== "" & !isValidWindowsFolderName(folderName)){
            displayError("invalid folder name")
            return
        }

        const splittedTorrentURLs = torrentURLs.split(",")
        for(var i = 0; i !== splittedTorrentURLs.length; i++){
            if(splittedTorrentURLs[i] === ""){
                displayError("empty url")
                return
            }
    
            if(!isTorrentFileURL(splittedTorrentURLs[i])){
                displayError("invalid url")
                return
            }
        }

        const response = await addMultipleNewDownloads(splittedTorrentURLs, folderName)
        display(response)
    }
    const addNyaasiOnClick = ()=>{
        setNyaasiVis(true)
    }

    if(nyaasiVis){
        return <NyaasiSearchAndDownload
            nyaasiVisState = {[nyaasiVis, setNyaasiVis]}
        />
    }

    return (
        <div>
            <button onClick={()=>setPopUpVis(false)}>x</button>
            
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
