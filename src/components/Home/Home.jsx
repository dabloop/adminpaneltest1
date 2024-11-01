import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

import './Home.css';
import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import Dashboard from './Dashboard';

function Home() {

    const { auth } = useAuth();

    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOnlinePlayers, setTotalOnlinePlayers] = useState(0);

    const [totalReports, setTotalReports] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);

    
    const [data, setData] = useState([]);



    useEffect(() => {

        const requirements = {discordId: auth.discordId, accessToken: auth?.accessToken}
        const fetchData = async () => {
            const totalPlayers = await getData('players', requirements);
            const totalUsers = await getData('users', requirements);
            const totalCharacters = await getData('characters', requirements);
            const totalTickets = await getData('tickets', requirements);
            const totalReports = await getData('reports', requirements);
            const totalStaff = await getData('staff', requirements);
            setData({
                totalStaff: totalStaff,
                totalReports: totalReports,
                totalTickets: totalTickets,
                totalCharacters: totalCharacters,
                totalUsers: totalUsers,
                totalPlayers: totalPlayers,
            });
        };

        // Fetch data initially
        fetchData();

        // Set up an interval to fetch data every minute (60000ms)
        const intervalId = setInterval(fetchData, 60000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setTotalOnlinePlayers(data.totalPlayers)
        setTotalCharacters(data.totalCharacters)
        setTotalUsers(data.totalUsers)
        setTotalReports(data.totalReports)
        setTotalTickets(data.totalTickets)
        setTotalStaff(data.totalStaff)
    }, [data]);

    // const fetchData = (type, setData) => {
    //     fetch(`http://localhost:4000/getdata?type=${type}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (type === 'reports') {
    //                 setData(data.reports);
    //             } else if (type === 'tickets') {
    //                 setData(data.claims);
    //             } else if (type === 'staff') {
    //                 setData(data.staff);
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // };
    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Dashboard
                    title="Dashboard"
                    description="This dashboard shows all statistics about your server and is the main home page of the admin panel!"
                    stats={[
                        { title: 'Total Characters', value: totalCharacters },
                        { title: 'Total Users', value: totalUsers },
                        { title: 'Total Online Players', value: totalOnlinePlayers },
                    ]}
                />
                <br />
                <br />
                <Dashboard
                    title="Admin Data"
                    description="This dashboard shows all admin data!"
                    stats={[
                        { title: 'Total Reports', value: totalReports },
                        { title: 'Total Tickets', value: totalTickets },
                        { title: 'Total Online Staff', value: totalStaff },
                    ]}
                />
            </div>
        </div>
    );
}

export default Home;