import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_API } from './Constants';
import axios from 'axios';

export const LandingPage = ({ user, setUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        window.localStorage.setItem('userid', user.id);
    }, [user.id]);
    useEffect(() => {
        window.localStorage.setItem('phase', user.phase);
    }, [user.phase]);
    useEffect(() => {
        window.localStorage.setItem('datenow', user.datenow);
    }, [user.datenow]);

    console.log(user);

    const [buttonText, setButtonText] = useState("Not ready yet?");

    const selectedDashType = () => {
        setButtonText("Logging ...");
        console.log(user);

        // Include this when API part is integrated
        axios.post(BASE_API + '/validateusers', {
            UserId: user.id,
            Phase: user.phase,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
                "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
            }
        }).then(function (response) {
            //console.log(response.data);
            if (response.data["StatusCode"]) {
                //navigate('/platform/' + user.cohort);
                navigate('/platform/');
            }
            else {
                console.log("Error reported. Login failed.")
                // TO-DO: Navigate to Error Screen.
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (value) {
            setButtonText("Let's Start");
        }
    };

    const handlePhase = e => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));

        setUser(prevState => ({
            ...prevState,
            ["datenow"]: Date.now()
        }));

        if (value) {
            setButtonText("Let's Start");
        }
    };

    console.log(BASE_API);

    return (<div className="app-container">
        <div className="lp-container">
            <div className="lp-container-inner">
                <h1 className="lp-container-headerfont-1">
                    Explanatory Debiasing
                </h1>
                <br />
                <h1 className="lp-container-headerfont-2">
                    {"An Interactive Explainable Machine Learning Platform"}

                </h1>

                <div className="lp-container-entry">
                    <form onClick={(e) => e.preventDefault()}>
                        <input
                            className="lp-container-entry-input"
                            placeholder={"Enter your username to begin:"}
                            value={user.id}
                            name="id"
                            onChange={handleChange}
                            required />
                        <br />
                        <select className="lp-container-entry-input" defaultValue={'DEFAULT'} name="phase" onChange={handlePhase} required>
                            <option value="DEFAULT" disabled>
                                {"Please select one of the following:"}</option>
                            <option value="phase1">Phase 1</option>
                            <option value="phase2">Phase 2</option>
                            <option value="explore">Explore</option>
                        </select>
                        <br />
                        <button
                            className="lp-container-entry-button"
                            disabled={user.id === ""}
                            type="submit"
                            onClick={selectedDashType}
                        >
                            {buttonText}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div className='video-container'>
            <video autoPlay loop muted>
                <source src="https://github.com/adib0073/HCI_design/blob/main/EXMOS2023/website_bg.mp4?raw=true" type="video/mp4" />
            </video>
        </div>
    </div >
    );

};