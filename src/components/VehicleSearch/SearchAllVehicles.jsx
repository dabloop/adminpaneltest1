import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

// import './SearchAllPlayers.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import GetVehicles from './getVehicles';



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome} from '@fortawesome/free-solid-svg-icons';

function SearchAllVehicles({ vehicles }) {

    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }



    // players.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    if(!vehicles) vehicles = []

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300); // End transition after loading
    }, [vehicles]);

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
                    <GetVehicles title="Player Vehicles" vehicles={vehicles} />
                </div>
                <br />
            </div>
        </div>
    );
}

export default SearchAllVehicles;