import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Megaphone, Plus, Search, Save, Star, Globe, History, Layout, CheckCircle } from 'lucide-react';
import PromptCard from '../blocks/PromptCard';
import AuthContext from '../../context/AuthContext';
import '../../styles/tab-switcher.css';

const UserPrompts = ({
    profileData,
    availablePrompts = [],
    setAvailablePrompts,
    featureFlags = {},
    openAddPromptModal,
    openEditPromptModal,
    removeCustomItem,
    toggleTool,
    toggleFavorite,
    handleProfileChange,
    saveProfile,
    saving
}) => {
    const { user, setUser, API_URL } = useContext(AuthContext); // Added setUser
    const [toolSearch, setToolSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [activeSection, setActiveSection] = useState('collection'); // collection, library, settings

    // Redirect if library is disabled
    const isLibraryEnabled = featureFlags.globalLibraryEnabled !== false;
    const currentSection = (!isLibraryEnabled && activeSection === 'library') ? 'collection' : activeSection;
    if (currentSection !== activeSection) setActiveSection(currentSection);

    const filteredAvailablePrompts = isLibraryEnabled
        ? availablePrompts.filter(t => {
            // Filter out locked items
            if (t.isPaid) {
                const isUnlocked = user?.unlockedPrompts?.some(u =>
                    (typeof u === 'string' ? u === t._id : u._id === t._id)
                );
                if (!isUnlocked) return false;
            }
            return (t.title || t.name || '').toLowerCase().includes(toolSearch.toLowerCase()) ||
                (t.category || '').toLowerCase().includes(toolSearch.toLowerCase());
        })
        : [];

    const handleCopyPrompt = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Favorites logic - Show ALL favorites (locked or unlocked)
    const favoritePrompts = availablePrompts.filter(t =>
        profileData.favoritesPrompts?.some(f => (f._id || f) === t._id)
    );

    const customPrompts = profileData.customItems?.filter(i => i.type === 'prompt') || [];

    // Total Items: Custom + Favorites
    const totalPrompts = customPrompts.length + favoritePrompts.length;

    const handleUnlock = async (prompt) => {
        if (!user) return;
        if (!window.confirm(`Unlock this prompt for ${prompt.price} coins?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.post(`${API_URL}/transactions/unlock`, {
                itemId: prompt._id,
                itemType: 'prompt'
            }, config);

            // Update available prompts state
            if (setAvailablePrompts) {
                // Ensure the item object has isLocked: false explicitly if needed, but the object from DB usually doesn't have isLocked property. 
                // However, we just need it to match the ID in user.unlockedPrompts.
                setAvailablePrompts(prev => prev.map(p => p._id === prompt._id ? res.data.item : p));
            }

            // Update user balance AND unlocked items in context
            if (setUser && res.data.remainingCoins !== undefined) {
                setUser(prev => ({
                    ...prev,
                    coins: res.data.remainingCoins,
                    // Add the new unlocked item object to the list so checking logic works
                    unlockedPrompts: [...(prev.unlockedPrompts || []), res.data.item]
                }));
            }

            alert('Prompt unlocked successfully!');
        } catch (error) {
            console.error('Unlock failed', error);
            alert(error.response?.data?.message || 'Failed to unlock prompt');
        }
    };

    return (
        <div className="prompts-section animate-in fade-in duration-500">
            {/* Header: Title & Main Actions */}
            <div className="dashboard-header">
                <div className="dashboard-header-left">
                    <h2 className="dashboard-title">
                        <Megaphone className="dashboard-title-icon" />
                        <span>Prompts Library</span>
                    </h2>
                    <p className="dashboard-subtitle">
                        Manage your curated collection of AI prompts.
                    </p>
                </div>

                <div className="dashboard-header-actions">
                    <button
                        onClick={openAddPromptModal}
                        className="btn btn-premium"
                    >
                        <Plus size={18} />
                        Add Custom
                    </button>

                    <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="btn btn-primary"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Update Stack"}
                    </button>
                </div>
            </div>


            {/* Stats Bar */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Items</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white uppercase">{totalPrompts}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Custom</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white uppercase">{customPrompts.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Favorites</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white uppercase">{favoritePrompts.length}</p>
                </div>
                <br></br>
            </div>

            {/* Content Tabs */}
            <div className="flex flex-col gap-6">
                <div className="tab-switcher">
                    <button
                        onClick={() => setActiveSection("collection")}
                        className={`tab-btn ${activeSection === "collection" ? "tab-active" : ""}`}
                    >
                        <Layout size={16} />
                        <span>
                            Collection
                            <span className="tab-count">({totalPrompts})</span>
                        </span>
                    </button>

                    {/* Admin Store Tab Removed per User Request */}
                    {/* 
                    {isLibraryEnabled && (
                        <button
                            onClick={() => setActiveSection("library")}
                            className={`tab-btn ${activeSection === "library" ? "tab-active" : ""}`}
                        >
                            <Globe size={16} />
                            <span>
                                Admin Store
                                <span className="tab-count">({filteredAvailablePrompts.length})</span>
                            </span>
                        </button>
                    )} 
                    */}

                    <button
                        onClick={() => setActiveSection("settings")}
                        className={`tab-btn ${activeSection === "settings" ? "tab-active" : ""}`}
                    >
                        <History size={16} />
                        <span>Settings</span>
                    </button>
                </div>


                {/* Sub-Header with Search (only for library) */}
                {activeSection === 'library' && (
                    <div className="flex items-center gap-4 animate-in slide-in-from-top-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search global prompts library..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                value={toolSearch}
                                onChange={(e) => setToolSearch(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* --- MY COLLECTION TAB --- */}
                {activeSection === 'collection' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Custom Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                    <Plus size={18} />
                                </span>
                                <h3 className="section-subtitle">Your Custom Prompts</h3>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                            </div>

                            {customPrompts.length > 0 ? (
                                <div className="relative">
                                    {/* Carousel Mask */}
                                    <div className="carousel-mask">
                                        {/* Carousel Track */}
                                        <div className="carousel-track">
                                            {customPrompts.map((item, idx) => (
                                                <div
                                                    key={`custom-${idx}`}
                                                    className="carousel-card-wrapper"
                                                >
                                                    <PromptCard
                                                        type="custom"
                                                        prompt={item}
                                                        isFav={profileData.favoritesPrompts?.some(
                                                            f => (f._id || f) === item._id
                                                        )}
                                                        onEdit={() => openEditPromptModal(idx)}
                                                        onRemove={() => removeCustomItem(item)}
                                                        onFavorite={toggleFavorite}
                                                        onCopy={handleCopyPrompt}
                                                        copiedId={copiedId}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-center">
                                    <p className="text-gray-400 text-sm mb-4">
                                        You have not created any custom prompts yet.
                                    </p>
                                    <button
                                        onClick={openAddPromptModal}
                                        className="text-purple-600 font-bold hover:underline"
                                    >
                                        Create your first prompt
                                    </button>
                                </div>
                            )}
                        </section>


                        {/* Favorites Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-lg">
                                    <Star size={18} />
                                </span>
                                <h3 className="section-subtitle">Favorite Library Prompts</h3>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                            </div>

                            {favoritePrompts.length > 0 ? (
                                <div className="relative">
                                    {/* Carousel Mask */}
                                    <div className="carousel-mask">
                                        {/* Carousel Track */}
                                        <div className="carousel-track">
                                            {favoritePrompts.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="carousel-card-wrapper"
                                                >
                                                    <PromptCard
                                                        type="library"
                                                        prompt={item}
                                                        isFav={true}
                                                        onFavorite={toggleFavorite}
                                                        onCopy={handleCopyPrompt}
                                                        copiedId={copiedId}
                                                        onUnlock={handleUnlock}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-center">
                                    <p className="text-gray-400 text-sm">
                                        Follow the Browse Library tab to find and favorite prompts.
                                    </p>
                                </div>
                            )}
                        </section>

                    </div>
                )}

                {/* --- BROWSE LIBRARY TAB --- */}
                {activeSection === 'library' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Globe size={18} />
                            </span>
                            <h3 className="section-subtitle">Global Collection</h3>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1"></div>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                {filteredAvailablePrompts.length} ITEMS
                            </span>
                        </div>

                        {/* Carousel */}
                        <div className="relative">
                            <div className="carousel-mask">
                                <div className="carousel-track">
                                    {filteredAvailablePrompts.map(tool => (
                                        <div
                                            key={tool._id}
                                            className="carousel-card-wrapper"
                                        >
                                            <PromptCard
                                                type="library"
                                                prompt={tool}
                                                isFav={profileData.favoritesPrompts?.some(
                                                    f => (f._id || f) === tool._id
                                                )}
                                                onFavorite={toggleFavorite}
                                                onCopy={handleCopyPrompt}
                                                copiedId={copiedId}
                                                onUnlock={handleUnlock}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- SETTINGS TAB --- */}
                {activeSection === "settings" && (
                    <div className="userprompt-settings animate-in">
                        <div className="userprompt-settings-header">
                            <span className="userprompt-settings-icon">
                                <CheckCircle size={18} />
                            </span>
                            <h3 className="userprompt-settings-title">
                                Public Profile Settings
                            </h3>
                            <div className="userprompt-divider"></div>
                        </div>

                        <div className="userprompt-settings-card">
                            <label className="userprompt-settings-label">
                                Choose what prompts appear on your page
                            </label>

                            <div className="userprompt-settings-options">
                                {[
                                    {
                                        id: "all",
                                        label: "All Collection",
                                        desc: "Full registry of all your prompts"
                                    },
                                    {
                                        id: "custom",
                                        label: "Only Custom Prompts",
                                        desc: "Show only what you created"
                                    },
                                    {
                                        id: "favorites",
                                        label: "Only Favorites",
                                        desc: "Curated list of items you favorited"
                                    },
                                    {
                                        id: "custom_favorites",
                                        label: "Custom and Favorites",
                                        desc: "Your creations plus favorites"
                                    },
                                    {
                                        id: "custom_library",
                                        label: "Custom and Website Prompts",
                                        desc: "Your creations plus full global library"
                                    }
                                ].map(option => (
                                    <label
                                        key={option.id}
                                        className={`userprompt-option ${profileData.publicPromptsDisplay === option.id
                                            ? "userprompt-option-active"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="publicPromptsDisplay"
                                            value={option.id}
                                            checked={profileData.publicPromptsDisplay === option.id}
                                            onChange={handleProfileChange}
                                            className="userprompt-option-radio"
                                        />

                                        <div className="userprompt-option-content">
                                            <p className="userprompt-option-title">
                                                {option.label}
                                            </p>
                                            <p className="userprompt-option-desc">
                                                {option.desc}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-purple-500/20">
                <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black mb-1 italic">SAVE YOUR CHANGES</h4>
                    <p className="text-purple-100 text-sm font-medium">Don't forget to sync your library to your public profile.</p>
                </div>
                <button
                    onClick={saveProfile}
                    disabled={saving}
                    className=" btn-primary w-full md:w-auto px-10 py-4 bg-white text-purple-700 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-3 border-purple-700 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                        <Save size={24} />
                    )}
                    {saving ? 'SYNCING...' : 'SYNC LIBRARY'}
                </button>
            </div>
        </div>
    );
};

export default UserPrompts;
