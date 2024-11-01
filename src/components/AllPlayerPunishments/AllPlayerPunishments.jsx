import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

// import './AllPlayerPunishments.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import PlayerData from './Playerdata';

function AllPlayerPunishments({players}) {

    const type = useParams()
    
    let name;
    let singleName
    if(type.punishment == 'bans') name = "Banned", singleName='Ban'
    else if(type.punishment == 'kicks') name = "Kicked", singleName='Kick'
    else if(type.punishment == 'warns') name = "Warrned", singleName='Warn'
    const { auth } = useAuth();

    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    players.sort((a, b) => a.id - b.id);
    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                <Header />
                <br />
                <PlayerData type={singleName} title={`${name} Users`} players={players} />
                <br />
            </div>
        </div>
    );
}

export default AllPlayerPunishments;