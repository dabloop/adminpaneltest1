import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);
            return {
                ...prev,
                userId: response.data.userId,
                discordId: response.data.discordId,
                roles: response.data.roles,
                user: response.data.user,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
