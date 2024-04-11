import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

function Login() {
    const cookies = new Cookies();
    
    const setTokenOnClick = () => {
        cookies.set("token", token, { path: "/" });
        alert(`Token Is Set To "${token}"`)
    };

    const [token, setToken] = useState("");

    return (
        <div>
            <h1>Enter Token</h1>
            <div>
                <input
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                    }}
                    placeholder="Token"
                />
                <button onClick={setTokenOnClick}>Set Token</button>
            </div>

            <div>
                <Link to={"/home"}>Go Home</Link>
            </div>

        </div>
    );
}

export default Login;
