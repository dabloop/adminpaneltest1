import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import './PlayerData.css';
import useAuth from "../../hooks/useAuth";
// import Modal from './Modal';

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

function PlayerData({ type, title }) {

    const auth = useAuth();
    const roles = auth?.auth?.roles;
    const role = roles[0];

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedCharachter, setSelectedCharachter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newAmount, setNewAmount] = useState("");
    const [amountType, setAmountType] = useState("cash");

    const sampleBans = [
        { id: 1, punishedBy: 'Admin1', dateIssued: '2024-07-23', reason: 'Misconduct' },
        { id: 2, punishedBy: 'Admin2', dateIssued: '2024-07-22', reason: 'Harassment' },
    ];

    const samplePlayer = {
        name: 'Bramix',
        discord: 'discord:935908298258014288',
        rockstar: 'license:088168899d0c732a3dad4d161d98ee9e53a8853',
        steam: 'steam:11000013fcb94e6',
        playtime: '0 Days, 0 Hours, 2 Minutes',
        firstJoined: '2022-04-03 08:28:28'
    };    

    // useEffect(() => {
    //     if (playerId) {
    //         console.log(`playerId: ${playerId}`)
    //         const player = players.find(p => p.id == parseInt(playerId));
    //         console.log(player)
    //         if(player) {
    //             setSelectedPlayer(player);
    //         } else setSelectedPlayer(null);
    //     } else {
    //         setSelectedPlayer(null);
    //     }

    //     if (charactarId) {
    //         console.log(`charactarId: ${charactarId}`)

    //         const charactar = Charactares.find(c => c.id === parseInt(charactarId));
    //         setSelectedCharachter(charactar || null); // Ensure null is set if no charactar found
    //     } else {
    //         setSelectedCharachter(null);
    //     }
    // }, [playerId, charactarId, players]);

    const players = [
        { name: 'Bramix Fatass', id: "1", discord: '510434862998749225', role: 'Owner', at: 'Today', reason: "cl" },
        { name: 'Nickher', id: "2", discord: '599991392923549708', role: 'Dev',  at: 'Today', reason: "rdm vdm cl" },
        { name: 'Eilay', id: "3", discord: '922826616076378142', role: 'Dev',  at: 'Today', reason: "rdm vdm" },
        { name: 'Player192123412', id: "4", discord: '734805363962019951', role: 'User',  at: 'Today', reason: "jhdkaskjd alskjdlkas jdkloasjdlkasjdlkas" },
    ];      
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

    const closeModal = () => setShowModal(false);

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleSaveModal = (e) => {
        e.preventDefault();
        // Handle saving data here
        if (modalType === 'phone') {
            console.log('New Phone Number:', newPhoneNumber);
        } else {
            console.log('Amount Type:', amountType, 'New Amount:', newAmount);
        }
        closeModal();
    };

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



{/* 
                <div>
                    <List type={'bans'} listed={sampleBans} />
                </div> */}
                <div className='table-wrapper'>
                    <table className="player-table">
                        <thead>
                            <tr>
                                <th>{type} ID</th>
                                <th>{type} For</th>
                                <th>{type} By</th>
                                <th>{type} At</th>
                                <th>{type} Reason</th>
                                <th>Manage {type}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPlayers.map((j, index) => (
                                <tr key={j.id}>
                                    <td style={{color: "#af0066"}}>{j.id}</td>
                                    <td>{j.name}</td>
                                    <td>{j.name}</td>
                                    <td>{j.at}</td>
                                    <td>{j.reason}</td>
                                    <td>
                                        <button className="manage-note-btn">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* <thead>
                            <tr>
                                <th>Player ID</th>
                                <th>Player Name</th>
                                <th>License (Rockstar License)</th>
                                <th>Discord ID</th>
                                <th>Steam Identifier</th>
                                <th>First Join</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPlayers.length > 0 ? (
                                currentPlayers.map((player, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'red' }}>
                                                {player.id}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {player.name}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {player.license}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {player.discord}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {player.steam}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/players/${player.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {player.firstJoined}
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No data available in table</td>
                                </tr>
                            )}
                        </tbody> */}
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
