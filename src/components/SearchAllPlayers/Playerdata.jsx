import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import './Playerdata.css';

import '../../index.css';

import useAuth from "../../hooks/useAuth";
import Modal from './Modal';
import ShowCharacterInformation from './CharInformation';
import ShowPlayerInformation from './PlayerInformation';
import PlayerList from './playerList';
import getData from '../../hooks/getData';
import saveData from '../../hooks/saveData';
import disconnectPlayer from '../../hooks/disconnectPlayer';

import logEmitter from '../../utils/logEmitter';

const testCharacters = [
    {
        discord: "599991392923549708",
        id: 1,
        name: "nickher.",
        citizenid: "nigger",
        license: "license:bed04502386288632f3e0349e0e1d39d0b94cd81",
        last_updated: "1m ago",
        charinfo: {
            firstname: "Jhon",
            lastname: "Doe",
            nationality: "israel",
            gender: "men",
            // birthdate: "01/01/2000",
            birthdate: 20000000,
            phone: "1234567890",
        },
        job: {
            grade: {
                name: "CEO"
            },
            name: "pornhub"
        },
        gang: {
            grade: {
                name: "soldier"
            },
            name: "vagos"
        },
        money: {
            bank: 1000,
            cash: 2000,
            crypto: 1000
        },
        metadata: {
            stress: 35,
            hunger: 100,
            thirst: 94,
            armor: 94,
            bloodtype: "o+",
        }
    }
]
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
    
      // Format the date to "YYYY-MM-DD HH:mm:ss"
      const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
    
      // Rearrange the format to "YYYY-MM-DD HH:mm:ss"
      const [day, month, year, time] = formattedDate.split(/[\s\/:]/);
      return `${year}-${month}-${day} ${time}:${formattedDate.split(':')[1]}:${formattedDate.split(':')[2]}`;
} 

