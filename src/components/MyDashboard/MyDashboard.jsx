import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

import Sidebar from '../Sidebar';
import Header from '../Header';
import Dashboard from './Dashboard';
import './MyDashboard.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faHome, faBug, faTicket, faCalendar, faHandshake } from '@fortawesome/free-solid-svg-icons';

function MyDashboard() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useLogout();

    const [data, setData] = useState({
        totalReports: 0,
        totalTickets: 0,
        totalPlaytime: '0m',
    });

    const [isLoading, setIsLoading] = useState(false);

    const signOut = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };

        const fetchData = async () => {
            setIsLoading(true); // Start transition
            const totalTickets = await getData('tickets', requirements);
            const totalReports = await getData('reports', requirements);
            const totalPlaytime = await getData('playtime', requirements);
            setData({
                totalPlaytime,
                totalReports,
                totalTickets,
            });
            setTimeout(() => setIsLoading(false), 300); // End transition after loading
        };

        fetchData();

        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, [auth]);

    return (
        <div className="App">
            <Sidebar />
            <Header />
            <div className="main-content">
                <div className="url-display">
                    <FontAwesomeIcon icon={faHome} className="icon" onClick={() => {navigate('/myDashboard');}}/> 
                    <span className="url-text">{location.pathname}</span>
                </div>
                <div className={`canTransition ${isLoading ? 'vanish' : 'appear'}`}>
                    <Dashboard
                        icon = {faDatabase}
                        title="Your Dashboard"
                        description="This dashboard shows all of your data!"
                        stats={[
                            { title: 'Your Reports', value: data.totalReports, icon: faBug },
                            { title: 'Your Tickets', value: data.totalTickets, icon: faTicket },
                            { title: 'Your Play Time', value: data.totalPlaytime, icon: faCalendar },
                        ]}
                    />
                    {/* <br />
                    <Dashboard
                        icon = {faHandshake}
                        title="Your Trustscore"
                        description="This dashboard shows all of your data!"
                        stats={[
                            { title: 'Warns', value: data.totalReports, icon: faBug },
                            { title: 'Kicks', value: data.totalTickets, icon: faTicket },
                            { title: 'Bans', value: data.totalPlaytime, icon: faCalendar },
                        ]}
                    /> */}
                </div>
            </div>
        </div>
    );
}

export default MyDashboard;
