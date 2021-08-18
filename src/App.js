import React from "react";
import {BrowserRouter as Router, Route,} from "react-router-dom";
import MainComponent from "./MainComponent";

export default function App() {
    return(
        <Router>
            <Route
                exact
                path="/:Id?"
                component={MainComponent}
            />
        </Router>

    )
}