import React, { useState } from "react";
import path from "path-browserify";

function Aria2FileDownloadPartOfMulti(props) {
    /*
      when creating a multi file
      it will have many files.
      each file of those, will be
      represented by a component 
      called Aria2FileDownloadPartOfMulti
  
      props: {
          fileInfo:{
              'completedLength': ,
              'index':, 
              'length':, 
              'path':, 
              'selected': true/false, 
              'uris': []
          }
          functions: {
              callIfPartOfMultiChange: callIfPartOfMultiChange
          }
          
      }
  
      */

    const fileInfo = props.fileInfo;

    // these checks is used to skip files. hince "selected == false"
    const [isChecked, setChecked] = useState(props.fileInfo.selected === "false");

    const handleOnChange = () => {
        props.functions.callIfPartOfMultiChange(!isChecked, props);
        setChecked(!isChecked);
    };

    const className =
        "part-of-multi-file-selected-" + fileInfo.selected + " part-of-multi-file";

    const progress =
        (parseInt(fileInfo.completedLength) / parseInt(fileInfo.length)) * 100;
    const progressRounded = progress.toFixed(2);

    const name = path.parse(fileInfo.path).base;
    const key = fileInfo.index;
    return (
        <div key={key} className={className}>
            <div className="empty-10percent-width"></div>

            <label className="file-checkbox">
                <input checked={isChecked} onChange={handleOnChange} type="checkbox"></input>
            </label>

            <div className="file-name-small">
                <span>{name}</span>
            </div>
            <div className="file-progress-small">
                <span>{progressRounded}%</span>
            </div>
        </div>
    );
}

export default Aria2FileDownloadPartOfMulti;
