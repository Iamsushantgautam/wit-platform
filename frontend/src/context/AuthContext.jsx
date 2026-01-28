import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Allow dynamic base URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    console.log("Current API_URL:", API_URL);

    const [siteName, setSiteName] = useState('WitHub');
    const [siteLogo, setSiteLogo] = useState('');

    useEffect(() => {
        const fetchGlobalSettings = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/admin/features`); // Public endpoint
                if (data.siteName) setSiteName(data.siteName);
                if (data.siteLogo) setSiteLogo(data.siteLogo);

                if (data.siteName) document.title = data.siteName;

                // Update favicon
                if (data.siteFavicon) {
                    const link = document.querySelector("link[rel~='icon']");
                    if (link) {
                        link.href = data.siteFavicon;
                    } else {
                        const newLink = document.createElement('link');
                        newLink.rel = 'icon';
                        newLink.href = data.siteFavicon;
                        document.head.appendChild(newLink);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch global settings", error);
            }
        };

        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const { data } = await axios.get(`${API_URL}/users/me`, config);
                    setUser({ ...data, token });
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        // Run both
        fetchGlobalSettings();
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const register = async (username, email, password) => {
        const { data } = await axios.post(`${API_URL}/users`, { username, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, API_URL, siteName, siteLogo }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
