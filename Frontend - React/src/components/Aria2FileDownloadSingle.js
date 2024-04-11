import React, { useState } from "react";

function Aria2FileDownloadSingle(props) {
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

    const [isChecked, setChecked] = useState(false);

    const handleOnChange = ()=>{
        props.functions.callIfChange(fileInfo, !isChecked)
        setChecked(!isChecked)
    }

    const className = "file-status-" + fileInfo.status
                    + " one-file-container"
                    
    const fileDownloadProgress = (
           parseInt(fileInfo.files[0].completedLength) / 
           parseInt(fileInfo.files[0].length)   
           ) * 100
    const fileDownloadProgressRounded = fileDownloadProgress.toFixed(2)

    return (
        <div className={className}>
            <label className="file-checkbox">
                <input onChange={handleOnChange} type="checkbox"></input>
            </label>
            <div className="file-name">
                <span>{fileInfo.bittorrent.info.name}</span>
            </div>
            <div className="file-progress">
                <span>{fileDownloadProgressRounded}%</span>
            </div>
            
            
        </div>
    )
}

export default Aria2FileDownloadSingle;