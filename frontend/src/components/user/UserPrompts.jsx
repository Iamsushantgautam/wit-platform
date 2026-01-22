import React, { useState } from 'react';
import {
    Megaphone, Plus, Trash2, Check, Copy, Search, Save, Heart, CheckCircle, Edit
} from 'lucide-react';

const UserPrompts = ({
    profileData,
    availableTools,
    openAddPromptModal,
    openEditPromptModal,
    removeCustomItem,
    toggleTool,
    toggleFavorite,
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

    return (
        <div className="prompts-section">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="dashboard-section-title mb-1">
                        <Megaphone className="text-accent" />
                        <span>My Prompts Library</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your prompts. Add custom prompts or select from library.
                    </p>
                </div>
                <button onClick={openAddPromptModal} className="btn btn-outline flex items-center gap-2 py-2 px-4 whitespace-nowrap">
                    <Plus size={18} /> Add Custom Prompt
                </button>
            </div>

            {/* Custom Prompts  form */}
            {profileData.customItems && profileData.customItems.filter(i => i.type === 'prompt').length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Megaphone size={18} className="text-purple-500" /> Your Custom Prompts
                    </h3>
                    <div className="prompts-grid">
                        {profileData.customItems.filter(i => i.type === 'prompt').map((prompt, idx) => (
                            <article key={idx} className="prompt-card relative group">
                                <div className="prompt-image-wrap">
                                    {prompt.image ? (
                                        <img src={prompt.image} alt={prompt.title} className="prompt-image" />
                                    ) : (
                                        <div className="prompt-image bg-slate-800 flex items-center justify-center">
                                            <Megaphone className="text-slate-600" size={48} />
                                        </div>
                                    )}
                                    <div className="prompt-overlay" />

                                    <div className="prompt-top-row">
                                        <span className="prompt-chip" title={prompt.title}>
                                            {prompt.title}
                                        </span>
                                        <div className="prompt-top-row-actions">
                                            <span className="prompt-chip prompt-chip--platform" style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)' }}>
                                                {prompt.category || 'Custom'}
                                            </span>
                                            <button
                                                onClick={() => openEditPromptModal(idx)}
                                                className="prompt-icon-btn hover:bg-blue-500/20 hover:text-blue-400"
                                                title="Edit Prompt"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeCustomItem(prompt)}
                                                className="prompt-icon-btn hover:bg-red-500/20 hover:text-red-400"
                                                title="Remove Prompt"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="prompt-body">
                                        <p className="prompt-text line-clamp-3">
                                            <span className="font-bold text-slate-400 mr-2">Prompt:</span>
                                            {prompt.prompt}
                                        </p>
                                        <div className="prompt-footer">
                                            <button
                                                type="button"
                                                className={`prompt-copy-btn ${copiedId === prompt ? 'prompt-copy-btn--success' : ''}`}
                                                onClick={() => handleCopyPrompt(prompt.prompt, prompt)}
                                            >
                                                {copiedId === prompt ? (
                                                    <><Check size={14} /> Copied</>
                                                ) : (
                                                    <><Copy size={14} /> Copy Prompt</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            {/* Library Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Select from Library</h3>

                {/* Search using modified Prompts.css classes */}
                <div className="prompts-search-wrapper">
                    <Search className="prompts-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        className="prompts-search-input"
                        value={toolSearch}
                        onChange={(e) => setToolSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="prompts-grid">
                {filteredAvailablePrompts.map(tool => {
                    const isFav = profileData.favoritesPrompts?.some(f => (f._id || f) === tool._id);
                    const isSelected = profileData.activeTools.includes(tool._id);

                    return (
                        <div
                            key={tool._id}
                            onClick={() => toggleTool(tool._id)}
                            className={`prompt-card ${isSelected ? 'selected' : ''}`}
                        >
                            <div className="prompt-image-wrap">
                                {tool.logo ? (
                                    <img src={tool.logo} alt={tool.name} className="prompt-image" />
                                ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600">
                                        <Megaphone size={40} />
                                    </div>
                                )}

                                <div className="prompt-overlay" />

                                <div className="prompt-top-row">
                                    <span className="prompt-chip prompt-chip--platform">
                                        {tool.platform || 'AI'}
                                    </span>
                                    {isSelected && (
                                        <div className="ml-auto bg-purple-600 text-white rounded-full p-1 shadow-lg">
                                            <CheckCircle size={16} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                <div className="prompt-body">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md line-clamp-1">{tool.name}</h3>
                                        <button
                                            className={`btn-favorite ${isFav ? 'active' : ''} bg-black/50 hover:bg-black/70`}
                                            onClick={(e) => toggleFavorite(e, tool._id)}
                                            style={{ borderRadius: '50%', padding: '0.4rem' }}
                                        >
                                            <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : "text-white"} />
                                        </button>
                                    </div>
                                    <p className="prompt-text line-clamp-3 text-sm text-gray-200 mb-3" title={tool.description}>
                                        {tool.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-purple-300' : 'text-gray-400'}`}>
                                            {isSelected ? 'Selected' : 'Tap to select'}
                                        </span>
                                        <span className="prompt-meta-tag text-xs bg-black/40 px-2 py-1 rounded">
                                            {tool.category}
                                        </span>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="prompt-check-badge">
                                        <CheckCircle size={32} fill="white" className="text-purple-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Library'}
            </button>
        </div>
    );
};

export default UserPrompts;
