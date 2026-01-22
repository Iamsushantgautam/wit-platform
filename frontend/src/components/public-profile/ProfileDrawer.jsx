import React from 'react';
import { X, Home, Layout, MessageCircle, Gift, ExternalLink, Bell } from 'lucide-react';

const ProfileDrawer = ({ isOpen, onClose, activeTab, setActiveTab, profile, updates }) => {
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`profile-drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside className={`profile-drawer ${isOpen ? 'open' : ''}`}>
                <div className="profile-drawer__header">
                    <h2 className="profile-drawer__title">Menu</h2>
                    <button className="profile-drawer__close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="profile-drawer__nav">
                    <button
                        className={`profile-drawer__item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabChange('profile')}
                    >
                        <Home size={24} />
                        <span>Profile</span>
                    </button>

                    {(profile?.activeTools?.length > 0 || profile?.customItems?.some(i => !i.type || i.type === 'tool')) && (
                        <button
                            className={`profile-drawer__item ${activeTab === 'tools' ? 'active' : ''}`}
                            onClick={() => handleTabChange('tools')}
                        >
                            <Layout size={24} />
                            <span>Tools</span>
                        </button>
                    )}

                    {(profile?.favoritesPrompts?.length > 0 || profile?.customItems?.some(i => i.type === 'prompt')) && (
                        <button
                            className={`profile-drawer__item ${activeTab === 'prompts' ? 'active' : ''}`}
                            onClick={() => handleTabChange('prompts')}
                        >
                            <MessageCircle size={24} />
                            <span>Prompts</span>
                        </button>
                    )}

                    <button
                        className={`profile-drawer__item ${activeTab === 'offers' ? 'active' : ''}`}
                        onClick={() => handleTabChange('offers')}
                    >
                        <Gift size={24} />
                        <span>Offers</span>
                    </button>

                    <button
                        className={`profile-drawer__item ${activeTab === 'links' ? 'active' : ''}`}
                        onClick={() => handleTabChange('links')}
                    >
                        <ExternalLink size={24} />
                        <span>Links</span>
                    </button>

                    <button
                        className={`profile-drawer__item ${activeTab === 'updates' ? 'active' : ''}`}
                        onClick={() => handleTabChange('updates')}
                    >
                        <Bell size={24} />
                        <span>Updates</span>
                        {updates.length > 0 && (
                            <span className="profile-drawer__badge">{updates.length}</span>
                        )}
                    </button>
                </nav>
            </aside>
        </>
    );
};

export default ProfileDrawer;
