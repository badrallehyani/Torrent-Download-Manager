import React, {useState} from "react";
import NoSearchResults from "./NoSearchResults";

const helper = require("../../helpers/helper")
const getNyaasiFiles = helper.requests.getNyaasiFiles
const addMultipleNewDownloads = helper.requests.addMultipleNewDownloads
const isValidWindowsFolderName = helper.validators.isValidWindowsFolderName

const display = (data)=>{
    if(typeof data === "string"){
        alert(data)
    }else{
        alert(JSON.stringify(data))
    }
    console.log(data)
}
const displayError = display


function NyaasiSearchAndDownload(props) {
    const [nyaasiVis, setNyaasiVis] = props.nyaasiVisState
    const [inputValue, setInputValue] = useState("")

    const [reqDone, setReqDone] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [torrentURLs, setTorrentURLs] = useState([])

    const searchOnClick = async () => {
        const keyword = inputValue.trim()
        if(keyword === undefined || keyword === ""){
            alert("invalid input")
            return
        }
        const response = await getNyaasiFiles(keyword)
        if (response.ok) {
            setReqDone(true)
            // mark all results unhidden
            response.responseJSON.map(file=>file.hidden=false)
            // setting
            setSearchResults(response.responseJSON)
            setTorrentURLs(response.responseJSON.map(file=>file.links.torrent_file))
            console.log(response)
        } else {
            console.error("idk")
        }
    }

    const removeURL = (urlToRemove)=>{
        setTorrentURLs(
            torrentURLs.filter(
                (url)=> url !== urlToRemove
            )
        )
    }

    const startOnClick = async (e)=>{
        if(torrentURLs.length < 1){
            display("No URLs")
            return
        }
        const folderName = prompt("Folder Name")
        if(folderName === null){
            displayError("null params")
            return
        }   
        if(folderName !== "" & !isValidWindowsFolderName(folderName)){
            displayError("invalid folder name")
            return
        }
        const response = await addMultipleNewDownloads(torrentURLs, folderName)
        display(response)
    }

    return (
        <div>
            <button onClick={()=>setNyaasiVis(false)}>x</button>
            <div>
                <input 
                    placeholder="Nyaa Keyword"
                    onChange={ (e)=>setInputValue(e.target.value) }
                />
            </div>
            <div>
                <button onClick={searchOnClick}>Search</button>
            </div>

            {
                reqDone?
                searchResults.length > 0?
                <>
                    {
                        searchResults.map((file, index)=>{
                            const fileKey = file.URL.split('/')[4]
                            return (
                                <div key={fileKey} hidden={file.hidden}>
                                    <span>{file.name}</span>
                                    <button 
                                        onClick={(e)=>{
                                            removeURL(file.links.torrent_file)
                                            // hiding the element
                                            searchResults[index].hidden = true
                                        }}>
                                            x
                                    </button>
                                </div>
                            )
                            
                        })
                    }
                    <button onClick={startOnClick}>Start!</button>
                </>
                :
                <NoSearchResults/>
                :
                ""
            }

            
            
            
        </div>
    );
}

export default NyaasiSearchAndDownload;
