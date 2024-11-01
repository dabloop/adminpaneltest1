import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import getData from '../../hooks/getData';
import logEmitter from '../../utils/logEmitter';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';



function GetVehicles({ title, vehicles }) {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const roles = auth?.roles || [];
    const role = roles[0] || 1;

    const errRef = useRef();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    const [playerData, setPlayerData] = useState({
        playerId: '',
        license: ''
    });

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("plate");

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;

    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);
    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const currentVehicles = filteredVehicles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const filterVehicles = () => {
            // logEmitter.emit('addLog', {title: 'Plate Changed', message: `Negro got fucked in the ass realy hard`, type: 'success'});
            // logEmitter.emit('addLog', {title: 'Error', message: `Error`, type: 'error'});
            // logEmitter.emit('addLog', {title: 'Success', message: `Success`, type: 'success'});
            // logEmitter.emit('addLog', {title: 'Info', message: `Info`, type: 'info'});
            // logEmitter.emit('addLog', {title: 'Other', message: `Other`, type: 'other'});
            
            let filter = [];
            if (searchBy == "plate") {
                filter = vehicles.filter(p => p.plate.toLowerCase().includes(search.toLowerCase()));
            } else if (searchBy == "citizenid") {
                filter = vehicles.filter(p => p.citizenId?.toLowerCase().includes(search.toLowerCase()));
            } else if (searchBy == "model") {
                filter = vehicles.filter(p => p.model.toLowerCase().includes(search.toLowerCase()));
            }
            setFilteredVehicles(filter);
        };
        filterVehicles();
    }, [search, searchBy, vehicles]);

    const fetchData = async (license) => {
        try {
            const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
            const foundPlayer = await getData(`GetPlayerFromLicense-${license.split(':')[1]}`, requirements);
            
            // console.log(license.split(':')[1])
            return foundPlayer[0]
            // setPlayerData({
            //     playerId: foundPlayer.id,
            //     license: playerData?.license,
            // });
        } catch (error) {
            console.error(`Failed to fetch ${selectedCharacter?.citizenid} data`, error);
        }
    };

    // useEffect(() => {
    //     if (selectedCharacter) {
    //         fetchData();
    //     }
    // }, [selectedCharacter, auth]);

    const selectCharacter = async (data) => {
        const { license, citizenId } = data;

        // setPlayerData({
        //     playerId: playerData?.playerId,
        //     license: license,
        // });
        
        const foundPlayer = await fetchData(license)
        // console.log(foundPlayer)
        if(foundPlayer) {
            setSelectedCharacter(citizenId);
            navigate(`/players/${foundPlayer?.id}/characters/${citizenId}`);
        } else return alert(`Cannot find this user,`)
    };

    return (
        <div>
            <div className='player-data'>
                <h1><FontAwesomeIcon icon={faCar} style={{ marginRight: '18px' }} />{title}</h1>
                <div className="search-bar">
                    <div className="entries">
                        Show
                        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
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
                            placeholder={`Search Vehicle by ${searchBy}... `}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                            <option value="plate">Plate</option>
                            <option value="citizenid">CitizenId</option>
                            <option value="model">Model</option>
                        </select>
                    </div>
                </div>
                <div className='table-wrapper'>
                    <table className="player-table">
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Owner Name</th>
                                <th>Citizen Id</th>
                                <th>Plate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentVehicles.length > 0 ? (
                                currentVehicles.map((vehicle, index) => (
                                    <tr onClick={() => selectCharacter(vehicle)} key={index}>
                                        <td>{vehicle.model}</td>
                                        <td style={{ color: '#4f91ff' }}>{vehicle.ownerName}</td>
                                        <td>{vehicle.citizenId}</td>
                                        <td>{vehicle.plate}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No data available in table</td>
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

export default GetVehicles;
