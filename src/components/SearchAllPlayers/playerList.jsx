import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';
import Modal from './Modal';
//ShowPlayerInformation

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

function PlayerList({ players, title, timeAgo}) {

    const [vehicles, setVehicles] = useState([]);

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredPlayers, setfilteredPlayers] = useState([]);

    const totalPages = Math.ceil((filteredPlayers.length) / itemsPerPage) || 1;

    const handleFirstPage = () => {
        setCurrentPage(1)
    };

    const handleLastPage = () => {
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const currentPlayers = filteredPlayers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {

        let filter = [];
        if(searchBy == "name") {
            filter = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if(searchBy == "license") {
            filter = players.filter(p => p.license.toLowerCase().includes(search.toLowerCase()));
        }

        if(searchBy == "discord") {
            filter = players.filter(p => p.discord.toLowerCase().includes(search.toLowerCase()));
        }

        setfilteredPlayers(filter)
        
    }, [search, searchBy, players]);
    // const [newPlate, setnewPlate] = useState("");

    const { auth } = useAuth();
    const navigate = useNavigate();
    const roles = auth?.role 



    return (
        
        <div className='player-data'>
            <h1><FontAwesomeIcon icon={faUsers} style={{ marginRight: '18px' }} />{title}</h1>
            <div className="search-bar">
                <div className="entries">
                    Show 
                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(e.target.value); setCurrentPage(1); }}>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    entries
                </div>
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder={`Search User by ${searchBy}... `}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="license">License</option>
                        <option value="discord">Discord</option>
                    </select>
                </div>
            </div>
            <div className='table-wrapper'>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Player ID</th>
                            <th>Player Name</th>
                            <th>License (Rockstar License)</th>
                            <th>Discord ID</th>
                            <th>First Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPlayers.length > 0 ? (
                            currentPlayers.map((player, index) => (
                                <tr onClick={() => navigate(`/players/${player.id}`)} key={index}>
                                    <td style={{color: '#4f91ff'}}>
                                        {player.id}
                                    </td>
                                    <td>
                                        {player.name}
                                    </td>
                                    <td>
                                        {player.license}
                                    </td>
                                    <td>
                                        {player.discord}
                                    </td>
                                    <td>
                                        {timeAgo(player.firstJoined)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No data available in table</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button className='controlButton' onClick={handleFirstPage} disabled={currentPage === 1}>{'<<'}</button>
                <button className='controlButton' onClick={handlePreviousPage} disabled={currentPage === 1}>{'<'}</button>
                <span>{currentPage} / {totalPages}</span>
                <button className='controlButton' onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
                <button className='controlButton' onClick={handleLastPage} disabled={currentPage === totalPages}>{'>>'}</button>
            </div>
        </div>
    );
}

export default PlayerList;