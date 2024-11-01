import useAuth from "../hooks/useAuth";
import transformRole from "../hooks/transfromRole";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import axios from '../api/axios';

import { useRef, useState, useEffect } from "react";

const UserManagment = () => {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const auth = useAuth();
    const username = auth?.auth?.user;
    const roles = transformRole(auth?.auth?.roles);

    const handleToggleMenu = () => {
            setIsMenuVisible(!isMenuVisible);
    };


    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div>
            <div className="navbar">
                <div className="logo">
                    <p> <span className="white">Nickher</span> <span className="red">Panel</span></p>
                </div>
                <div className="userInfo">
                    <div className="info">
                        <p className="username">{username}</p>
                        <p className="userrole">{roles}</p>
                    </div>
                    <img className="icon" src="../../public/userIcon.png"/>
                    <p>
                        <i className="arrow down" onClick={handleToggleMenu}></i>
                    </p>
                    <div className={`menu ${isMenuVisible ? '' : 'hide'}`}>
                        <ul>
                            <li>
                                <p onClick={() => navigate('/')} className="">
                                HOME
                                </p>
                            </li>
                            <li>
                                <p onClick={() => navigate('/settings')} className="">
                                SETTINGS
                                </p>
                            </li>
                            <li>
                                <p onClick={signOut} className="danger">
                                LOGOUT
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserManagment
