import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Playerdata.css';
import useAuth from "../../hooks/useAuth";
import transformRole from "../../hooks/transfromRole";
import Modal from './Modal';
import axios from '../../api/axios';
import saveData from '../../hooks/saveData';
import logEmitter from '../../utils/logEmitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserMinus , faUserPlus, faPen, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function PlayerData({ title, players }) {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const role = auth?.role;
    const userID = auth?.discordId;
    const errRef = useRef();

    // Redirect users without sufficient permissions
    useEffect(() => {
        if (role < 1) {
            // Redirect to an unauthorized page or show a warning message
            navigate('/unauthorized');
        }
    }, [role, navigate]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [adminId, setadminId] = useState('');
    const [adminDiscord, setadminDiscord] = useState('');
    const [newAdminName, setnewAdminName] = useState('');
    const [newAdminPassword, setnewAdminPassword] = useState('');
    const [newAdminDiscord, setnewAdminDiscord] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [selectedOption, setselectedOption] = useState(role >= 4 ? 'role' : 'name');

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (modalType === "createAccount") {
            if (!newAdminName || newAdminName.length < 2) errors.newAdminName = "Name must be at least 2 characters.";
            if (!newAdminPassword || newAdminPassword.length < 8) errors.newAdminPassword = "Password must be at least 8 characters.";
            if (!newAdminDiscord || newAdminDiscord.length < 15) errors.newAdminDiscord = "Discord must be at least 15 characters.";
        }

        if(modalType === 'deleteAccount') {
            if(!adminId) errors.noAdminId = "Provide admin id.";
            if(!adminDiscord) errors.noAdminDiscord = "Provide admin discord.";
            if (adminId === auth?.userId || adminDiscord === auth?.discordId) errors.deleteOwnAccount = "You cannot delete your own account.";
        }

        if(modalType.startsWith('manageStaff')) {
            if (selectedOption === 'name' && (!newAdminName || newAdminName.length < 2)) errors.newAdminName = "Name must be at least 2 characters.";
            if (selectedOption === 'password' && (!newAdminPassword || newAdminPassword.length < 8)) errors.newAdminPassword = "Password must be at least 8 characters.";
            if (selectedOption === 'discord' && (!newAdminDiscord || newAdminDiscord.length < 15)) errors.newAdminDiscord = "Discord must be at least 15 characters.";
        }
        return errors;
    };
    
    useEffect(() => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else setErrors({});
    }, [newAdminName, newAdminPassword, newAdminDiscord, adminId, adminDiscord, selectedOption]);

    const handleChange = (event) => {
        setSelectedNumber(event.target.value);
    };

    const totalPages = Math.ceil((players.length + 1) / itemsPerPage);

    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);
    const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const currentPlayers = players.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const closeModal = () => setShowModal(false);

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setErrors({});
    };

    const handleSaveModal = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        // Handle modal save actions (omitted for brevity)
    };

    const setTitle = (modalType) => {
        if(modalType === 'createAccount') return "Create Staff Account";
        if(modalType === 'deleteAccount') return "Delete Staff Account";
        if(modalType.startsWith('manageStaff')) return "Manage Staff Account";
    };

    return (
        <div className='player-data'>
            <h1><FontAwesomeIcon icon={faUserShield} style={{ marginRight: '18px' }}/>{title}</h1>
            <div className="staffManagersearch-bar">
                <button onClick={() => handleOpenModal('createAccount')} className='StaffAccountBtn'>
                    <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '10px' }}/>Create Staff Account
                </button>
                <button onClick={() => handleOpenModal('deleteAccount')} className='StaffAccountBtn'>
                    <FontAwesomeIcon icon={faUserMinus} style={{ marginRight: '10px' }}/>Delete Staff Account
                </button>
            </div>
            <div className='table-wrapper'>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Staff Name</th>
                            <th>License</th>
                            <th>Discord ID</th>
                            <th>Staff Group</th>
                            <th>Manage Staff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPlayers.length > 0 ? (
                            currentPlayers.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.id}</td>
                                    <td style={{ color: '#4f91ff' }}>{player.name}</td>
                                    <td>{player.license}</td>
                                    <td>{player.discord}</td>
                                    <td>{transformRole(player.role)}</td>
                                    <td>
                                        {player.discord !== userID ? (
                                            <button onClick={() => handleOpenModal(`manageStaff-${player.id}`)} className="manage-note-btn">
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '10px' }}/>Manage
                                            </button>
                                        ) : (
                                            <button className="manage-note-btn disabled" disabled>
                                                <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '10px' }}/>Manage
                                            </button>
                                        )}
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
            
            <Modal 
                show={showModal} 
                handleClose={closeModal} 
                handleSave={handleSaveModal} 
                title={setTitle(modalType)}
                errors={errors}
                errRef={errRef}
            >
                {modalType === "createAccount" ? (
                    <>
                        <label htmlFor="newAdminName">Name</label>
                        <input
                            type="text"
                            id="newAdminName"
                            value={newAdminName}
                            onChange={(e) => setnewAdminName(e.target.value)}
                            required={true}
                            // minLength={2}
                        />

                        <label htmlFor="newAdminPassword">Password</label>
                        <input
                            type="text"
                            id="newAdminPassword"
                            value={newAdminPassword}
                            onChange={(e) => setnewAdminPassword(e.target.value)}
                            required={true}
                            // minLength={8}
                        />

                        <label htmlFor="newAdminDiscord">Discord</label>
                        <input
                            type="text"
                            id="newAdminDiscord"
                            value={newAdminDiscord}
                            onChange={(e) => setnewAdminDiscord(e.target.value)}
                            required={true}
                            // minLength={15}
                        />
                        <label htmlFor="number-select">Select a Role: </label>
                        <select id="number-select" value={selectedNumber} onChange={handleChange}>
                            <option value={1}>Staff</option>
                            <option value={2}>Head Staff</option>
                            <option value={3}>Staff Manager</option>
                            <option value={4}>Mangmnet</option>
                            <option value={5}>Server Manager</option>
                            <option value={6}>Developer</option>
                            <option value={7}>Owner</option>
                        </select>
                    </>
                ) : modalType === "deleteAccount" ? (
                    <>
                        <label htmlFor="accountId">Admin id</label>
                        <input
                            type="text"
                            id="accountId"
                            value={adminId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setadminId(e.target.value)
                                }
                            }}
                            maxLength={2}
                        />
                        <label htmlFor="acountDiscord">Admin Discord</label>
                        <input
                            type="text"
                            id="acountDiscord"
                            value={adminDiscord}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setadminDiscord(e.target.value)
                                }
                            }}
                        />
                    </>
                ) : modalType.startsWith('manageStaff') ? (
                    <> 

                        <div>
                            <label htmlFor="number-select">Select a Option: </label>
                            <select id="number-select" value={selectedOption} onChange={(e) => setselectedOption(e.target.value)}>
                                    {role > 2 && (
                                        <option value={'password'}>Change Password</option>
                                    )}
                                    {role > 2 && (
                                        <option value={'name'}>Change Name</option>
                                    )}
                                    {role > 2 && (
                                        <option value={'discord'}>Change Discord</option>
                                    )}
                                    {role >= 2 && (
                                        <option value={'role'}>Change Role</option>
                                    )}

                            </select>
                        </div>
                        
                        {                            
                        selectedOption == 'name' ? 
                        <div>
                            <label htmlFor="newAdminName">Name</label>
                            <input
                                type="text"
                                id="newAdminName"
                                value={newAdminName}
                                onChange={(e) => setnewAdminName(e.target.value)}
                                required={true}
                            />
                        </div>

                        : selectedOption == 'password' ? 
                        <div>
                          <label htmlFor="newAdminPassword">Password</label>
                            <input
                                type="text"
                                id="newAdminPassword"
                                value={newAdminPassword}
                                onChange={(e) => setnewAdminPassword(e.target.value)}
                                required={true}
                                // minLength={8}
                            />
                        </div>

                        : selectedOption == 'discord' ? 
                        <div>
                            <label htmlFor="newAdminDiscord">Discord</label>
                            <input
                                type="text"
                                id="newAdminDiscord"
                                value={newAdminDiscord}
                                onChange={(e) => setnewAdminDiscord(e.target.value)}
                                required={true}
                                // minLength={15}
                            />
                        </div>

                        : selectedOption == 'role' ? 
                        <div>
                            <label htmlFor="number-select">Select a Role: </label>
                            <select id="number-select" value={selectedNumber} onChange={handleChange}>
                                {role >= 3 && (
                                    <option value={1}>Admin</option>
                                )}
                                {role >= 3 && (
                                    <option value={2}>Senior Admin</option>
                                )}
                                {role >= 3 && (
                                    <option value={3}>Head Admin</option>
                                )}
                                {role > 3 && (
                                    <option value={4}>Staff Manager</option>
                                )}
                                {role > 3 && (
                                    <option value={5}>Mangmnet</option>
                                )}
                                {role > 3 && (
                                    <option value={6}>Server Manager</option>
                                )}
                                {role > 3 && (
                                    <option value={7}>Developer</option>
                                )}
                                {role > 3 && (
                                    <option value={8}>Owner</option>
                                )}
                            </select>
                        </div>
                        :null
                        } 
                        
                    
                    </>
                ) : null}
            </Modal>
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

export default PlayerData;

