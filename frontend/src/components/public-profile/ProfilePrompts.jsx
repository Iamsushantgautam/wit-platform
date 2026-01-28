import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MessageCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import PromptCard from '../blocks/PromptCard';


const PROMPTS_PER_PAGE = 9;

const ProfilePrompts = ({ profile, featureFlags = {} }) => {
    const { API_URL, user, setUser } = useContext(AuthContext);
    const [copiedId, setCopiedId] = useState(null);
    const [globalPrompts, setGlobalPrompts] = useState([]);
    const [loadingGlobal, setLoadingGlobal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const mode = profile.publicPromptsDisplay || 'all';

    // 1. Custom Prompts
    const customPrompts = (profile?.customItems?.filter(i => i && i.type === 'prompt' && i.visibility !== 'private') || []);

    // 2. Favorites
    const showGlobalPublic = featureFlags.globalLibraryPublicEnabled !== false;
    // Filter favorites to exclude locked paid items (User Request)
    const favoritePrompts = showGlobalPublic
        ? (profile?.favoritesPrompts || []).filter(p => {
            if (!p) return false;
            // Check locked
            if (!p.isPaid) return true;
            const isUnlocked = user?.unlockedPrompts?.some(u =>
                (typeof u === 'string' ? u === p._id : u._id === p._id)
            );
            return isUnlocked;
        })
        : [];

    // 3. Website Prompts (Global Library) - Replaces "Selected" prompts
    // Fetch if logic permits
    // Logic: If 'all' or 'custom_library' is selected AND global library is public enabled.
    // User Update: Premium users can enable "only website prompts". So we restore logic but dependent on 'mode'.
    const showLibrary = showGlobalPublic && ['all', 'custom_library', 'library_only'].includes(mode);

    useEffect(() => {
        const fetchGlobalPrompts = async () => {
            if (showLibrary) {
                setLoadingGlobal(true);
                try {
                    const token = localStorage.getItem('token');
                    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                    const res = await axios.get(`${API_URL}/prompts`, config);
                    setGlobalPrompts(res.data);
                } catch (error) {
                    console.error("Error fetching global prompts", error);
                } finally {
                    setLoadingGlobal(false);
                }
            }
        };
        fetchGlobalPrompts();
    }, [showLibrary, API_URL]);

    // Filter Global Prompts
    // Deduplication: If favorites are SHOWN, hide them from the main list.
    const showFavorites = showGlobalPublic && ['all', 'favorites', 'custom_favorites'].includes(mode) && favoritePrompts.length > 0;

    // We also show custom prompts if mode allows
    const showCustom = ['all', 'custom', 'custom_favorites', 'custom_library'].includes(mode) && customPrompts.length > 0;

    const filteredGlobalPrompts = globalPrompts.filter(gp => {
        // Exclude locked items (User Request)
        if (gp.isPaid) {
            const isUnlocked = user?.unlockedPrompts?.some(u =>
                (typeof u === 'string' ? u === gp._id : u._id === gp._id)
            );
            if (!isUnlocked) return false;
        }

        // Search filter
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = (gp.name || gp.title || '').toLowerCase().includes(lowerSearch) ||
            (gp.description || '').toLowerCase().includes(lowerSearch) ||
            (gp.category || '').toLowerCase().includes(lowerSearch);
        if (!matchesSearch) return false;

        // Deduplicate against favorites if favorites are visible
        if (showFavorites) {
            const gpId = (gp._id || gp).toString();
            const isFav = favoritePrompts.some(fp => (fp._id || fp).toString() === gpId);
            if (isFav) return false;
        }
        return true;
    });

    // Pagination Logic
    const indexOfLastPrompt = currentPage * PROMPTS_PER_PAGE;
    const indexOfFirstPrompt = indexOfLastPrompt - PROMPTS_PER_PAGE;
    const currentGlobalPrompts = filteredGlobalPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);
    const totalPages = Math.ceil(filteredGlobalPrompts.length / PROMPTS_PER_PAGE);

    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleCopy = (text, prompt) => {
        navigator.clipboard.writeText(text);
        setCopiedId(prompt._id || prompt);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShare = async (prompt) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: prompt.title || prompt.name,
                    text: prompt.prompt || prompt.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            handleCopy(prompt.prompt || prompt.description, prompt);
        }
    };

    const handleUnlock = async (prompt) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        if (!window.confirm(`Unlock this prompt for ${prompt.price} coins?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`${API_URL}/transactions/unlock`, {
                itemId: prompt._id,
                itemType: 'prompt'
            }, config);

            // Update local state
            setGlobalPrompts(prev => prev.map(p => p._id === prompt._id ? res.data.item : p));

            // Update user balance AND unlocked items in context
            if (setUser && res.data.remainingCoins !== undefined) {
                setUser(prev => ({
                    ...prev,
                    coins: res.data.remainingCoins,
                    unlockedPrompts: [...(prev.unlockedPrompts || []), res.data.item]
                }));
            }
            alert('Prompt unlocked successfully!');
        } catch (error) {
            console.error('Unlock failed', error);
            alert(error.response?.data?.message || 'Failed to unlock prompt');
        }
    };

    if (!showCustom && !showFavorites && !showLibrary) {
        return (
            <div className="profile-empty-state">
                <MessageCircle size={48} className="profile-empty-icon" />
                <p className="profile-empty-text">No prompts visible</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12">

            {/* Custom Prompts Section (Horizontal Scroll) */}
            {showCustom && (
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">
                        Created By {profile.name}
                    </h3>

                    {/* MASK */}
                    <div className="carousel-mask">
                        {/* SCROLL TRACK */}
                        <div className="carousel-track">
                            {customPrompts.map((prompt, idx) => (
                                <div
                                    key={`custom-${idx}`}
                                    className="carousel-card-wrapper"
                                >
                                    <PromptCard
                                        prompt={prompt}
                                        type="public"
                                        onCopy={handleCopy}
                                        onShare={handleShare}
                                        copiedId={copiedId}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}



            {/* Favorites Section (Horizontal Scroll) */}
            {showFavorites && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">Favorite Prompts</h3>
                    <div className="carousel-mask">
                        {/* SCROLL TRACK */}
                        <div className="carousel-track">
                            {favoritePrompts.map((prompt, idx) => (
                                <div key={`fav-${idx}`} className="carousel-card-wrapper">
                                    <PromptCard
                                        prompt={prompt}
                                        type="public"
                                        onCopy={handleCopy}
                                        onShare={handleShare}
                                        copiedId={copiedId}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Website Prompts (Global Library) */}
            {showLibrary && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white px-1">Website Prompts</h3>

                    {loadingGlobal ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4 bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-800">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Website Library...</p>
                        </div>
                    ) : filteredGlobalPrompts.length > 0 ? (
                        <div className="carousel-mask">
                            <div className="carousel-track">
                                {filteredGlobalPrompts.map((prompt, idx) => (
                                    <div
                                        key={`global-${prompt._id || idx}`}
                                        className="carousel-card-wrapper"
                                    >
                                        <PromptCard
                                            prompt={prompt}
                                            type="public"
                                            onCopy={handleCopy}
                                            onShare={handleShare}
                                            copiedId={copiedId}
                                            onUnlock={handleUnlock}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
                            <p>No website prompts found.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ProfilePrompts;
