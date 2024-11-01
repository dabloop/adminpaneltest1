import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import './PlayerData.css';
import useAuth from "../../hooks/useAuth";
import Modal from './Modal';

// Move Charactares array outside of the component
const Charactares = [
    {
        id: 1,
        owner: 'Nickher',
        citizenID: 'LXC22286',
        name: "Bramix Fatass",
        license: 'asdjaskd',
        discord: 12938192389123,
        lastConnection: 1,
    }
];

function PlayerData({ title, players }) {

    const auth = useAuth();
    const roles = auth?.auth?.roles;
    const role = roles[0];

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filteredPlayers = players.filter(player =>
        player[searchBy].toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
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

    return (
        <div>
            <div className='player-data'>
                <h1>{title}</h1>
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
                            <option value="role">Role</option>
                            <option value="discord">Discord</option>
                        </select>
                    </div>
                </div>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Player ID</th>
                            <th>Player Name</th>
                            <th>License (Rockstar License)</th>
                            <th>Discord ID</th>
                            <th>Disconnected at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPlayers.length > 0 ? (
                            currentPlayers.map((player, index) => (
                                <tr key={index}>
                                    <td>
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
                                        {player.firstJoined}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No data available in table</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <button className='controlButton' onClick={handleFirstPage} disabled={currentPage === 1}>{'<<'}</button>
                    <button className='controlButton' onClick={handlePreviousPage} disabled={currentPage === 1}>{'<'}</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button className='controlButton' onClick={handleNextPage} disabled={currentPage === totalPages}>{'>'}</button>
                    <button className='controlButton' onClick={handleLastPage} disabled={currentPage === totalPages}>{'>>'}</button>
                </div>
            </div>
        </div>
    );
}

export default PlayerData;
