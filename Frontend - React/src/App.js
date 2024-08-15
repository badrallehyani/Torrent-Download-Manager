import "./App.css";
import "./css/main.css";

import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

// Importing Routes
import Home from "./routes/Home"


function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path= "/" exact Component={Home}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
