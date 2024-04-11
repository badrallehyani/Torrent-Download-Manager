import React, { useState } from "react";
import Aria2FileDownloadList from "../components/Aria2FileDownloadList";
import DownloadControls from "../components/DownloadControls";
import AddNewDownloadPopUp from "../components/helper_components/AddNewDownloadPopUp"

function Home() {

    // selected, setSelected is defined here
    // because they need to be shared among
    // two components (DownloadControls, FileDownloadList)
    const [selected, setSelected] = useState([]);
    const [files, setFiles] = useState([]);

    // 
    const [popUpVis, setPopUpVis] = useState(false)
    if(popUpVis){
        return (
            <AddNewDownloadPopUp 
                popUpVisState={[popUpVis, setPopUpVis]}
            />
        )
    }

    return (
        <div>
            <DownloadControls 
                popUpVisState={[popUpVis, setPopUpVis]} 
                selectedState={[selected, setSelected]}
            />

            <Aria2FileDownloadList
                filesState={[files, setFiles]}
                selectedState={[selected, setSelected]}
            />
        </div>
        
    );
}

export default Home;
