import axios from "../api/axios";

const saveData = async (type, data) => {
    try {
        const response = await axios.post('/savedata',
            JSON.stringify({ type, data }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        return response.data; // return the response if successful
    } catch (err) {
        throw err; // rethrow the error so it can be caught by the caller
    }
};

export default saveData;
