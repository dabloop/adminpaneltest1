import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logEmitter from '../utils/logEmitter';
import './PanelLogs.css';
import Sidebar from './Sidebar';
import Header from './Header';
import saveData from '../hooks/saveData';
import getData from '../hooks/getData';
import useAuth from '../hooks/useAuth';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAngleLeft, faAngleRight, faServer, faTriangleExclamation, faCircleCheck, faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Adjust this according to your usage

const PanelLogs = ({ fullView = false }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [logs, setLogs] = useState([]); // Stores all logs for full view
    const [displayedLogs, setDisplayedLogs] = useState([]); // Stores currently displayed popups
    const [currentPage, setCurrentPage] = useState(0);
    const logsPerPage = 5;

    useEffect(() => {
        const handleAddLog = async (log) => {
            const logWithTimestamp = { ...log, timestamp: new Date() };

            // Save log to database
            try {
                await saveData('sql', { type: 'saveLog', log: logWithTimestamp });
            } catch (err) {
                console.error('Failed to save log:', err);
            }

            // Update logs and displayedLogs without duplication
            setLogs((prevLogs) => [logWithTimestamp, ...prevLogs]);
            setDisplayedLogs((prevDisplayedLogs) => [...prevDisplayedLogs, logWithTimestamp]);

            // Remove log from displayedLogs after 5 seconds
            setTimeout(() => {
                setDisplayedLogs((prevDisplayedLogs) =>
                    prevDisplayedLogs.filter((item) => item !== logWithTimestamp)
                );
            }, 5000);
        };

        const handleGetLogs = async () => {
            try {
                const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };
                const getAllLogs = await getData('getAllLogs', requirements);
                const sortedLogs = getAllLogs[0].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setLogs(sortedLogs);
            } catch (err) {
                console.error('Failed to get log:', err);
            }
        };

        handleGetLogs();
        logEmitter.on('addLog', handleAddLog);

        return () => {
            logEmitter.off('addLog', handleAddLog);
        };
    }, [auth]);

    const paginatedLogs = logs.slice(currentPage * logsPerPage, (currentPage + 1) * logsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.floor(logs.length / logsPerPage)));
    };

    
    if (fullView) {
        return (
            <div className="App">
                <Sidebar />
                <Header />  
                <div className="main-content">
                    <div className="url-display">
                        <FontAwesomeIcon icon={faHome} className="icon" onClick={() => {navigate('/myDashboard');}}/>
                        <span className="url-text">{location.pathname}</span>
                    </div>
                    <div className='full-view-logs'>
                        <h2><FontAwesomeIcon icon={faServer} style={{ marginRight: "18px"}} />Panel Logs</h2>
                            <ul>
                                {paginatedLogs.map((log, index) => (
                                    <li key={index} className="log-item">
                                        <h3>{log.title}</h3>
                                        <p>{log.message}</p>
                                        <small>{new Date(log.timestamp).toLocaleString()}</small>
                                    </li>
                                ))}
                            </ul>
                            <div className="log-navigation"> 
                                <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                                <button onClick={handleNextPage} disabled={(currentPage + 1) * logsPerPage >= logs.length}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            // </div>
        );
    }
       
    return (
        <div className="log-popup-container">
            {displayedLogs.map((log, index) => (
                <div key={index} className={`log-popup show ${log.type}`}>
                    <div className="log-popup-content">
                        <h1>{log.type == "error" ? 
                        <FontAwesomeIcon icon={faCircleXmark} style={{ color: "dc3545", marginRight: '10px' }}/>
                        : log.type == "success" ? 
                        <FontAwesomeIcon icon={faCircleCheck} style={{ color: "28a745", marginRight: '10px' }}/>
                        : log.type == "info" ? 
                        <FontAwesomeIcon icon={faCircleInfo} style={{ color: "007bff", marginRight: '10px' }}/>
                        : <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: "f8f9fa", marginRight: '10px' }}/>
                        } {log.title}</h1>
                        <hr />
                        <p>{log.message}</p>
                    </div>
                </div>
            ))}
        </div>
        // <div className={`log-popup ${showPopup ? `show ${currentLog.type}` : ''}`}>
        //     <div className="log-popup-content">
        //         <h1>{currentLog.title}</h1>
        //         <hr />
        //         <br />
        //         <p>{currentLog.message}</p>
        //     </div>
        // </div>
    );

    return (
        <div>
            {/* Popup Logs */}
            <div className="log-popup-container">
                {displayedLogs.map((log, index) => (
                    <div key={index} className={`log-popup show ${log.type}`}>
                        <div className="log-popup-content">
                            <h1>{log.title}</h1>
                            <hr />
                            <p>{log.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full View Logs */}
            {fullView && (
                <div className="full-view-logs">
                    <Sidebar />
                    <Header />
                    <h2>Panel Logs</h2>
                    <ul>
                        {paginatedLogs.map((log, index) => (
                            <li key={index} className="log-item">
                                <h3>{log.title}</h3>
                                <p>{log.message}</p>
                                <small>{new Date(log.timestamp).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                    <div className="log-navigation">
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                        <button onClick={handleNextPage} disabled={(currentPage + 1) * logsPerPage >= logs.length}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PanelLogs;
