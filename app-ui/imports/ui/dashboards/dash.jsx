import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './dash.css'
import axios from 'axios';


export const DASH = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }

    const accuracyChartRef = useRef();

    useEffect(() => {
    }, []);

    return (
        <>
            <NavBar user={user} />
            <div className="dash-container">
                <div className="dash-container-left">
                    <div className="dash-container-left-sec1">
                        System Overview
                    </div>
                    <div className="dash-container-left-sec2">
                        Data Explorer
                    </div>
                    <div className="dash-container-left-sec3">
                        Data Quality Overview
                    </div>
                </div>
                <div className="dash-container-right">
                    <div className="dash-container-right-sec1">
                        Augmentation Controller
                    </div>
                    <div className="dash-container-right-sec2">
                        Generated Data Controller
                    </div>
                </div>
            </div>
        </>
    );
};