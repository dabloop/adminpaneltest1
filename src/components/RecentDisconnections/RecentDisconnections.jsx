import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import useAuth from '../../hooks/useAuth';

import './RecentDisconnections.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import PlayerData from './Playerdata';

function RecentDisconnections({RecentPlayers}) {

    const { auth } = useAuth();

    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                <Header />
                <br />
                <PlayerData title="Recent Disconnections" players={RecentPlayers} />
                <br />
            </div>
        </div>
    );
}

export default RecentDisconnections;