function PlayerData({ title, players, inGame }) {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const errRef = useRef();

    const role = auth?.role;

    const { playerId, charactarId } = useParams();
    const [playerData, setPlayerData] = useState([]);

    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const [selectedCharachter, setSelectedCharachter] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');

    const [newReason, setnewReason] = useState("");

    
    // const [selectCustomDuration, setselectCustomDuration] = useState("");
    
    const [selectDuration, setselectDuration] = useState("2h");
    const [customDuration, setCustomDuration] = useState({
        value: 1,
        unit: 'day',
    });
   
    // const [selectCustomDurationType, setselectCustomDurationType] = useState("d");
    // const [newPlate, setnewPlate] = useState("");


    const [formData, setFormData] = useState({
        phoneNumber: '',
        amountType: 'cash',
        newAmount: '',
        newPlate: '',
        warnReason: '',
        kickReason: '',
        banReason: ''
    });


    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (modalType.startsWith('manageVehicle')) {
            if (!formData.newPlate || formData.newPlate.length < 4) errors.plateLength = "Plate must be at least 4-8 characters.";
        }
        if(modalType == 'banPlayer') {
            if (!formData.banReason || formData.banReason.length < 4) errors.plateLength = "Ban length must be at least 4 characters.";
        }
        return errors;
    };
    
    useEffect(() => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else setErrors({})
    }, [formData.newPlate, formData.banReason])

    const handleBan = () => {
        handleOpenModal("banPlayer")
    };

    const handleKick = () => {
        const isOnline = inGame.find((player) => player.license == playerData[1].license)
        if(!isOnline) return alert(`${playerData[1].name} is not online!`);
        handleOpenModal("kickPlayer")
    };

    const onWarn = () => {
        handleOpenModal("warnPlayer")
        // alert('Create note action triggered');
    };



    const fetchPlayerData = async () => {
        try {
            const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
            let getUserTrastscore = await getData(`getUserTrastscore-${playerId}`, requirements);
            const getUserData = await getData(`getUserData-${playerId}`, requirements);
            const getUserCharactersData = await getData(`getUserCharactersData-${playerId}`, requirements);


            // const getUserVehicleData = await getData(`getUserVehicleData-${playerId}`, requirements);

            // console.log('getUserCharactersData', ...getUserCharactersData);
            if (getUserTrastscore.length == 0) getUserTrastscore = [{ id: playerId }];
            setPlayerData([...getUserTrastscore, ...getUserData, ...getUserCharactersData]);
        } catch (error) {
            console.error('Failed to fetch player data:', error);
        }
    };

    useEffect(() => {
        if (playerId) {
            fetchPlayerData();
        }
    }, [playerId, players, auth]);


    useEffect(() => {
        if (playerId) {
            // console.log(`playerId: ${playerId}`)
            const player = players.find(p => p.id == parseInt(playerId));
            // console.log(player)
            if(player) {
                setSelectedPlayer(player);
            } else setSelectedPlayer(null);
        } else {
            setSelectedPlayer(null);
        }

        if (charactarId) {
            // console.log(`charactarId: ${charactarId}`)
            const characters = testCharacters
            const charactar = characters?.find((c) => c.citizenid == charactarId)//characters ? characters[charactarId - 1] : null 
            // console.log("charactar", charactar);
            setSelectedCharachter(charactar || null); // Ensure null is set if no charactar found
            // console.log("selectedPlayer", selectedCharachter)
            if(!charactar) navigate(`/players`)
        } else {
            setSelectedCharachter(null);
        }
    }, [playerId, charactarId, players, playerData]);

    const handleCloseModal = async () => setShowModal(false);
    
    const handleRemoveIssue = async () => {
        setShowModal(false);

        if(modalType.startsWith('ManageIssue-')) {
            const issueType = modalType.split('-')[1];
            const issueId = parseInt(modalType.split('-')[2]);

            if(issueType == 'ban') {
                try {
                    await saveData('sql', { type: `removeissue-${issueType}-${issueId}`, target: playerId, admin: auth?.user });
                    logEmitter.emit('addLog', {title: 'Ban Removed', message: `Ban Removed by ${auth?.user} (Target: ${playerId})`, type: 'error'});
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
            else if(issueType == 'kick') {
                try {
                    await saveData('sql', { type: `removeissue-${issueType}-${issueId}`, target: playerId, admin: auth?.user });
                    logEmitter.emit('addLog', {title: 'Kick Removed', message: `Kick Removed by ${auth?.user} (Target: ${playerId})`, type: 'error'});
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
            else if(issueType == 'warn') {
                try {
                    await saveData('sql', { type: `removeissue-${issueType}-${issueId}`, target: playerId, admin: auth?.user });
                    logEmitter.emit('addLog', {title: 'Warn Removed', message: `Warn Removed by ${auth?.user} (Target: ${playerId})`, type: 'error'});
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
            window.location.reload()
        }
    }

    const handleRemoveVehicle = async () => {
        try {
            if(!modalType) return;
            const content = modalType.split('-')
            // console.log("content", modalType)
            await saveData('sql', { type: "deleteVehicle", admin: auth?.user, citizenid: content[1], plate: content[2]});
            logEmitter.emit('addLog', {title: 'Vehicle Deleted', message: `Deleted by ${auth?.user} (Target: ${content[1]}, Plate ${content[2]})`, type: 'error'});

            window.location.reload()
            handleCloseModal();

        } catch (error) {
            console.error('Failed to save removeVehicle:', error);
        } 
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSaveModal = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        if (modalType == 'phone') {
            try {
                await saveData('sql', { type: "newPhonenumber", target: playerId, admin: auth?.user, phoneNumber: formData.phoneNumber, citizenid: selectedCharachter?.citizenid });
                logEmitter.emit('addLog', {title: 'New Phone Number Changed', message: `Change by ${auth?.user} (Target: ${playerId})`, type: 'error'});
                
            } catch (error) {
                console.error('Failed to save phone Number:', error);
            }
        } else if (modalType == 'bank') {
            try { 
                await saveData('sql', { type: "changeBankAcount", target: playerId, admin: auth?.user, amount: formData.newAmount,  moneyType: formData.amountType, citizenid: selectedCharachter?.citizenid });
                logEmitter.emit('addLog', {title: 'Bank Acount Changed', message: `Change by ${auth?.user} (Type: ${moneyType} Amount: ${amount} Target: ${playerId})`, type: 'error'});

            } catch (error) {
                console.error('Failed to save Bank Acount:', error);
            }
        } else if (modalType == 'warnPlayer') {
            try {
                await saveData('sql', { type: "warn", target: playerId, admin: auth?.user, reason: formData.warnReason });
                logEmitter.emit('addLog', {title: 'User Warned ', message: `Warned by ${auth?.user} (Reason: ${formData.warnReason} Target: ${playerId})`, type: 'error'});
            } catch (error) {
                console.error('Failed to save warning:', error);
            }
        } else if (modalType == 'kickPlayer') {
            try {
                const isOnline = inGame.find((player) => player.license == playerData[1].license)
                const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
                await disconnectPlayer(isOnline.id, formData.kickReason, requirements)
                await saveData('sql', { type: "kick", target: playerId, admin: auth?.user, reason: formData.kickReason });
                logEmitter.emit('addLog', {title: 'User Kicked ', message: `Kicked by ${auth?.user} (Reason: ${formData.kickReason} Target: ${playerId})`, type: 'error'});
            } catch (error) {
                console.error('Failed to save kick:', error);
            }
        } else if (modalType == 'banPlayer') {
            try {
                const isOnline = inGame.find((player) => player.license == playerData[1].license)
                const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
                // console.log(selectDuration)
                const choosenTime = selectDuration === 'custom' ? customDuration : selectDuration;
                isOnline ? await disconnectPlayer(isOnline.id, formData.banReason, requirements) : null
                await saveData('sql', { type: "ban", target: playerId, admin: auth?.user, reason: formData.banReason, time: { type: selectDuration, duraction: choosenTime } });
                logEmitter.emit('addLog', {title: 'User Banned ', message: `Banned by ${auth?.user} (Reason: ${formData.banReason} Target: ${playerId}, Duaraction: ${selectDuration === 'custom' ? Object.values(customDuration) : selectDuration})`, type: 'error'});
                
            } catch (error) {
                if(error?.response?.status == 409) {
                    setErrors({ msg: error?.response?.message});
                }
                console.error('Failed to save ban:', error);
            }
        } else if (modalType.startsWith('ManageIssue-')) {
            // console.log('New Reason:', newReason);
            if(!newReason || newReason == '') return;
            const issueType = modalType.split('-')[1];
            const issueId = parseInt(modalType.split('-')[2]);

            if(issueType == 'ban') {
                try {
                    await saveData('sql', { type: `editissue-${issueType}-${issueId}`, newReason: newReason, target: playerId, admin: auth?.user });
                    logEmitter.emit('addLog', {title: 'User Kicked ', message: `Kicked by ${auth?.user} (Reason: ${formData.kickReason} Target: ${playerId})`, type: 'error'}); 
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
            else if(issueType == 'kick') {
                try {
                    await saveData('sql', { type: `editissue-${issueType}-${issueId}`, newReason: newReason, target: playerId, admin: auth?.user });
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
            else if(issueType == 'warn') {
                try {
                    await saveData('sql', { type: `editissue-${issueType}-${issueId}`, newReason: newReason, target: playerId, admin: auth?.user });
                } catch (error) {
                    console.error('Failed to save issue:', error);
                }
            }
        } else if (modalType.startsWith('manageVehicle-')) {
            try {
                const content = modalType.split('-');
                await saveData('sql', {
                    type: "newVehiclePlate",
                    admin: auth?.user,
                    citizenid: content[1],
                    oldPlate: content[2],
                    newPlate: formData.newPlate
                });
            } catch (error) {
                if (error?.response?.status === 409) {
                    setErrors({ 'samePlateError': 'There is already a plate with the same name' });
                }
                return; // Exit early if there's an error
            }
        }
        
        // If no errors, reload the page and close the modal
        if (Object.keys(errors).length === 0) {
            window.location.reload();
            handleCloseModal();
        }
    };

    const handleOpenModal = (type) => {
        
        if(type == 'phone' || type == 'bank') {
            const isOnline = inGame?.find((player) => player.license == playerData[1]?.license)
            // console.log(playerData[1]?.license)
            if(isOnline) return alert(`Sorry, i cannot edit ${isOnline.name} data while hes not the server`);
        }

        setModalType(type);
        setShowModal(true);
    };

    const getTitle = (modalType, type) => {
        if (modalType === 'phone') return 'Change Phone Number';
        else if (modalType === 'bank') return 'Change Bank Amounts';
        else if (modalType === 'warnPlayer') return `Warn ${playerData[1]?.name}?`;
        else if (modalType === 'kickPlayer') return `Kick ${playerData[1]?.name}?`;
        else if (modalType === 'banPlayer') return `Ban ${playerData[1]?.name}?`;
        
        if (modalType.startsWith('ManageIssue')) return `Manage ${modalType.split("-")[1]}#${modalType.split("-")[2]} for ${playerData[1]?.name}?`;
        if (modalType.startsWith('manageVehicle')) return `Manage Vehicle #${modalType.split("-")[2]}`;
    
    }

    console.log("selectedCharachter123", selectedCharachter)
    return (
        <div className='FullData'>
            <Modal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleSave={handleSaveModal} 
                title={getTitle(modalType) || 'Title'}
                type={modalType}
                handleRemoveIssue={handleRemoveIssue}
                handleRemoveVehicle={handleRemoveVehicle}
                errors={errors}
                errRef={errRef}
            >
                {modalType == 'phone' && (
                    <>
                        <label htmlFor="phoneNumber">Number</label>
                        <input
                            type="text"
                            maxLength={10}
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                    handleInputChange(e);
                                }
                            }}
                        />
                    </>
                )}
                {modalType == 'bank' && (
                    <>
                        <label htmlFor="amountType">Select Type</label>
                        <select id="amountType" value={formData.amountType} onChange={handleInputChange}>
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                        </select>
                        <label htmlFor="newAmount">Amount</label>
                        <input
                            type="text"
                            id="newAmount"
                            value={formData.newAmount}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    handleInputChange(e);
                                }
                            }}
                        />
                    </>
                )}
                {modalType.startsWith('ManageIssue') && (
                    <>
                        {/* <button className="inside-button">Remove {modalType.split('-')[1]}</button> */}
                        <label htmlFor="changeReason">Change Reason</label>
                        <input
                            type="text"
                            id="changeReason"
                            placeholder="New reason"
                            value={newReason}
                            onChange={(e) => setnewReason(e.target.value)}
                        />
                    </>
                )}
                {modalType == 'warnPlayer' && (
                    <>
                        <label htmlFor="warnReason">Reason for the warn</label>
                        <input
                            type="text"
                            id="warnReason"
                            placeholder="Reason"
                            value={formData.warnReason}
                            onChange={handleInputChange}
                        />
                    </>
                )}
                {modalType == 'kickPlayer' && (
                    <>
                        <label htmlFor="kickReason">Reason for the kick</label>
                        <input
                            type="text"
                            id="kickReason"
                            placeholder="Reason"
                            value={formData.kickReason}
                            onChange={handleInputChange}
                        />
                    </>
                )}
                {modalType === 'banPlayer' && (
                    <>
                        <label htmlFor="banReason">Reason for the ban</label>
                        <input
                            type="text"
                            id="banReason"
                            placeholder="Reason"
                            value={formData.banReason}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="duration-select">Duration: </label>
                        <select 
                            id="duration-select" 
                            value={selectDuration} 
                            onChange={(e) => setselectDuration(e.target.value)}
                            // disabled={role < 3} // Disable for users with role < 3
                        >
                            {role >= 4 && (
                                <option value={'custom'}>Custom</option>
                            )}
                            <option value={'2h'}>2 Hours</option>
                            <option value={'8h'}>8 Hours</option>
                            <option value={'1d'}>1 Day</option>
                            {role >= 2 && (
                                <option value={'2d'}>2 Days</option>
                            )}
                            {role >= 3 && (
                                <option value={'1w'}>1 Week</option>
                            )}
                            {role >= 4 && (
                                <option value={'2w'}>2 Weeks</option>
                            )}
                            {role >= 4 && (
                                <option value={'Permenent'}>Permenent</option>
                            )}
                        </select>

                        {selectDuration === 'custom' && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    placeholder="Duration"
                                    value={customDuration.value}
                                    onChange={(e) => {
                                        parseInt(e.target.value) >= 1
                                        ? setCustomDuration({ ...customDuration, value: e.target.value })
                                        : null;
                                    }}
                                    style={{ width: '60px', marginRight: '10px' }}
                                />
                                <select
                                    value={customDuration.unit}
                                    onChange={(e) => setCustomDuration({ ...customDuration, unit: e.target.value })}
                                >
                                    <option value="hour">Hour(s)</option>
                                    <option value="day">Day(s)</option>
                                    <option value="week">Week(s)</option>
                                    <option value="month">Month(s)</option>
                                    <option value="year">Year(s)</option>
                                </select>
                            </div>
                        )}
                    </>
                )}

                {modalType.startsWith('manageVehicle') && (
                        <>
                            {/* <button className="inside-button">Remove {modalType.split('-')[1]}</button> */}
                            <label htmlFor="newPlate">Change Plate</label>
                            <input
                                type="text"
                                id="newPlate"
                                maxLength={8}
                                minLength={4}
                                placeholder="New plate"
                                value={formData.newPlate}
                                onChange={handleInputChange}
                            />
                        </>
                    )}
            </Modal>
            {selectedCharachter ? (
                <ShowCharacterInformation 
                    selectedCharachter={testCharacters[0]} 
                    discord={testCharacters[0].discord}
                    handleOpenModal={handleOpenModal}
                />
            ) : selectedPlayer ? (
                <ShowPlayerInformation
                    selectedPlayer={selectedPlayer} 
                    handleOpenModal={handleOpenModal}
                    UserDetailsData={
                        {
                            player: playerData[1],
                            playerId: playerId,
                            playerData: playerData[0],
                            characters: [{
                                citizenid: "nigger"
                            }],
                            onBan: handleBan,
                            onKick: handleKick,
                            onWarn: onWarn
                        }
                    }
                    timeAgo={timeAgo}
                />
            ) : (
                <PlayerList 
                    players={players}
                    title={title}
                    timeAgo={timeAgo}
                />
            )}
        </div>
    );
    
}

export default PlayerData;
