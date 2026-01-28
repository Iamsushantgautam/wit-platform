import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    User, Link as LinkIcon, Megaphone, Layout, Bell,
    Palette, QrCode, ShieldAlert, ChevronRight, Settings, MousePointerClick, Navigation,
    Grid, X, Lock, Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardSidebar = ({ activeTab, setActiveTab, user, featureFlags = {} }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isPremium = ['pro', 'premium'].includes(user.plan) || user.role === 'master_admin';

    // Define all tabs in an array for better management
    const allTabs = [
        { id: 'profile', label: 'Profile', icon: User },

        { id: 'tools', label: 'Tools', icon: Layout, condition: featureFlags.userToolsEnabled, locked: !isPremium },
        { id: 'links', label: 'Links', icon: LinkIcon, condition: featureFlags.userLinksEnabled },
        { id: 'offers', label: 'Offers', icon: Megaphone, condition: featureFlags.userOffersEnabled, locked: !isPremium },
        { id: 'prompts', label: 'Prompts', icon: Megaphone, condition: featureFlags.userPromptsEnabled, locked: !isPremium },
        { id: 'heroButtons', label: 'Buttons', icon: MousePointerClick, condition: featureFlags.userHeroButtonsEnabled },
        { id: 'navigation', label: 'Nav', icon: Navigation, condition: featureFlags.userNavigationEnabled, locked: !isPremium },
        { id: 'updates', label: 'Updates', icon: Bell, condition: featureFlags.userUpdatesEnabled, locked: !isPremium },
        { id: 'customize', label: 'Customize', icon: Palette },
        { id: 'share', label: 'Share', icon: QrCode },
        { id: 'wallet', label: 'Wallet', icon: Coins, path: '/wallet' },
        { id: 'account', label: 'Account', icon: Settings },
    ].filter(tab => tab.condition !== false); // Filter out disabled features


    const TabButton = ({ id, label, icon: Icon, onClick, path, className }) => (
        path ? (
            <Link
                to={path}
                className={`sidebar-tab ${activeTab === id ? 'active' : ''} ${className || ''}`}
                onClick={onClick}
            >
                <Icon size={24} className="mb-1" />
                <span className="text-[8px] font-small">{label}</span>
                <ChevronRight size={16} className="ml-auto hidden md:block" />
            </Link>
        ) : (
            <button
                onClick={onClick || (() => setActiveTab(id))}
                className={`sidebar-tab ${activeTab === id ? 'active' : ''} ${className || ''}`}
            >
                <Icon size={24} className="mb-1" />
                <span className="text-[8px] font-small">{label}</span>
                {/* Show chevron only on desktop vertical layout if needed (CSS hides it on mobile) */}
                <ChevronRight size={16} className="ml-auto hidden md:block" />
            </button>
        )
    );

    // Desktop View (Vertical Sidebar - Image Match via Custom CSS)
    const DesktopSidebar = () => (
        <div className="sidebar-menu-list desktop-only-menu">
            {allTabs.map(tab => (
                tab.path ? (
                    <Link
                        key={tab.id}
                        to={tab.path}
                        className={`sidebar-menu-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <div className="relative">
                            <tab.icon size={24} />
                            {tab.locked && (
                                <div className="absolute -top-1 -right-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full p-0.5 border border-white dark:border-slate-800">
                                    <Lock size={10} />
                                </div>
                            )}
                        </div>
                        <span>{tab.label}</span>
                    </Link>
                ) : (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`sidebar-menu-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <div className="relative">
                            <tab.icon size={24} />
                            {tab.locked && (
                                <div className="absolute -top-1 -right-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full p-0.5 border border-white dark:border-slate-800">
                                    <Lock size={10} />
                                </div>
                            )}
                        </div>
                        <span>{tab.label}</span>
                    </button>
                )
            ))}

            {user.role === 'master_admin' && (
                <div className="master-admin-separator">
                    <Link to="/admin" className="sidebar-menu-btn btn-master-admin-desktop">
                        <ShieldAlert size={24} />
                        <span>Master Admin</span>
                    </Link>
                </div>
            )}
        </div>
    );

    // Mobile/Tablet View (Bottom Bar 3 Items + More)
    const MobileBottomNav = () => {
        // Select top 3 important tabs + More
        const mainTabs = allTabs.slice(0, 3);

        return (
            <div className="mobile-only-nav">
                {mainTabs.map(tab => (
                    <TabButton
                        key={tab.id}
                        {...tab}
                    />
                ))}

                {/* More Button */}
                <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className={`sidebar-tab ${isMenuOpen ? 'active' : ''}`}
                >
                    <Grid size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">More</span>
                </button>
            </div>
        );
    };

    // Mobile Grid Menu Overlay with Swipe Down to Close
    const MobileMenuOverlay = () => {
        const [startY, setStartY] = useState(0);
        const [currentY, setCurrentY] = useState(0);
        const [isDragging, setIsDragging] = useState(false);

        // Auto-close on resize to desktop
        useEffect(() => {
            const handleResize = () => {
                if (window.innerWidth >= 768) {
                    setIsMenuOpen(false);
                }
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        if (!isMenuOpen || !mounted) return null;

        const handleTouchStart = (e) => {
            setStartY(e.touches[0].clientY);
            setIsDragging(true);
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) { // Only allow dragging down
                setCurrentY(deltaY);
            }
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
            if (currentY > 100) { // Threshold to close
                setIsMenuOpen(false);
            }
            setCurrentY(0);
        };

        // Render portal to document.body to bypass parent styles
        return createPortal(
            <>
                {/* Backdrop */}
                <div
                    className="mobile-menu-backdrop"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Content - Fixed above Bottom Nav (80px) */}
                <div
                    className="mobile-menu-overlay animate-in slide-in-from-bottom"
                    style={
                        isDragging || currentY > 0
                            ? {
                                transform: `translateY(${currentY}px)`,
                                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                            }
                            : {}
                    }
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header Area (Fixed at top of sheet) */}
                    <div
                        className="mobile-menu-header"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="mobile-menu-handle" />
                        <h3 className="section-title-sm">Menu</h3>

                        {/* Close Button - Top Right */}
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="mobile-menu-close"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Scrollable Grid Area */}
                    <div className="mobile-menu-grid">
                        {allTabs.map(tab => (
                            tab.path ? (
                                <Link
                                    key={tab.id}
                                    to={tab.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`menu-grid-item ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <div className="menu-grid-icon relative">
                                        <tab.icon size={26} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                                        {tab.locked && (
                                            <div className="absolute -top-1 -right-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full p-0.5 border border-white dark:border-slate-800">
                                                <Lock size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="menu-grid-label">
                                        {tab.label}
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`menu-grid-item ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <div className="menu-grid-icon relative">
                                        <tab.icon size={26} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                                        {tab.locked && (
                                            <div className="absolute -top-1 -right-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full p-0.5 border border-white dark:border-slate-800">
                                                <Lock size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="menu-grid-label">
                                        {tab.label}
                                    </span>
                                </button>
                            )
                        ))}

                        {user.role === 'master_admin' && (
                            <div className="master-admin-container">
                                <Link to="/admin" className="btn-master-admin">
                                    <ShieldAlert size={20} />
                                    Master Admin
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </>,
            document.body
        );
    };

    return (
        <>
            <aside className="sidebar-nav w-full h-full">
                <DesktopSidebar />
                <MobileBottomNav />
            </aside>
            <MobileMenuOverlay />
        </>
    );
};

export default DashboardSidebar;
