import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';
import Modal from './Modal';

// import '../../index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faAddressBook, faIdCard, faUserShield, faUserClock, faUserSlash, faTriangleExclamation, faGlobe, faWifi } from '@fortawesome/free-solid-svg-icons'; // Adjust this according to your usage

//ShowPlayerInformation

function formatTimeAgo(ms) {
    const currentTime = Date.now()
    // console.log(currentTime)
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

    // Format the date to "DD/MM/YYYY HH:mm:ss"
    const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');

    // Rearrange the format to "YYYY-MM-DD HH:mm:ss"
    const [day, month, year, time] = formattedDate.split(/[\s\/:]/);
    return `${year}-${month}-${day} ${time}:${formattedDate.split(':')[1]}:${formattedDate.split(':')[2]}`;
}

function ShowPlayerInformation({ selectedPlayer, UserDetailsData, timeAgo, handleOpenModal}) {
    const [vehicles, setVehicles] = useState([]);
    // const [newPlate, setnewPlate] = useState("");

    const { auth } = useAuth();
    const navigate = useNavigate()

    const role = auth?.role

    const chooseCharacter = (citizenid) => {
        navigate(`/players/${selectedPlayer.id}/characters/${citizenid}`)
    }

    const UserDetails = ({ player, characters, onBan, onKick, onWarn }) => (
        <div className='generalInfo'>
            <div className="grid-item general-info-section info-box">
                <h3><FontAwesomeIcon icon={faAddressBook} style={{ marginRight: '18px' }} />GENERAL INFORMATION (OUT-OF-CHARACTER)</h3>
                <div className='table-wrapper'>
                    <table className='infoTable'>
                        <tbody>
                            <tr>
                                <td>Player Name:</td>
                                <td>{player?.name || "None"}</td>
                            </tr>
                            <tr>
                                <td>Discord</td>
                                <td>discord:{player?.discord || "None"}</td>
                            </tr>
                            <tr>
                                <td>Rockstar</td>
                                <td>license:{player?.license || "None"}</td>
                            </tr>
                            <tr>
                                <td>First Joined</td>
                                <td>{timeAgo(player?.firstJoined || Date.now())}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            {role >= 3 && (
                <div className="grid-item characters-section info-box">
                <h3>
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '18px' }} />
                    LIST OF {player?.name?.toUpperCase()}'S CHARACTERS
                </h3>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Character Name</th>
                            <th>Citizen ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {characters && characters.length > 0 ? (
                            characters.map((character, index) => (
                                <tr onClick={() => chooseCharacter(character?.citizenid)} key={index}>
                                    <td>
                                        <div style={{ color: "#4f91ff" }}>
                                            Jhon Doe
                                            {/* {JSON.parse(character?.charinfo || '{}').firstname + " " + JSON.parse(character?.charinfo || '{}').lastname} */}
                                        </div>
                                    </td>
                                    <td>{character?.citizenid}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No data available in table</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            )}    
            <div className="grid-item manage-punishments-section info-box">

                <h3><FontAwesomeIcon icon={faUserShield} style={{ marginRight: '18px' }}/>MANAGE USER PUNISHMENTS</h3>
                <button className="manage-ban-btn" onClick={onBan}>BAN PLAYER</button>
                <button className="manage-kick-btn" onClick={onKick}>KICK PLAYER</button>
                <button className="manage-warn-btn" onClick={onWarn}>WARN PLAYER</button>
            </div>
        </div>
    );

    const currentTime = Date.now()
    const List = ({ type, listed }) => (
        <div className="player-data">
            <h1><FontAwesomeIcon icon={type == 'ban' ? faUserClock : type == 'kick' ? faUserSlash : faTriangleExclamation } style={{ marginRight: '18px' }}/>List of User {type}s</h1>

            {type == 'ban' ? (
                <table className="player-table">
                <thead>
                    <tr>
                        <th>{type} ID</th>
                        <th>Staff</th>
                        <th>{type} Reason</th>
                        <th>End at</th>
                        {role > 2 && (
                            <th>Manage {type}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {listed.length > 0 ? (
                        listed.map((j, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{j.by}</td>
                                <td>{j.reason}</td>
                                <td>{formatTimeAgo(j.expire)}</td>
                                {role > 2 && (
                                    <td>
                                        <button onClick={() => handleOpenModal(`ManageIssue-${type}-${index + 1}`)} className="manage-note-btn">Manage</button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No data available in table</td>
                        </tr>
                    )}
                </tbody>
                </table>
            ) : (                
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>{type} ID</th>
                            <th>Staff</th>
                            <th>{type} Reason</th>
                            {role > 2 && (
                                <th>Manage {type}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {listed.length > 0 ? (
                            listed.map((j, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{j.by}</td>
                                    <td>{j.reason}</td>
                                    {role > 2 && (
                                        <td>
                                            <button onClick={() => handleOpenModal(`ManageIssue-${type}-${index + 1}`)} className="manage-note-btn">Manage</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No data available in table</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );


        
    let userBans = [];
    let userKicks = [];
    let userWarns = [];

    if(UserDetailsData.playerId) {
        userBans = JSON.parse(UserDetailsData.playerData?.bans ? UserDetailsData.playerData.bans : "[]")
        userKicks = JSON.parse(UserDetailsData.playerData?.kicks ? UserDetailsData.playerData.kicks : "[]")
        userWarns = JSON.parse(UserDetailsData.playerData?.warns ? UserDetailsData.playerData.warns : "[]")
    }


    return (
        <div> 
            {/* <br /> */}
            <div className='playerOnline '>
            <p><strong style={{color: "#0080ff"}}><FontAwesomeIcon icon={faGlobe} style={{ marginRight: '10px' }}/></strong>{UserDetailsData?.player?.name} is currently online with ID <strong style={{color: "#0080ff"}}>{UserDetailsData?.player?.id}</strong></p>
            </div>
            {/* <br /> */}
            <div>
                <div>
                    <UserDetails
                        player={UserDetailsData.player}
                        characters={UserDetailsData.characters}
                        onBan={UserDetailsData.onBan}
                        onKick={UserDetailsData.onKick}
                        onWarn={UserDetailsData.onWarn}
                    />
                </div>
                <br />
                <br />
                <br />
                <br />
                <List type={'ban'} listed={userBans} />
                <br />
                <br />
                <List type={'kick'} listed={userKicks} />
                <br />
                <br />
                <List type={'warn'} listed={userWarns} />
            </div>
        </div>    
    );
}

export default ShowPlayerInformation;