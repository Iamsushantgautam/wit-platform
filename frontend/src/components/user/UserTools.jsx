import React, { useState } from 'react';
import { Layout, Plus, Wrench, Trash2, ExternalLink, Search, CheckCircle, Save } from 'lucide-react';

const UserTools = ({
    profileData,
    availableTools,
    openAddToolModal,
    removeCustomItem,
    toggleTool,
    saveProfile,
    saving
}) => {
    const [toolSearch, setToolSearch] = useState('');

    const filteredAvailableTools = availableTools.filter(t =>
        (t.type !== 'prompt') &&
        (t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(toolSearch.toLowerCase()))
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="dashboard-section-title mb-1">
                        <Layout className="text-accent" />
                        <span>AI Stack</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage your featured tools. Add custom tools or select from library.</p>
                </div>
                <button onClick={openAddToolModal} className="btn btn-outline flex items-center gap-2 py-2 px-4 whitespace-nowrap">
                    <Plus size={18} /> Add Custom Tool
                </button>
            </div>

            {/* Custom Tools Section */}
            {profileData.customItems && profileData.customItems.filter(i => (!i.type || i.type === 'tool')).length > 0 && (
                <div className="mb-10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <Wrench size={18} className="text-blue-500" /> Your Custom Tools
                    </h3>
                    <div className="tools-grid">
                        {profileData.customItems.filter(i => (!i.type || i.type === 'tool')).map((tool, idx) => (
                            <article key={idx} className="tool-card relative group">
                                <button
                                    onClick={() => removeCustomItem(tool)}
                                    className="absolute top-2 right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20 hover:bg-red-200"
                                    title="Remove Tool"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="tool-card-header">
                                    <div className="tool-card-logo">
                                        {tool.image ? (
                                            <img src={tool.image} alt={tool.title} />
                                        ) : (
                                            <Wrench className="tool-card-logo-icon" size={24} />
                                        )}
                                    </div>
                                    <div className="tool-card-info">
                                        <h3 className="tool-card-title">{tool.title}</h3>
                                        <span className="tool-card-category">
                                            {tool.category || 'Custom Tool'}
                                        </span>
                                    </div>
                                </div>
                                <p className="tool-card-description line-clamp-3">
                                    {tool.description}
                                </p>
                                <div className="tool-card-action">
                                    <a
                                        href={tool.url || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="tool-card-btn"
                                    >
                                        Visit Website
                                        <ExternalLink size={18} className="tool-card-btn-icon" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            {/* Global Tools Section */}
            <div className="mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Select from Library</h3>

                    {/* Search using AiTools.css classes */}
                    <div className="tools-search-wrapper w-full md:w-64" style={{ margin: 0, paddingBottom: 0, animation: 'none' }}>
                        <div className="tools-search-container">
                            <Search className="tools-search-icon" size={18} />
                            <input
                                type="text"
                                placeholder="Search library..."
                                className="tools-search-input"
                                style={{ padding: '0.5rem 0.5rem 0.5rem 2.5rem', fontSize: '0.875rem' }}
                                value={toolSearch}
                                onChange={(e) => setToolSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Grid using AiTools.css classes */}
                <div className="tools-grid">
                    {filteredAvailableTools.map(tool => {
                        const isSelected = profileData.activeTools.includes(tool._id);
                        return (
                            <div
                                key={tool._id}
                                onClick={() => toggleTool(tool._id)}
                                className={`tool-card ${isSelected ? 'selected' : ''}`}
                                style={{ cursor: 'pointer', padding: '1.5rem' }}
                            >
                                <div className="tool-card-header" style={{ marginBottom: 0 }}>
                                    <div className="tool-card-logo" style={{ width: '3rem', height: '3rem' }}>
                                        {tool.logo ? <img src={tool.logo} alt="" className="w-full h-full object-cover" /> : <Layout size={24} />}
                                    </div>
                                    <div className="tool-card-info">
                                        <h4 className="tool-card-title" style={{ fontSize: '1rem' }}>{tool.name}</h4>
                                        <span className="tool-card-category" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6rem' }}>{tool.category}</span>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="tool-check-badge">
                                        <CheckCircle size={16} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                <Save size={18} />
                {saving ? 'Saving...' : 'Update Stack'}
            </button>
        </div>
    );
};

export default UserTools;
