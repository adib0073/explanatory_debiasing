import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HYB } from './dashboards/hyb.jsx';
import { LandingPage } from './LandingPage.jsx';

export const App = () => {
    const [user, setUser] = useState({ 
        id: ""
    });

    const [updateDash, setUpdateDash] = useState(true);

    return (
        <>
        <style>
            {'body {background-color:#E5E5E5;}'}
        </style>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                    <Route path="/platform" element={<HYB user = {user} updateDash={updateDash} setUpdateDash={setUpdateDash}/>} />
                </Routes>
            </BrowserRouter>
        </>
    );

};