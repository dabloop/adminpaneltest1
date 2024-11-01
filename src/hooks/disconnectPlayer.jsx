// import axios from "../api/axios";

// const disconnectPlayer = async (playerId, requirements) => {
//     console.log('Disconnecting player:', playerId);
//     try {
//         const response = await axios.post('/disconnectPlayer',
//             { playerId },
//             {
//                 headers: { 
//                     'Content-Type': 'application/json' ,
//                     Authorization: `Bearer ${options.accessToken}` 
//                 },
//                 // headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true
//             }
//         );
//         // TODO: remove console.logs before deployment
//         console.log(JSON.stringify(response?.data));
//         //console.log(JSON.stringify(response))
//         // setSuccess(true);
//         //clear state and controlled inputs
//     } catch (err) {
//         if (!err?.response) {
//             // setErrMsg('No Server Response');
//         } else if (err.response?.status === 409) {
//             // setErrMsg('Username Taken');
//         } else {
//             // setErrMsg('Registration Failed')
//         }
//     }
// };

// export default disconnectPlayer;


import axios from "../api/axios";

const disconnectPlayer = async (playerId, reason, options) => { 
    console.log('Disconnecting player:', playerId);
    try {
        const response = await axios.post('/disconnectPlayer', 
            { 
                playerId,
                reason
            }, 
            {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${options.accessToken}`
                },
                withCredentials: true
            }


        );
        // TODO: remove console.logs before deployment
        console.log(JSON.stringify(response?.data));
    } catch (err) {
        if (!err?.response) {
            console.error('No Server Response');
        } else if (err.response?.status === 409) {
            console.error('Username Taken');
        } else {
            console.error('Disconnection Failed');
        }
    }
};

export default disconnectPlayer;
