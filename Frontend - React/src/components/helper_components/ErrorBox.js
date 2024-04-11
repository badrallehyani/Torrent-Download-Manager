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

            {
                reason === "Token cookie invalid"?
                <Link style={{display: "block"}} to={"/"}>Set Token</Link>
                :
                ""
            }

        </div>
        
    );
}

export default ErrorBox;
