import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faAddressCard, faLandmark, faSave, faSeedling, faSuitcase, faUserNinja } from '@fortawesome/free-solid-svg-icons';
import useAuth from "../../hooks/useAuth";
import './CharInformation.css';

function ShowCharacterInformation({ selectedCharachter, discord, handleOpenModal }) {
    const { auth } = useAuth();

    const [data, setData] = useState({
        nationality: selectedCharachter.charinfo.nationality,
        firstname: selectedCharachter.charinfo.firstname,
        lastname: selectedCharachter.charinfo.lastname,
        birthdate: selectedCharachter.charinfo.birthdate,
        phone: selectedCharachter.charinfo.phone,
        cash: selectedCharachter.money.cash,
        bank: selectedCharachter.money.bank,
        crypto: selectedCharachter.money.crypto,
        gender: selectedCharachter.charinfo.gender,
        stress: selectedCharachter.metadata.stress,
        thirst: selectedCharachter.metadata.thirst,
        hunger: selectedCharachter.metadata.hunger,
        armor: selectedCharachter.metadata.armor,
        license: selectedCharachter.license
    });

    const renderInput = (label, value, onChange, type = "text") => (
        <td>
            <div className='input-wrapper'>
                <input onChange={onChange} type={type} className="input" value={value} />
                <label className='floating-label'>{label}</label>
                <div className='hover-underline'></div>
                <div className='underline'></div>
            </div>
        </td>
    );

    return (
        <div className="selecteduser-info">
            <div className="information-container">
                <div className="information-box">
                    <h3><FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '18px' }} />General Information</h3>
                    <table>
                        <tbody>
                            <tr><td>Character ID:</td><td>{selectedCharachter.id}</td></tr>
                            <tr><td>Owned By:</td><td>{selectedCharachter.name}</td></tr>
                            <tr><td>Citizen ID:</td><td>{selectedCharachter.citizenid}</td></tr>
                            <tr>
                                <td>License:</td>
                                {renderInput("License", data.license, (e) => setData({ ...data, license: e.target.value }), "text")}
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">SAVE</button>
                                </td>
                            </tr>
                            <tr><td>Discord ID:</td><td>{discord}</td></tr>
                            <tr><td>Last Played:</td><td>{selectedCharachter.last_updated}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="information-box">
                    <h3><FontAwesomeIcon icon={faAddressCard} style={{ marginRight: '18px' }} />In-Character Information</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>First Name:</td>
                                {renderInput("First Name", data.firstname, (e) => setData({ ...data, firstname: e.target.value }))}
                            </tr>
                            <tr>
                                <td>Last Name:</td>
                                {renderInput("Last Name", data.lastname, (e) => setData({ ...data, lastname: e.target.value }))}
                            </tr>
                            <tr>
                                <td>Nationality:</td>
                                {renderInput("Nationality", data.nationality, (e) => setData({ ...data, nationality: e.target.value }))}
                            </tr>
                            <tr>
                                <td>Gender:</td>
                                <td>
                                    <div className='input-wrapper'>
                                        <select className='select' name="gender" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })}>
                                            <option value="0">Male</option>
                                            <option value="1">Female</option>
                                        </select>
                                        <label className='floating-label'>Gender</label>
                                        <div className='hover-underline'></div>
                                        <div className='underline'></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Phone Number:</td>
                                {renderInput("Phone Number", data.phone, (e) => setData({ ...data, phone: e.target.value }), "number")}
                            </tr>
                        </tbody>
                    </table>
                    <span>
                        <button className='saveButton' onClick={() => handleOpenModal("phone")}>
                           SAVE
                        </button>
                    </span>
                </div>

                <div className="information-box">
                    <h3><FontAwesomeIcon className='titleIcon' icon={faSeedling} style={{ marginRight: '18px' }} />Metadata</h3>
                    <table>
                        <tbody>
                            <tr><td>Blood Type:</td><td>{selectedCharachter.metadata.bloodtype}</td></tr>
                            <tr>
                                <td>Thirst</td>
                                <td>{data.thirst}</td>
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">FILL UP</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Hunger</td>
                                <td>{data.hunger}</td>
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">FILL UP</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Stress</td>
                                <td>{data.stress}</td>
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">RELAX</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Armor</td>
                                <td>{data.armor}</td>
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">FILL UP</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <span>
                        <button className='saveButton' onClick={() => handleOpenModal("phone")}>
                           SAVE
                        </button>
                    </span>
                </div>

                <div className="information-box">
                    <h3><FontAwesomeIcon icon={faLandmark} style={{ marginRight: '18px' }} />Money</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>BANK</td>
                                {renderInput("Bank", data.bank, (e) => setData({ ...data, bank: e.target.value }), "number")}
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">GIVE</button>
                                    <button className="action-button">REMOVE</button>
                                    <button className="action-button">SET</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Cash</td>
                                {renderInput("Cash", data.cash, (e) => setData({ ...data, cash: e.target.value }), "number")}
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">GIVE</button>
                                    <button className="action-button">REMOVE</button>
                                    <button className="action-button">SET</button>
                                </td>
                            </tr>
                            <tr>
                                <td>Crypto</td>
                                {renderInput("Crypto", data.crypto, (e) => setData({ ...data, crypto: e.target.value }), "number")}
                                <td className='actuanButtonCollector'>
                                    <button className="action-button">GIVE</button>
                                    <button className="action-button">REMOVE</button>
                                    <button className="action-button">SET</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div className="information-box">
                    <h3><FontAwesomeIcon icon={faSuitcase} style={{ marginRight: '18px' }} />Job</h3>
                    <table>
                        <tbody>
                            <tr><td>Name:</td><td>{selectedCharachter.job.name || "unemployes"}</td></tr>
                            <tr><td>Grade:</td><td>{selectedCharachter.job.grade?.name || 'unemployes'}</td></tr>
                            <tr><td><button className="action-button">CHANGE</button></td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="information-box">
                    <h3><FontAwesomeIcon icon={faUserNinja} style={{ marginRight: '18px' }} />Gang</h3>
                    <table>
                        <tbody>
                            <tr><td>Name:</td><td>{selectedCharachter.gang.name || "unemployes"}</td></tr>
                            <tr><td>Grade:</td><td>{selectedCharachter.gang.grade?.name || 'unemployes'}</td></tr>
                            <tr><td><button className="action-button">CHANGE</button></td></tr>
                        </tbody>
                        
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShowCharacterInformation;
