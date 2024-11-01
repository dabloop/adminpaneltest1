
// const Home = () => {

//     return (
//         <section>
//             <h1>Home</h1>
//             <br />
//             <p>You are logged in!</p>
//             <br />
//             <Link to="/editor">Go to the Editor page</Link>
//             <br />
//             <Link to="/admin">Go to the Admin page</Link>
//             <br />
//             <Link to="/lounge">Go to the Lounge</Link>
//             <br />
//             <Link to="/linkpage">Go to the link page</Link>
//             <div className="flexGrow">
//                 <button onClick={signOut}>Sign Out</button>
//             </div>
//         </section>
//     )
// }

// export default Home
import useAuth from "../hooks/useAuth";
import transformRole from "../hooks/transfromRole";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Users from './Users'
import useLogout from "../hooks/useLogout";


const Home = () => {
    
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    
    const handleToggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };
    
    const navigate = useNavigate();
    const logout = useLogout();
    
    const signOut = async () => {
        await logout();
        navigate('/login');
    }


    const auth = useAuth();
    const username = auth?.auth?.user
    const roles = transformRole(auth?.auth?.roles)

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
                    {
                        roles === 'Owner' ? (
                            <ul>
                                <li>
                                    <p onClick={() => navigate('/settings')} className="">
                                    SETTINGS
                                    </p>
                                </li>
                                <li>
                                    <p onClick={() => navigate('/user-management')} className="">
                                    USER MANAGEMENT
                                    </p>
                                </li>
                                <li>
                                    <p onClick={signOut} className="danger">
                                    LOGOUT
                                    </p>
                                </li>
                            </ul>
                        ) : (
                            <ul>
                                {/* <li>
                                    <p onClick={() => navigate('/settings')} className="">
                                    SETTINGS
                                    </p>
                                </li> */}
                                <li>
                                    <p onClick={signOut} className="danger">
                                    LOGOUT
                                    </p>
                                </li>
                            </ul>
                        )
                    }
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default Home;