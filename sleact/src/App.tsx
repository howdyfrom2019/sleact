import React from 'react';
import './App.css';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Channel from "./pages/Channel";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Login/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/signup"} element={<SignUp/>}/>
                <Route path={"/workspace/channel"} element={<Channel/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
