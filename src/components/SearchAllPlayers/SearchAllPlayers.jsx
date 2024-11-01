import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

import './SearchAllPlayers.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import PlayerData from './Playerdata';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome} from '@fortawesome/free-solid-svg-icons';



function SearchAllPlayers({players , onlinePlayers }) {
    
    // console.log("SearchAllPlayers", players);
    const { auth } = useAuth();
    
    const location = useLocation(); // To get the current URL path
    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    

    if(!players) players = []
    players?.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    // if(!OnlinePlayers) OnlinePlayers = [];

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300); // End transition after loading
    }, [players, onlinePlayers]);

    return (
        <div className="App">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="url-display">
                    <FontAwesomeIcon icon={faHome} className="icon" onClick={() => {navigate('/myDashboard');}}/> 
                    <span className="url-text">{location.pathname}</span>
                </div>
                {/* <br /> */}
                <div className={`canTransition ${isLoading ? 'vanish' : 'appear'}`}>
                    <PlayerData title="All Players" players={players} inGame={onlinePlayers} />
                </div>           
                <br />
            </div>
        </div>
    );
}

export default SearchAllPlayers;