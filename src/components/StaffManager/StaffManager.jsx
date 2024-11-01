import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

import './StaffManager.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import PlayerData from './Playerdata';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome} from '@fortawesome/free-solid-svg-icons';

function StaffManager({players}) {

    const { auth } = useAuth();

    const navigate = useNavigate();
    const logout = useLogout();
    const location = useLocation();

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    if(!players) players = []
    players.sort((a, b) => a.id - b.id);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300); // End transition after loading
    }, [players]);

    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="url-display">
                    <FontAwesomeIcon icon={faHome} className="icon" onClick={() => {navigate('/myDashboard');}}/>
                    <span className="url-text">{location.pathname}</span>
                </div>
                <div className={`canTransition ${isLoading ? 'vanish' : 'appear'}`}>
                    <PlayerData title="Manage Staff" players={players} />
                </div>
                <br />
            </div>
        </div>
    );
}

export default StaffManager;