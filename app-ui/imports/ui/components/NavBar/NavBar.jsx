import React, { useState } from 'react';
import { Route, Routes, Link } from "react-router-dom";
import { Statistic } from 'antd';
import { MenuItems } from "./MenuItems";
import './NavBar.css';
const { Countdown } = Statistic;

export const NavBar = ({ user }) => {
    const [stateClick, setStateClick] = useState(false);

    handleClick = () => {
        setStateClick(!stateClick)
    }

    var phase = user.phase;
    if (phase == null || phase == "") {
        phase = window.localStorage.getItem('phase');
    }

    const deadline = Date.now() + 1000 * 60 * 10; // Dayjs is also OK
    const onFinish = () => {
        console.log('finished!');
    };

    const showAlert = () => {
        window.alert("Are you sure to mark the task as complete?");
    };


    return (
        <nav className='NavBarItems'>
            <h1 className='navbar-logo'>
                <b>Explanatory Debugging</b>
            </h1>
            <div className='menu-icon' onClick={handleClick}>
                <i className={stateClick ? 'fas fa-times' : 'fas fa-bars'}></i>

            </div>
            {(phase != "explore")
                ?
                <ul className={stateClick ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link to={item.url} className={item.cName} onClick={showAlert}>
                                    {item.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                :
                <ul className={stateClick ? 'nav-menu active' : 'nav-menu'}>
                    <li key={"platform"}>
                        <Link to={"/platform"} className="nav-links">
                            {"Dashboard"}
                        </Link>
                    </li>
                </ul>
            }
            {(phase != "explore")
                ?
                <div className='timer'>
                    <Countdown
                        title=""
                        value={deadline}
                        onFinish={onFinish}
                        format="mm:ss"
                        valueStyle={
                            {
                                fontSize: "1.4vw",
                                padding: 0,
                                margin: 0,
                                alignContent: "center",
                                textAlign: "center",
                                color: "#1363DF"
                            }
                        }
                    />
                </div>
                :
                null}
        </nav>
    )

};