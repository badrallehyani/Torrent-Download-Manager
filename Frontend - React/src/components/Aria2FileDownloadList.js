import React, { useState, useEffect } from "react";

import Aria2FileDownloadSingle from "./Aria2FileDownloadSingle";
import Aria2FileDownloadMulti from "./Aria2FileDownloadMulti";

import LoadingFiles from "./helper_components/LoadingFiles";
import EmptyFiles from "./helper_components/EmptyFiles";
import ErrorBox from "./helper_components/ErrorBox";

const fetchFiles = require("../helpers/helper").requests.fetchFiles


function Aria2FileDownloadList(props) {
    /*
      props: {
  
        selectedState: {
            selected: func ,
            setSelected: func ,
        }
  
        filesState:[
            files: [
                {name: , ...}
            ], 
            setFiles: set function
        ],
        
        functions:{
            callIfChange
        }
      }
      */
    const [selected, setSelected] = props.selectedState;
    const callIfChange = (props, isChecked) => {
        if (isChecked) {
            setSelected([...selected, props]);
        } else {
            setSelected(selected.filter((item) => item.gid !== props.gid));
        }
    };


    const [files, setFiles] = props.filesState
    const jsonFileToComponent = (jsonFile) => {
        let key = jsonFile.gid;
        let mode = jsonFile.bittorrent.mode;
        let fileProps = {
            fileInfo: jsonFile,
            functions: {
                callIfChange: callIfChange,
            },
        };
        if (mode === "single") {
            return <Aria2FileDownloadSingle key={key} {...fileProps} />;
        } else if (mode === "multi") {
            return <Aria2FileDownloadMulti key={key} {...fileProps} />;
        } else {
            throw Error("Invalid mode was passed.");
        }
    }

    const [filesRequestIsDone, setFilesRequestIsDone] = useState(false)
    const [errorReason, setErrorReason] = useState("")
    useEffect(() => {
        const UPDATE_TIME = 2000;
        // reqDone flag is used to prevent sending too many requests
        // to the server if the previous request is PENDING
        var reqDone = true
        const fetchAndSet = async () => {
            if(!reqDone)
                return;

            try{
                reqDone = false
                const response = await fetchFiles()

                if(!response.ok){
                    setErrorReason(response.detail)
                }
                else{
                    setFiles(response.files)
                    setErrorReason("")
                }
            }
            catch(error){
                console.error(error)
                setErrorReason("Unable To Fetch Files")
            }
            setFilesRequestIsDone(true)
            reqDone = true
        }

        setInterval(fetchAndSet, UPDATE_TIME);
    }, []);


    if(!filesRequestIsDone){
        return(
            <div>
                <LoadingFiles/>
            </div>
        )
        
    }

    if(errorReason){
        return <ErrorBox reason = {errorReason} />
    }

    if(files.length === 0){
        return <EmptyFiles/>   
    }

    return (
        <div className="files-container">
            {
                files.map( (file)=>jsonFileToComponent(file) ) 
            }
        </div>
    );
}

export default Aria2FileDownloadList;
