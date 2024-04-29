import React, { useState } from 'react';
import { Route, Routes, Link } from "react-router-dom"
import { MenuItems } from "./MenuItems";
import './NavBar.css';

export const NavBar = ({ user }) => {
    const [stateClick, setStateClick] = useState(false);

    handleClick = () => {
        setStateClick(!stateClick)
    }

    return (
        <nav className='NavBarItems'>
            <h1 className='navbar-logo'>
                <b>Explanatory Debugging</b>
            </h1>
            <div className='menu-icon' onClick={handleClick}>
                <i className={stateClick ? 'fas fa-times' : 'fas fa-bars'}></i>

            </div>
            <ul className={stateClick ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {

                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.cName}>
                                {item.title}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )

};