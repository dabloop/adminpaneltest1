import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getData from './hooks/getData';
import useAuth from './hooks/useAuth';

import PanelLogs from './components/panelLogs';
import Loading from './components/Loading';

import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import PersistLogin from './components/PersistLogin';
import Layout from './components/Layout';
import Login from './components/Login';
import Missing from './components/Missing';

import MyDashboard from './components/MyDashboard/MyDashboard';
import SearchAllPlayers from './components/SearchAllPlayers/SearchAllPlayers';
import SearchOnlinePlayers from './components/SearchOnlinePlayers/SearchOnlinePlayers';
import RecentDisconnections from './components/RecentDisconnections/RecentDisconnections';
import StaffManager from './components/StaffManager/StaffManager';
import SearchAllVehicles from './components/VehicleSearch/SearchAllVehicles';
import SearchAllCharacters from './components/SearchAllCharacters/SearchAllCharacters';

const ROLES = {
    "Owner": 8,
    "Developer": 7,
    "Server Manager": 6,
    "Management": 5,
    "Staff Manager": 4,
    "Head Admin": 3,
    "Senior Admin": 2,
    "Admin": 1,
};

let allRoles = Object.values(ROLES);

function App() {
    const { auth } = useAuth();
    const [data, setData] = useState({ OnlinePlayers: [], AllPlayers: [], StaffPlayers: [], AllVehicles: [] });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const requirements = { discordId: auth?.discordId, accessToken: auth?.accessToken };

        const fetchData = async () => {
            try {
                const getAllPlayers = await getData('getAllPlayers', requirements);
                const getAllStaffs = await getData('getAllStaffMembers', requirements);
                const getAllVehicles = await getData('getAllVehicles', requirements);

                setData({
                    OnlinePlayers: [], // Assuming this data is optional
                    AllPlayers: getAllPlayers[0],
                    StaffPlayers: getAllStaffs[0],
                    AllVehicles: getAllVehicles[0],
                });

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setLoading(false);
            }
        };

        if (auth.accessToken) {
            fetchData();
            const intervalId = setInterval(fetchData, 60000);
            return () => clearInterval(intervalId);
        }
    }, [auth]);

    if (loading) return <Loading />;
    
    console.log(auth)
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route element={<PersistLogin />}>
                <Route element={<RequireAuth allowedRoles={[1,2,3]} />}>
                        <Route path="/myDashboard" element={<MyDashboard />} />
                        <Route path="/players" element={<SearchAllPlayers players={data.AllPlayers} onlinePlayers={data.OnlinePlayers} />} />
                        <Route path="/players/:playerId" element={<SearchAllPlayers players={data.AllPlayers} onlinePlayers={data.OnlinePlayers} />} />
                    
                        <Route path="/onlinePlayers" element={<SearchOnlinePlayers players={data.AllPlayers} />} />
                        {/* <Route path="/onlinePlayersSearch" element={<SearchOnlinePlayers players={data.OnlinePlayers} />} /> */}

                        {/* <Route path="/" element={<MyDashboard />} /> */}

                        <Route element={<RequireAuth allowedRoles={[3]} />}>
                            <Route path="/panelLogs" element={<PanelLogs fullView={true} />} />
                        </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[3]} />}>
                            <Route path="/players/:playerId/characters/:charactarId" element={<SearchAllPlayers players={data.AllPlayers} onlinePlayers={data.OnlinePlayers} />} />
                            <Route path="/vehicles" element={<SearchAllVehicles vehicles={data.AllVehicles} />} />
                            <Route path="/characters" element={<SearchAllCharacters allPannelUsers={data.AllPlayers} />} />
                            <Route path="/recentDisconnections" element={<RecentDisconnections RecentPlayers={data.OnlinePlayers} />} />

                            <Route path="/staffManager" element={<StaffManager players={data.StaffPlayers} />} />
                            {/* <Route path="/" element={<MyDashboard />} /> */}
                    </Route>
                </Route>


                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    );
}

export default App;
