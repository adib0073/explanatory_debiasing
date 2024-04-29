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
            <div>
                Under Construction ....
            </div>
        </>
    );
};