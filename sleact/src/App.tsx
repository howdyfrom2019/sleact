import React from 'react';
import './App.css';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Channel from "./pages/Channel";
import DirectMessage from "./pages/DirectMessage";
import Workspace from "./layouts/Worspace/Workspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/signup"} element={<SignUp/>}/>
        {/*<Route path={"/workspace"}>*/}
        {/*  <Route path={":params"} element={<Workspace/>} />*/}
        {/*</Route>*/}
        <Route path={"/workspace"} element={<Workspace />}>
            <Route path={":workspace/channel/:channel"} element={<Workspace/>} />
            <Route path={":workspace/dm/:id"} element={<Workspace/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
