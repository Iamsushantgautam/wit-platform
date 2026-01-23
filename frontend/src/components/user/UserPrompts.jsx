import React, { useState } from 'react';
import { Megaphone, Plus, Search, Save } from 'lucide-react';
import PromptCard from '../blocks/PromptCard';

const UserPrompts = ({
    profileData,
    availableTools,
    openAddPromptModal,
    openEditPromptModal,
    removeCustomItem,
    toggleTool,
    toggleFavorite,
    handleProfileChange,
    saveProfile,
    saving
}) => {
    const [toolSearch, setToolSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    const filteredAvailablePrompts = availableTools.filter(t =>
        (t.type === 'prompt') &&
        (t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(toolSearch.toLowerCase()))
    );

    const handleCopyPrompt = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // State for View All toggles
    const [viewAllFavorites, setViewAllFavorites] = useState(false);
    const [viewAllCustom, setViewAllCustom] = useState(false);

    // Helper to render section content based on count and view state
    const renderSectionContent = (items, viewAllState, setViewAllState, type = 'library') => {
        const count = items.length;
        const isGrid = count <= 4 || viewAllState;

        return (
            <div className="space-y-4">
                {isGrid ? (
                    <div className="prompts-grid">
                        {items.map((item, idx) => (
                            <PromptCard
                                key={item._id || idx}
                                type={type}
                                prompt={item}
                                isFav={item.isFav}
                                onToggle={type === 'library' ? () => toggleTool(item._id) : undefined}
                                onEdit={type === 'custom' ? () => openEditPromptModal(idx) : undefined}
                                onRemove={type === 'custom' ? () => removeCustomItem(item) : undefined}
                                onFavorite={toggleFavorite}
                                onCopy={handleCopyPrompt}
                                copiedId={copiedId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-purple-500/30 -mx-2 px-2">
                        {items.map((item, idx) => (
                            <div key={item._id || idx} className="min-w-[280px] w-[280px] snap-center">
                                <PromptCard
                                    key={item._id || idx}
                                    type={type}
                                    prompt={item}
                                    isFav={item.isFav}
                                    onToggle={type === 'library' ? () => toggleTool(item._id) : undefined}
                                    onEdit={type === 'custom' ? () => openEditPromptModal(idx) : undefined}
                                    onRemove={type === 'custom' ? () => removeCustomItem(item) : undefined}
                                    onFavorite={toggleFavorite}
                                    onCopy={handleCopyPrompt}
                                    copiedId={copiedId}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {count > 4 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setViewAllState(!viewAllState)}
                            className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-6 py-2 rounded-full text-sm font-bold transition-all"
                        >
                            {viewAllState ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Favorites logic
    const favoritePrompts = availableTools.filter(t =>
        profileData.favoritesPrompts?.some(f => (f._id || f) === t._id)
    );

    return (
        <div className="prompts-section">
            {/* Header: Title + Search + Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="dashboard-section-title mb-1">
                        <Megaphone className="text-accent" />
                        <span>My Prompts Library</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your prompts and public visibility.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* Search Bar MOVED TO TOP */}
                    <div className="prompts-search-wrapper w-full md:w-64">
                        <Search className="prompts-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search prompts..."
                            className="prompts-search-input"
                            value={toolSearch}
                            onChange={(e) => setToolSearch(e.target.value)}
                        />
                    </div>

                    <button onClick={openAddPromptModal} className="btn btn-outline flex items-center justify-center gap-2 py-2 px-4 whitespace-nowrap">
                        <Plus size={18} /> Add Custom
                    </button>

                    <button onClick={saveProfile} disabled={saving} className="btn btn-primary flex items-center justify-center gap-2 py-2 px-4 whitespace-nowrap">
                        <Save size={18} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Public Display Settings */}
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Public Profile Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Which prompts to show on public profile?
                        </label>
                        <select
                            name="publicPromptsDisplay"
                            value={profileData.publicPromptsDisplay || 'all'}
                            onChange={handleProfileChange}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">Show All (Custom + Favorites + Library)</option>
                            <option value="custom">Only Custom Prompts</option>
                            <option value="favorites">Only Favorites</option>
                            <option value="custom_favorites">Custom & Favorites</option>
                            <option value="custom_library">Custom & Library (Selected)</option>
                        </select>
                    </div>
                </div>
            </div>
            <br />
            {/* Favorite Prompts Section */}
            {favoritePrompts.length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Save size={18} className="text-purple-500" /> Your Favorite Prompts
                    </h3><br />
                    {renderSectionContent(
                        favoritePrompts.map(p => ({ ...p, isFav: true })),
                        viewAllFavorites,
                        setViewAllFavorites,
                        'library'
                    )}
                </div>
            )}
            <br />
            {/* Custom Prompts Section */}
            {profileData.customItems && profileData.customItems.filter(i => i.type === 'prompt').length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Megaphone size={18} className="text-purple-500" /> Your Custom Prompts
                    </h3><br />
                    {renderSectionContent(
                        profileData.customItems.filter(i => i.type === 'prompt').map(item => ({
                            ...item,
                            isFav: profileData.favoritesPrompts?.some(f => (f._id || f) === item._id)
                        })),
                        viewAllCustom,
                        setViewAllCustom,
                        'custom'
                    )}
                </div>
            )}
            <br />
            {/* Library Grid (Selection) */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Select from Global Library</h3><br />
                <div className="prompts-grid">
                    {filteredAvailablePrompts.map(tool => {
                        const isFav = profileData.favoritesPrompts?.some(f => (f._id || f) === tool._id);
                        const isSelected = profileData.activeTools.includes(tool._id);

                        return (
                            <PromptCard
                                key={tool._id}
                                type="library"
                                prompt={tool}
                                isSelected={isSelected}
                                isFav={isFav}
                                onToggle={() => toggleTool(tool._id)}
                                onFavorite={toggleFavorite}
                                onCopy={handleCopyPrompt}
                                copiedId={copiedId}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserPrompts;
