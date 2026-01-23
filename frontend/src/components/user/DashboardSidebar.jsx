import React from 'react';
import {
    User, Image, Link as LinkIcon, Megaphone, Layout, Bell,
    Palette, QrCode, ShieldAlert, ChevronRight, Settings, MousePointerClick, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardSidebar = ({ activeTab, setActiveTab, user, featureFlags = {} }) => {

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`sidebar-tab ${activeTab === id ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span>{label}</span>
            {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
        </button>
    );

    return (
        <aside className="sidebar-nav">
            <TabButton id="profile" label="Profile Details" icon={User} />
            <TabButton id="appearance" label="Appearance" icon={Image} />
            {featureFlags.userHeroButtonsEnabled && (
                <TabButton id="heroButtons" label="Hero Buttons" icon={MousePointerClick} />
            )}
            {featureFlags.userNavigationEnabled && (
                <TabButton id="navigation" label="Bottom Navigation" icon={Navigation} />
            )}
            {featureFlags.userLinksEnabled && (
                <TabButton id="links" label="Connections & Links" icon={LinkIcon} />
            )}
            {featureFlags.userOffersEnabled && (
                <TabButton id="offers" label="Offers & Banners" icon={Megaphone} />
            )}
            {featureFlags.userToolsEnabled && (
                <TabButton id="tools" label="AI Tools" icon={Layout} />
            )}
            {featureFlags.userPromptsEnabled && (
                <TabButton id="prompts" label="My Prompts" icon={Megaphone} />
            )}
            {featureFlags.userUpdatesEnabled && (
                <TabButton id="updates" label="Updates" icon={Bell} />
            )}
            <TabButton id="customize" label="Customize Profile" icon={Palette} />
            <TabButton id="share" label="Share Profile" icon={QrCode} />

            {user.role === 'master_admin' && (
                <Link to="/admin" className="sidebar-tab text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    <ShieldAlert size={20} />
                    <span>Master Admin</span>
                </Link>
            )}

            <div className="my-6 mx-4 border-t border-gray-100 dark:border-gray-800"></div>
            <TabButton id="account" label="Account Settings" icon={Settings} />
        </aside>
    );
};

export default DashboardSidebar;
