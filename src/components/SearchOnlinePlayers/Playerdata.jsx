import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './PlayerData.css';
import useAuth from "../../hooks/useAuth";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

function timeAgo(ms) {
    const date = new Date(ms);
    const options = {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
    const [day, month, year, time] = formattedDate.split(/[\s\/:]/);
    return `${year}-${month}-${day} ${time}:${formattedDate.split(':')[1]}:${formattedDate.split(':')[2]}`;
}

function PlayerData({ title, players, getData, requirements }) {
    const { auth } = useAuth();
    const role = auth?.role;
    const navigate = useNavigate();

    const [dynamicLinks, setDynamicLinks] = useState({});

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [filteredPlayers, setFilteredPlayers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        let filter = [];
        if (searchBy === "name") {
            filter = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (searchBy === "license") {
            filter = players.filter(p => p.license.toLowerCase().includes(search.toLowerCase()));
        }

        if (searchBy === "discord") {
            filter = players.filter(p => p.discord.toLowerCase().includes(search.toLowerCase()));
        }

        setFilteredPlayers(filter);
    }, [search, searchBy, players]);

    const totalPages = Math.ceil((filteredPlayers.length) / itemsPerPage) || 1;

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

    const handlePlayerClick = async (discordId, playerId, e) => {
        e.preventDefault();  // Prevent the default link behavior
        const userId = await getData(`transferToId-${discordId}`, requirements);

        console.log('userId:', userId);
        setDynamicLinks(prevLinks => ({
            ...prevLinks,
            [playerId]: `/players/${userId}`
        }));

        navigate(`/players/${userId}`);
    };

    const CustomLink = ({ player, children, style }) => (
        <Link
            to={dynamicLinks[player.id] || `/players/${player.id}`}
            style={{ textDecoration: 'none', ...style }}
            onClick={(e) => handlePlayerClick(player.discord, player.id, e)}
        >
            {children}
        </Link>
    );

    return (
        <div>
            <div className='player-data'>
                <h1><FontAwesomeIcon icon={faInbox} style={{ marginRight: '18px' }} />{title}</h1>
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
                                //     <tr key={index}>
                                //     <td>
                                //         <CustomLink player={player} style={{ color: '#4f91ff' }}>
                                //             {player.id}
                                //         </CustomLink>
                                //     </td>
                                //     <td>
                                //         <CustomLink player={player} style={{ color: 'inherit' }}>
                                //             {player.name}
                                //         </CustomLink>
                                //     </td>
                                //     <td>
                                //         <CustomLink player={player} style={{ color: 'inherit' }}>
                                //             {player.license}
                                //         </CustomLink>
                                //     </td>
                                //     <td>
                                //         <CustomLink player={player} style={{ color: 'inherit' }}>
                                //             {player.discord}
                                //         </CustomLink>
                                //     </td>
                                //     <td>
                                //         <CustomLink player={player} style={{ color: 'inherit' }}>
                                //             {timeAgo(player.firstJoined)}
                                //         </CustomLink>
                                //     </td>
                                // </tr>
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
        </div>
    );
}

export default PlayerData;
