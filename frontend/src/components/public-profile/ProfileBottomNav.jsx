import React from 'react';
import * as LucideIcons from 'lucide-react';

const ProfileBottomNav = ({ profile, activeTab, setActiveTab, updates, featureFlags = {} }) => {
    // Get icon component by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon ? Icon : LucideIcons.Home;
    };

    // Default bottom nav items
    const defaultNavItems = [
        {
            id: 'profile',
            label: 'Profile',
            icon: 'User',
            tab: 'profile',
            isVisible: true
        },
        {
            id: 'Links',
            label: 'Links',
            icon: 'FileText',
            tab: 'links',
            isVisible: true
        },
        {
            id: 'updates',
            label: 'Updates',
            icon: 'Bell',
            tab: 'updates',
            isVisible: true
        }
    ];

    // Map tab names to feature flags
    const tabFeatureMap = {
        'tools': 'userToolsEnabled',
        'prompts': 'userPromptsEnabled',
        'offers': 'userOffersEnabled',
        'links': 'userLinksEnabled',
        'updates': 'userUpdatesEnabled'
    };

    // Filter items based on feature flags
    const filterByFeatureFlags = (items) => {
        return items.filter(item => {
            const featureKey = tabFeatureMap[item.tab];
            // If there's no feature flag for this tab, always show it (e.g., profile tab)
            if (!featureKey) return true;
            // Otherwise, check if the feature is enabled
            return featureFlags[featureKey] !== false;
        });
    };

    // Use custom nav items if available, otherwise use defaults
    let navItems = (profile?.navigationSettings?.useDefaultBottomNav === false &&
        profile?.navigationSettings?.bottomNavItems?.length > 0)
        ? profile.navigationSettings.bottomNavItems
            .filter(item => item.isVisible)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        : defaultNavItems;

    // Apply feature flag filtering
    navItems = filterByFeatureFlags(navItems);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Scroll to top when changing tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="profile-bottom-nav">
            {navItems.map((item) => {
                const Icon = getIconComponent(item.icon);
                const isActive = activeTab === item.tab;
                const showBadge = item.tab === 'updates' && updates?.length > 0;

                return (
                    <button
                        key={item.tab || item.id}
                        onClick={() => handleTabChange(item.tab)}
                        className={`profile-bottom-nav__item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={24} />
                        <span className="profile-bottom-nav__label">{item.label}</span>
                        {showBadge && (
                            <span className="profile-bottom-nav__badge">{updates.length}</span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default ProfileBottomNav;
