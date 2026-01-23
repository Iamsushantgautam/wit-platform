import React from 'react';
import * as LucideIcons from 'lucide-react';

const ProfileDrawer = ({ isOpen, onClose, activeTab, setActiveTab, profile, updates, featureFlags = {} }) => {
    // Get icon component by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon ? Icon : LucideIcons.Home;
    };

    // Map tab names to feature flags
    const tabFeatureMap = {
        'tools': 'userToolsEnabled',
        'prompts': 'userPromptsEnabled',
        'offers': 'userOffersEnabled',
        'links': 'userLinksEnabled',
        'updates': 'userUpdatesEnabled'
    };

    // Default menu items based on available content
    const getDefaultMenuItems = () => {
        const items = [
            {
                id: 'profile',
                label: 'Profile',
                icon: 'Home',
                tab: 'profile',
                isVisible: true
            }
        ];

        // Add Tools if available
        if (profile?.activeTools?.length > 0 || profile?.customItems?.some(i => !i.type || i.type === 'tool')) {
            items.push({
                id: 'tools',
                label: 'Tools',
                icon: 'Layout',
                tab: 'tools',
                isVisible: true
            });
        }

        // Add Prompts if available
        if (profile?.favoritesPrompts?.length > 0 || profile?.customItems?.some(i => i.type === 'prompt')) {
            items.push({
                id: 'prompts',
                label: 'Prompts',
                icon: 'MessageCircle',
                tab: 'prompts',
                isVisible: true
            });
        }

        // Always show Offers, Links, and Updates
        items.push(
            {
                id: 'offers',
                label: 'Offers',
                icon: 'Gift',
                tab: 'offers',
                isVisible: true
            },
            {
                id: 'links',
                label: 'Links',
                icon: 'ExternalLink',
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
        );

        return items;
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

    // Use custom menu items if available, otherwise use defaults
    let menuItems = (profile?.navigationSettings?.useDefaultHamburger === false &&
        profile?.navigationSettings?.menuItems?.length > 0)
        ? profile.navigationSettings.menuItems
            .filter(item => item.isVisible)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        : getDefaultMenuItems();

    // Apply feature flag filtering
    menuItems = filterByFeatureFlags(menuItems);

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
                        <LucideIcons.X size={24} />
                    </button>
                </div>

                <nav className="profile-drawer__nav">
                    {menuItems.map((item) => {
                        const Icon = getIconComponent(item.icon);
                        const isActive = activeTab === item.tab;
                        const showBadge = item.tab === 'updates' && updates?.length > 0;

                        return (
                            <button
                                key={item.tab || item.id}
                                className={`profile-drawer__item ${isActive ? 'active' : ''}`}
                                onClick={() => handleTabChange(item.tab)}
                            >
                                <Icon size={24} />
                                <span>{item.label}</span>
                                {showBadge && (
                                    <span className="profile-drawer__badge">{updates.length}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default ProfileDrawer;
