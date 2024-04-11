import React from "react";

import pause from "../static/pause.svg"
import play from "../static/play.svg"
import plus from "../static/plus.svg"
import trash from "../static/trash.svg"

const helper = require("../helpers/helper")
const sendControlRequest = helper.requests.sendControlRequest

function DownloadControls(props) {
    const [selected, setSelected] = props.selectedState;
    const [popUpVis, setPopUpVis] = props.popUpVisState

    const addOnClick = ()=>{
        setPopUpVis(true)
    }

    const pauseOnClick = async ()=>{
        if(selected.length === 0){
            displayError("no selected")
            return
        }

        const selectedGIDs = selected.map(e=>e.gid)
        const response = await sendControlRequest(selectedGIDs, "pause")
        display(response)
    }
    const resumeOnClick = async ()=>{
        if(selected.length === 0){
            displayError("no selected")
            return
        }
        
        const selectedGIDs = selected.map(e=>e.gid)
        const response = await sendControlRequest(selectedGIDs, "unpause")
        display(response)
    }
    const removeDownloadResultOnClick = async ()=>{
        if(selected.length === 0){
            displayError("no selected")
            return
        }

        const selectedGIDs = selected.map(e=>e.gid)
        const response = await sendControlRequest(selectedGIDs, "removeDownloadResult")
        setSelected([])
        display(response)
    }

    const display = (data)=>{
        if(typeof data === "string"){
            alert(data)
        }else{
            alert(JSON.stringify(data))
        }
    }
    const displayError = display


    return (
        <div className="all-controls-container">

            <div className="control-img-container" onClick={addOnClick}>
                <img alt="Add" className="control-img" src={plus}></img>
            </div>

            <div className="control-img-container" onClick={pauseOnClick}>
                <img alt="Pause" className="control-img" src={pause}></img>
            </div>

            <div className="control-img-container" onClick={resumeOnClick}>
                <img alt="Resume" className="control-img" src={play}></img>
            </div>

            <div className="control-img-container" onClick={removeDownloadResultOnClick}>
                <img alt="Remove" className="control-img" src={trash}></img>
            </div>
            
        </div>
    )
}

export default DownloadControls;