import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShoppingBag, Image, Tag } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import PromptCard from '../blocks/PromptCard';
import OfferCard from '../blocks/OfferCard';

const UserPurchases = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [purchases, setPurchases] = useState({ offers: [], prompts: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'prompts', 'offers'

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                const res = await axios.get(`${API_URL}/users/purchases`, config);
                setPurchases(res.data);
            } catch (error) {
                console.error("Failed to fetch purchases", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPurchases();
        }
    }, [API_URL, user]);

    if (!user) return null;

    const hasPrompts = purchases.prompts.length > 0;
    const hasOffers = purchases.offers.length > 0;
    const isEmpty = !hasPrompts && !hasOffers;

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // if (isEmpty) {
    //    return null; 
    // }

    return (
        <div className="offers-section animate-fade-up">
            <h2 className="dashboard-section-title flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                <ShoppingBag className="text-purple-600" />
                <span>My Purchases</span>
            </h2>

            {/* Tabs if needed, or just list them */}
            {(hasPrompts && hasOffers) && (
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        All Items
                    </button>
                    <button
                        onClick={() => setActiveTab('prompts')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'prompts' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Prompts
                    </button>
                    <button
                        onClick={() => setActiveTab('offers')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'offers' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Offers
                    </button>
                </div>
            )}

            <div className="space-y-8">
                {/* PROMPTS */}
                {(activeTab === 'all' || activeTab === 'prompts') && hasPrompts && (
                    <div>
                        {(activeTab === 'all' && hasOffers) && (
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <Image size={20} /> Unlocked Prompts
                            </h3>
                        )}
                        <div className="carousel-mask">
                            <div className="carousel-track">
                                {purchases.prompts.map((prompt, idx) => (
                                    <div key={`purchased-prompt-${prompt._id || idx}`} className="carousel-card-wrapper">
                                        <PromptCard prompt={prompt} type="public" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* OFFERS */}
                {(activeTab === 'all' || activeTab === 'offers') && hasOffers && (
                    <div>
                        {(activeTab === 'all' && hasPrompts) && (
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                <Tag size={20} /> Unlocked Offers
                            </h3>
                        )}
                        <div className="carousel-mask">
                            <div className="carousel-track">
                                {purchases.offers.map((offer, idx) => (
                                    <div key={`purchased-offer-${offer._id || idx}`} className="carousel-card-wrapper">
                                        <OfferCard offer={offer} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isEmpty && !loading && (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">You haven't purchased any premium items yet.</p>
                </div>
            )}
        </div>
    );
};

export default UserPurchases;
