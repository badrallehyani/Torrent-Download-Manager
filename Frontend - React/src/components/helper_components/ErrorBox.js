import React from "react";
import { Link } from "react-router-dom";

function ErrorBox({reason}) {

    return (
        <div>
            <span>Error </span>
            <span>Reason: </span>

            <span>{
                typeof reason === "string"
                ?
                    reason
                :
                    JSON.stringify(reason)
            }</span>

        </div>
        
    );
}

export default ErrorBox;
