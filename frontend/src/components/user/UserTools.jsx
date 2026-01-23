import React, { useState } from 'react';
import { Layout, Plus, Wrench, Search, Save } from 'lucide-react';
import ToolCard from '../blocks/ToolCard';

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
                            <ToolCard
                                key={idx}
                                type="custom"
                                tool={tool}
                                onRemove={() => removeCustomItem(tool)}
                            />
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
                            <ToolCard
                                key={tool._id}
                                type="library"
                                tool={tool}
                                isSelected={isSelected}
                                onToggle={() => toggleTool(tool._id)}
                            />
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
