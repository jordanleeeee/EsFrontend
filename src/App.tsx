import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import SearchPage from "./component/SearchPage";
import HomePage from "./component/HomePage";
import AggregationPage from "./component/AggregationPage";

function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} element={<HomePage/>}/>
                    <Route path={"/search"} element={<SearchPage/>}/>
                    <Route path={"/aggregation"} element={<AggregationPage/>}/>
                </Routes>
            </Router>
        </>
    );
}

export default App;
