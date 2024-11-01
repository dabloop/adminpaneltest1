import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import getData from '../../hooks/getData';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons';

function GetCharacters({ title, characters }) {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const roles = auth?.roles || [];
    const role = roles[0] || 1;

    const errRef = useRef();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // const [playerData, setPlayerData] = useState({
    //     playerId: '',
    //     license: ''
    // });

    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState("owner");

    const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage) || 1;

    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);
    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    const currentCharacters = filteredCharacters.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        const filterCharacters = () => {
            let filter = [];
            if (searchBy === "owner") {
                filter = characters.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
            } else if (searchBy === "citizenid") {
                filter = characters.filter(p => p.citizenid.toLowerCase().includes(search.toLowerCase()));
            } else if (searchBy === "license") {
                filter = characters.filter(p => p.license.split(':')[1].toLowerCase().includes(search.toLowerCase()));
            } 
            //else if (searchBy === "model") {
            //     filter = characters.filter(p => p.model.toLowerCase().includes(search.toLowerCase()));
            // }
            setFilteredCharacters(filter);
        };
        filterCharacters();
    }, [search, searchBy, characters]);

    const fetchData = async (license) => {
        try {
            const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
            const foundPlayer = await getData(`GetPlayerFromLicense-${license.split(':')[1]}`, requirements);
            
            return foundPlayer[0]
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
        const { license, citizenid } = data;

        // setPlayerData({
        //     playerId: playerData?.playerId,
        //     license: license,
        // });
        
        const foundPlayer = await fetchData(license)
        // console.log(foundPlayer)
        if(foundPlayer) {
            setSelectedCharacter(citizenid);
            navigate(`/players/${foundPlayer?.id}/characters/${citizenid}`);
        } else return alert(`Cannot find this user,`)
    };


    const getLastPlay = (lastPlay) => {        
        const date = new Date(lastPlay);
        const last_updated = date.toLocaleString();

        return last_updated || 'loading'
    }

    
    const getCharacterName = (character) => {

        const getCharacterInfo = (field, defaultValue = "") =>
            JSON.parse(character?.[field] || "{}") || defaultValue;

        const characterName = `${getCharacterInfo('charinfo').firstname} ${getCharacterInfo('charinfo').lastname}`;

        return characterName
    }

    return (
        <div>
            <div className='player-data'>
            <h1><FontAwesomeIcon icon={faBoxArchive} style={{ marginRight: '18px' }} />{title}</h1>
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
                            placeholder={`Search by ${searchBy}... `}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                            <option value="owner">Owner</option>
                            <option value="citizenid">CitizenId</option>
                            <option value="license">License</option>
                        </select>
                    </div>
                </div>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Owner</th>
                            <th>Name</th>
                            <th>License</th>
                            <th>Citizen Id</th>
                            <th>Last Played</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCharacters.length > 0 ? (
                            currentCharacters.map((character, index) => (
                                <tr onClick={() => selectCharacter(character)} key={index}>
                                    {/* {console.log(character)} */}
                                    <td style={{ color: '#4f91ff' }}>{character.name}</td>
                                    <td>{getCharacterName(character)}</td>
                                    <td>{character.license.split(':')[1]}</td>
                                    <td>{character.citizenid}</td>
                                    <td>{getLastPlay(character.last_updated)}</td>
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

export default GetCharacters;
