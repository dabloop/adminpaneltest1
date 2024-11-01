import axios from "../api/axios";

const getData = async (type, options) => {
    try {
        const response = await axios.get(`/getdata?type=${type}&discordId=${options.discordId ? options.discordId : 1234567890}`, {
            headers: { 
                Authorization: `Bearer ${options.accessToken}` 
            },
            withCredentials: true
        });
        //console.log('Response received:', response.data); // Log the response
        const data = Object.values(response.data);
        
        return data;
    } catch (err) {
        console.error('Error in getData:', err); // Improved error logging
        return [];
    }
}

export default getData;
