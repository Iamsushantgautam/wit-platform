import React from 'react';
import * as LucideIcons from 'lucide-react';

const ProfileDrawer = ({ isOpen, onClose, activeTab, setActiveTab, profile, updates }) => {
    // Get icon component by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon ? Icon : LucideIcons.Home;
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

    // Use custom menu items if available, otherwise use defaults
    const menuItems = (profile?.navigationSettings?.useDefaultHamburger === false &&
        profile?.navigationSettings?.menuItems?.length > 0)
        ? profile.navigationSettings.menuItems
            .filter(item => item.isVisible)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        : getDefaultMenuItems();

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
