import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });
    const persist = true;

    // const setAuthAndPersist = (data) => {
    //     setAuth(data);
    //     localStorage.setItem('auth', JSON.stringify(data));
    // };

    return (
        <AuthContext.Provider value={{  auth, setAuth, persist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}
