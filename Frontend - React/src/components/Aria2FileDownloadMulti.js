import React, { useState } from "react";
import Aria2FileDownloadPartOfMulti from "./Aria2FileDownloadPartOfMulti";
const sortBasedOnKey = require("../helpers/helper").sortBasedOnKey
const sendSkipFile = require("../helpers/helper").requests.sendSkipFile

function calculateAverageProgress(files) {
    var total = 0;
    var completed = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if(file.selected==="true"){
            total += parseInt(file.length);
            completed += parseInt(file.completedLength);
        }
    }
    return completed / total;
}
const display = (data)=>{
    if(typeof data === "string"){
        alert(data)
    }else{
        alert(JSON.stringify(data))
    }
}
const displayError = display

function Aria2FileDownloadMulti(props) {
    /*
  
      props: {
          fileInfo: {
              gid: ...
  
              bittorrent: {
                  info: {
                      name: ...
                  },
                  mode: "single"/"multi"
              },
              completedLength: 
              dir
              downloadSpeed
              files:[
                  {
                      completedLength: ,
                      index: ,
                      length: 
                      path:
                      selected:
  
                  }
              ],
              status: "paused/..."
              ...
          },
          functions: {
              callIfChange,
              ...
          }
      }
  
      */

    const fileInfo = props.fileInfo;

    // since the files are sorted
    // using the index and not the name/path
    // i am sortnig them using the path
    sortBasedOnKey(fileInfo.files, "path")

    // this handle on change will send this file gid
    // to the fileDownloadList so it can be
    // paused/resumed/deleted
    const [isChecked, setChecked] = useState(false);
    const handleOnChange = () => {
        props.functions.callIfChange(fileInfo, !isChecked);
        setChecked(!isChecked);
    };

    // handling parts of the file (partOfMulti) checkboxes changes
    const initiallySkippedFiles = fileInfo.files.filter( file => file.selected==="false" )
    const [selected, setSelected] = useState(initiallySkippedFiles)
    const callIfPartOfMultiChange = (isChecked, props) => {
        if (isChecked) {
            setSelected([...selected, props.fileInfo]);
        } else {
            setSelected(selected.filter((fileInfo) => fileInfo.index !== props.fileInfo.index));
        }
    };
    // skip selected button onclick
    const skipSelectedOnClick = async ()=>{
        const indexesToBeSkipped = selected.map( s=>s.index )
        const response = await sendSkipFile(fileInfo.gid, indexesToBeSkipped)
        display(response)
    }

    // handling details show/hide and its text
    const [detailsDisplayStyle, setDetailsDisplayStyle] = useState("none");

    const showText = "Show Details";
    const hideText = "Hide Details";
    const [showHideText, setShowHideText] = useState(showText);

    const showHideDetailsOnClick = () => {
        if (detailsDisplayStyle === "none") {
            setDetailsDisplayStyle("block");
            setShowHideText(hideText);
            return;
        }
        setDetailsDisplayStyle("none");
        setShowHideText(showText);
    };

    // setting the class based on the file status
    // so it can get the proper color
    const className = "file-status-" + fileInfo.status + " multi-file-container";

    // calculations
    const averageProgress = calculateAverageProgress(fileInfo.files) * 100;
    const averageProgressRounded = averageProgress.toFixed(2);

    return (
        <div className="multi-file-container-and-its-button-container">
            <div className={className}>
                <label className="file-checkbox">
                    <input onChange={handleOnChange} type="checkbox"></input>
                </label>

                <div className="file-name">
                    <span>{fileInfo.bittorrent.info.name}</span>
                </div>

                <div className="file-progress">
                    <span>
                        {averageProgressRounded}%
                    </span>
                </div>
            </div>

            <div>
                <button onClick={showHideDetailsOnClick}>{showHideText}</button>
            </div>

            <div className="file-content" style={{ display: detailsDisplayStyle }}>

                {fileInfo.files.map( (file)=>{
                    return Aria2FileDownloadPartOfMulti( {
                        fileInfo: file,
                        functions: {
                            callIfPartOfMultiChange: callIfPartOfMultiChange
                        }
                    } )
                } )}

            </div>
            <div style={{ display: detailsDisplayStyle }}>
                <button onClick={skipSelectedOnClick}>Skip Selected</button>
            </div>
        </div>
    );
}

export default Aria2FileDownloadMulti;
