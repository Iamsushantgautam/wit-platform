import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, GripVertical, Tag, Type, CheckCircle, Navigation, Menu } from 'lucide-react';
import '../../styles/HeroButtons.css';

const UserNavigation = ({ profileData, setProfileData, saveProfile, saving }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeSection, setActiveSection] = useState('menu'); // 'menu' or 'bottom'

    // Available tab options
    const availableTabs = [
        { value: 'profile', label: 'Profile' },
        { value: 'tools', label: 'Tools' },
        { value: 'prompts', label: 'Prompts' },
        { value: 'offers', label: 'Courses/Offers' },
        { value: 'links', label: 'Links' },
        { value: 'updates', label: 'Updates' }
    ];

    // Icon options
    const iconOptions = [
        { value: 'User', label: '👤 User' },
        { value: 'Home', label: '🏠 Home' },
        { value: 'FileText', label: '📄 FileText' },
        { value: 'Layout', label: '🎨 Layout' },
        { value: 'MessageCircle', label: '💬 MessageCircle' },
        { value: 'Gift', label: '🎁 Gift' },
        { value: 'ExternalLink', label: '🔗 ExternalLink' },
        { value: 'Bell', label: '🔔 Bell' },
        { value: 'Star', label: '⭐ Star' },
        { value: 'Settings', label: '⚙️ Settings' },
        { value: 'Bookmark', label: '🔖 Bookmark' },
        { value: 'Grid', label: '▦ Grid' },
        { value: 'List', label: '☰ List' }
    ];

    const getNavSettings = () => {
        return profileData.navigationSettings || {
            menuItems: [],
            bottomNavItems: [],
            useDefaultHamburger: true,
            useDefaultBottomNav: true
        };
    };

    const handleToggleHamburgerDefault = () => {
        const currentSettings = getNavSettings();
        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                useDefaultHamburger: !currentSettings.useDefaultHamburger
            }
        });
    };

    const handleToggleBottomNavDefault = () => {
        const currentSettings = getNavSettings();
        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                useDefaultBottomNav: !currentSettings.useDefaultBottomNav
            }
        });
    };

    // Menu Items Functions
    const handleAddMenuItem = () => {
        const currentSettings = getNavSettings();
        const newItem = {
            label: 'New Menu Item',
            icon: 'Home',
            tab: 'profile',
            isVisible: true,
            order: currentSettings.menuItems?.length || 0
        };

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                menuItems: [...(currentSettings.menuItems || []), newItem]
            }
        });
    };

    const handleUpdateMenuItem = (index, field, value) => {
        const currentSettings = getNavSettings();
        const updatedItems = [...(currentSettings.menuItems || [])];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                menuItems: updatedItems
            }
        });
    };

    const handleRemoveMenuItem = (index) => {
        const currentSettings = getNavSettings();
        const updatedItems = (currentSettings.menuItems || []).filter((_, i) => i !== index);

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                menuItems: updatedItems
            }
        });
    };

    const handleMoveMenuItem = (index, direction) => {
        const currentSettings = getNavSettings();
        const items = [...(currentSettings.menuItems || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= items.length) return;

        [items[index], items[newIndex]] = [items[newIndex], items[index]];
        items.forEach((item, idx) => {
            item.order = idx;
        });

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                menuItems: items
            }
        });
    };

    // Bottom Nav Functions
    const handleAddBottomNavItem = () => {
        const currentSettings = getNavSettings();
        const newItem = {
            label: 'New Tab',
            icon: 'Home',
            tab: 'profile',
            isVisible: true,
            order: currentSettings.bottomNavItems?.length || 0
        };

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                bottomNavItems: [...(currentSettings.bottomNavItems || []), newItem]
            }
        });
    };

    const handleUpdateBottomNavItem = (index, field, value) => {
        const currentSettings = getNavSettings();
        const updatedItems = [...(currentSettings.bottomNavItems || [])];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
        };

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                bottomNavItems: updatedItems
            }
        });
    };

    const handleRemoveBottomNavItem = (index) => {
        const currentSettings = getNavSettings();
        const updatedItems = (currentSettings.bottomNavItems || []).filter((_, i) => i !== index);

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                bottomNavItems: updatedItems
            }
        });
    };

    const handleMoveBottomNavItem = (index, direction) => {
        const currentSettings = getNavSettings();
        const items = [...(currentSettings.bottomNavItems || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= items.length) return;

        [items[index], items[newIndex]] = [items[newIndex], items[index]];
        items.forEach((item, idx) => {
            item.order = idx;
        });

        setProfileData({
            ...profileData,
            navigationSettings: {
                ...currentSettings,
                bottomNavItems: items
            }
        });
    };

    const handleSave = async () => {
        await saveProfile();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const navSettings = getNavSettings();
    const menuItems = navSettings.menuItems || [];
    const bottomNavItems = navSettings.bottomNavItems || [];

    // Render navigation item editor
    const renderNavItemEditor = (item, index, type) => {
        const isMenu = type === 'menu';
        const handleUpdate = isMenu ? handleUpdateMenuItem : handleUpdateBottomNavItem;
        const handleRemove = isMenu ? handleRemoveMenuItem : handleRemoveBottomNavItem;
        const handleMove = isMenu ? handleMoveMenuItem : handleMoveBottomNavItem;
        const items = isMenu ? menuItems : bottomNavItems;

        return (
            <div key={index} className="hero-button-card">
                <div className="hero-button-card-header">
                    <div className="hero-button-card-title">
                        <GripVertical size={20} style={{ marginRight: '8px', cursor: 'grab' }} />
                        {isMenu ? 'Menu Item' : 'Tab'} {index + 1}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => handleUpdate(index, 'isVisible', !item.isVisible)}
                            className={`visibility-toggle ${item.isVisible
                                ? 'visibility-toggle--visible'
                                : 'visibility-toggle--hidden'
                                }`}
                        >
                            {item.isVisible ? (
                                <>
                                    <Eye size={16} />
                                    Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff size={16} />
                                    Hidden
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="visibility-toggle"
                            style={{
                                backgroundColor: '#fee2e2',
                                borderColor: '#ef4444',
                                color: '#991b1b'
                            }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="hero-button-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Type className="form-label-icon" size={16} />
                                {isMenu ? 'Menu' : 'Tab'} Label
                            </label>
                            <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                                placeholder="e.g. Profile, Tools, Links"
                                className="form-input"
                            />
                            <span className="form-hint">Text displayed to users</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Tag className="form-label-icon" size={16} />
                                Icon
                            </label>
                            <select
                                value={item.icon}
                                onChange={(e) => handleUpdate(index, 'icon', e.target.value)}
                                className="form-select"
                            >
                                {iconOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="form-hint">Icon shown in navigation</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Navigation className="form-label-icon" size={16} />
                            Navigate To
                        </label>
                        <select
                            value={item.tab}
                            onChange={(e) => handleUpdate(index, 'tab', e.target.value)}
                            className="form-select"
                        >
                            {availableTabs.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <span className="form-hint">Which section to display when clicked</span>
                    </div>

                    <div className="form-row" style={{ marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="btn btn-outline"
                            style={{ opacity: index === 0 ? 0.5 : 1 }}
                        >
                            ↑ Move Up
                        </button>
                        <button
                            type="button"
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === items.length - 1}
                            className="btn btn-outline"
                            style={{ opacity: index === items.length - 1 ? 0.5 : 1 }}
                        >
                            ↓ Move Down
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="hero-buttons-container">
            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    <CheckCircle className="success-icon" size={24} />
                    <span>Navigation settings saved successfully!</span>
                </div>
            )}

            {/* Header */}
            <div className="hero-buttons-header">
                <h2 className="hero-buttons-title">
                    <Navigation size={32} style={{ marginRight: '10px' }} />
                    Profile Navigation
                </h2>
                <p className="hero-buttons-subtitle">
                    Customize the menu and bottom navigation on your public profile
                </p>
            </div>

            {/* Section Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveSection('menu')}
                    className={`hero-button-card ${activeSection === 'menu' ? 'active' : ''}`}
                    style={{
                        flex: 1,
                        cursor: 'pointer',
                        padding: '1.5rem',
                        border: activeSection === 'menu' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        background: activeSection === 'menu' ? '#eff6ff' : 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Menu size={32} color={activeSection === 'menu' ? '#3b82f6' : '#6b7280'} />
                    <span style={{ fontWeight: 600, color: activeSection === 'menu' ? '#3b82f6' : '#1f2937' }}>
                        Hamburger Menu
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {menuItems.length} items
                    </span>
                </button>
                <button
                    onClick={() => setActiveSection('bottom')}
                    className={`hero-button-card ${activeSection === 'bottom' ? 'active' : ''}`}
                    style={{
                        flex: 1,
                        cursor: 'pointer',
                        padding: '1.5rem',
                        border: activeSection === 'bottom' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        background: activeSection === 'bottom' ? '#eff6ff' : 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Navigation size={32} color={activeSection === 'bottom' ? '#3b82f6' : '#6b7280'} />
                    <span style={{ fontWeight: 600, color: activeSection === 'bottom' ? '#3b82f6' : '#1f2937' }}>
                        Bottom Navigation
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {bottomNavItems.length} items
                    </span>
                </button>
            </div>

            {/* Hamburger Menu Section */}
            {activeSection === 'menu' && (
                <>
                    {/* Hamburger Default Toggle */}
                    <div className="hero-button-card" style={{ marginBottom: '2rem' }}>
                        <div className="hero-button-card-header">
                            <div className="hero-button-card-title">
                                Menu Configuration
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleHamburgerDefault}
                                className={`visibility-toggle ${navSettings.useDefaultHamburger
                                    ? 'visibility-toggle--visible'
                                    : 'visibility-toggle--hidden'
                                    }`}
                            >
                                {navSettings.useDefaultHamburger ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Use Default
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Use Custom
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="form-hint" style={{ marginTop: '1rem' }}>
                            {navSettings.useDefaultHamburger
                                ? 'Using smart default menu items based on your profile content.'
                                : 'Custom menu active. Customize items below.'}
                        </p>
                    </div>

                    {!navSettings.useDefaultHamburger && (
                        <>
                            {menuItems.map((item, index) => renderNavItemEditor(item, index, 'menu'))}

                            <button
                                type="button"
                                onClick={handleAddMenuItem}
                                className="hero-button-card"
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    padding: '2rem',
                                    border: '2px dashed #cbd5e1',
                                    background: 'transparent'
                                }}
                            >
                                <Plus size={24} />
                                <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Add Menu Item</span>
                            </button>
                        </>
                    )}
                </>
            )}

            {/* Bottom Navigation Section */}
            {activeSection === 'bottom' && (
                <>
                    {/* Bottom Nav Default Toggle */}
                    <div className="hero-button-card" style={{ marginBottom: '2rem' }}>
                        <div className="hero-button-card-header">
                            <div className="hero-button-card-title">
                                Bottom Bar Configuration
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleBottomNavDefault}
                                className={`visibility-toggle ${navSettings.useDefaultBottomNav
                                    ? 'visibility-toggle--visible'
                                    : 'visibility-toggle--hidden'
                                    }`}
                            >
                                {navSettings.useDefaultBottomNav ? (
                                    <>
                                        <CheckCircle size={18} />
                                        Use Default
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Use Custom
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="form-hint" style={{ marginTop: '1rem' }}>
                            {navSettings.useDefaultBottomNav
                                ? 'Using default tabs (Profile, Courses, Updates).'
                                : 'Custom bottom navigation active. Customize tabs below.'}
                        </p>
                    </div>

                    {!navSettings.useDefaultBottomNav && (
                        <>
                            {bottomNavItems.map((item, index) => renderNavItemEditor(item, index, 'bottom'))}

                            <button
                                type="button"
                                onClick={handleAddBottomNavItem}
                                className="hero-button-card"
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    padding: '2rem',
                                    border: '2px dashed #cbd5e1',
                                    background: 'transparent'
                                }}
                            >
                                <Plus size={24} />
                                <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Add Bottom Nav Item</span>
                            </button>
                        </>
                    )}
                </>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="save-button"
                style={{ marginTop: '20px' }}
            >
                {saving ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <CheckCircle size={20} />
                        Save Navigation Settings
                    </>
                )}
            </button>
        </div>
    );
};

export default UserNavigation;
