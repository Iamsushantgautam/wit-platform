import React from 'react';
import { Menu } from 'lucide-react';

const ProfileHeader = ({ activeTab, profile, username, onMenuToggle, branding }) => {
    const getTabTitle = () => {
        // If visible branding logo is present, we might want to show that instead, or alongside.
        // For now, let's keep tab title but add logo on left if available.
        switch (activeTab) {
            case 'offers': return 'Offers';
            case 'profile': return 'Profile';
            case 'links': return 'Links';
            case 'tools': return 'Tools';
            case 'prompts': return 'Prompts';
            case 'updates': return 'Updates';
            default: return 'Profile';
        }
    };

    return (
        <header className="profile-mobile-header">
            <button
                className="profile-mobile-header__menu-btn"
                onClick={onMenuToggle}
            >
                <Menu size={24} />
            </button>
            <div className="profile-mobile-header__title flex items-center justify-center gap-2">
                {branding?.siteLogo ? (
                    <img src={branding.siteLogo} alt={branding.siteName} style={{ height: '24px', width: 'auto' }} />
                ) : (
                    <span>{branding?.siteName || 'WitHub'}</span>
                )}
            </div>
            <img
                src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                alt="Profile"
                className="profile-mobile-header__avatar"
            />
        </header>
    );
};

export default ProfileHeader;
