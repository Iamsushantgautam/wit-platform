import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Home, Coins, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../components/user/DashboardSidebar';
import UserWallet from '../components/user/UserWallet';
import '../styles/DashboardLayout.css';

const Wallet = () => {
    const { user, API_URL } = useContext(AuthContext);
    const [featureFlags, setFeatureFlags] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/admin/features`);
                if (data.features) {
                    setFeatureFlags(data.features);
                } else {
                    setFeatureFlags(data);
                }
            } catch (error) {
                console.error("Error fetching features", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatures();
    }, [API_URL]);

    if (!user) return <div className="p-10 text-center">Please login</div>;
    if (loading) return <div className="p-10 text-center py-20"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status"></div><p className="mt-4 text-gray-500">Loading your wallet...</p></div>;

    return (
        <div className="container dashboard-container min-h-screen">
            {/* HEADER */}
            <header className="dashboard-header flex justify-between items-center bg-white border-b border-gray-200 px-6 h-16 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 text-gray-400 hover:text-blue-500 rounded-full transition-colors" title="Go Home">
                        <Home size={24} />
                    </Link>
                    <Link to="/dashboard" className="p-2 text-gray-400 hover:text-blue-500 rounded-full transition-colors" title="Dashboard">
                        <Layout size={24} />
                    </Link>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        <span className="text-gray-400">My Wallet</span>
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/30">
                        <Coins size={16} />
                        <span className="text-sm font-black">{user?.coins || 0}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="wallet-page-content">
                <main className="wallet-main-full custom-scrollbar">
                    <div className="content-card">
                        <UserWallet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Wallet;
