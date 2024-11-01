import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import getData from '../../hooks/getData';
import useAuth from '../../hooks/useAuth';

import '../../index.css';

import Sidebar from '../Sidebar';
import Header from '../Header';
import GetCharacters from './getCharacters'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome} from '@fortawesome/free-solid-svg-icons';

function SearchAllCharacters({ allPannelUsers }) {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    const location = useLocation();
    

    const signOut = async () => {
        await logout();
        navigate('/login');
    }
    
    const [characters, setCharacters] = useState([]);

    const fetchData = async () => {
        try {
            const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
            const fetchedCharacters = [];

            for (let user of allPannelUsers) {
                const getUserCharactersData = await getData(`getUserCharactersData-${user.id}`, requirements);
                if (getUserCharactersData && getUserCharactersData.length > 0) {
                    fetchedCharacters.push(...getUserCharactersData[0]);
                }
            }
            // console.log(fetchedCharacters)
            setCharacters(fetchedCharacters);
        } catch (error) {
            console.error('Failed to fetch player data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [auth, allPannelUsers]);


    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 300); // End transition after loading
    }, [characters]);

    return (
        <div className="App">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="url-display">
                    <FontAwesomeIcon icon={faHome} className="icon" onClick={() => {navigate('/myDashboard');}}/> 
                    <span className="url-text">{location.pathname}</span>
                </div>
                <div className={`canTransition ${isLoading ? 'vanish' : 'appear'}`}>
                    <GetCharacters title='All Characters' characters={characters}/>
                </div>
                {/* Render characters or a message if no characters are found */}
                {/* {characters.length > 0 ? (
                    <div>
                        {characters.map((character, index) => (
                            <div key={index}>{character.name}</div>
                        ))}
                    </div>
                ) : (
                    <div>No characters found.</div>
                )} */}
                <br />
            </div>
        </div>
    );
}

export default SearchAllCharacters;
