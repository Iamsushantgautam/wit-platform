
import { useState } from 'react';
import {
    ExternalLink, ChevronRight
} from 'lucide-react';
import {
    FaInstagram, FaYoutube, FaTelegram, FaTwitter,
    FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin,
    FaGithub, FaTiktok
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
    ProfileHeader,
    ProfileHero,
    ProfileSocials,
    ProfileTools,
    ProfilePrompts,
    ProfileLinks,
    ProfileOffers,
    ProfileUpdates,
    ProfileBottomNav
} from '../public-profile'; // Adjust import path if needed (components/public-profile)

const DashboardProfilePreview = ({ profileData, featureFlags, username, availableTools = [] }) => {
    // We default to 'profile' view for the preview, or we could add tabs to the preview too
    const [activeTab, setActiveTab] = useState('profile');

    // Helper to get icons (same as Profile.jsx)
    const getSocialIcon = (platform) => {
        const icons = {
            instagram: <FaInstagram />, youtube: <FaYoutube />, telegram: <FaTelegram />,
            x: <FaXTwitter />, twitter: <FaTwitter />, facebook: <FaFacebook />,
            whatsapp: <FaWhatsapp />, discord: <FaDiscord />, linkedin: <FaLinkedin />,
            github: <FaGithub />, tiktok: <FaTiktok />
        };
        return icons[platform.toLowerCase()] || <ExternalLink />;
    };

    // Helper for dates
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
        return d.toLocaleDateString();
    };

    // Ensure we have arrays where needed
    const updates = profileData.updates || []; // DashboardData might usually store updates separately
    // Note: In Dashboard.jsx updates are stored in separate state `updates`, not inside `profileData`.
    // We might need to pass `updates` as a prop if we want to show them.

    // Helper: Enrich activeTools if they are just IDs
    const enrichedActiveTools = (profileData.activeTools || []).map(tool => {
        if (typeof tool === 'string') {
            // It's an ID, find the object in availableTools
            return availableTools.find(t => t._id === tool) || tool;
        }
        return tool; // Already an object
    });

    // Construct a profile object compatible with the public profile components
    const profile = {
        ...profileData,
        username: username || 'user',
        activeTools: enrichedActiveTools
    };

    const MockHeader = () => (
        <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-20 rounded-t-[30px]">
            <div className="p-2 -ml-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </div>
            <div className="font-bold text-gray-800 text-lg">Profile</div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                {profile.image ? (
                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-full text-gray-900 relative">
            {/* Header Fix - Anchored to phone-mockup context via absolute if parent is relative */}
            <MockHeader />

            <div className="pt-16 pb-24 px-1"> {/* Added padding for header/footer */}

                {/* PROFILE TAB - SHOW ALL HOME CONTENT */}
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        <ProfileHero profile={profile} username={username} featureFlags={featureFlags} previewMode={true} />

                        {/* Show important links on home */}
                        <ProfileLinks importantLinks={profile?.importantLinks} />

                        {/* Show featured/hero buttons if enabled */}
                        {featureFlags.userHeroButtonsEnabled && profile.heroButtons && (
                            <div className="px-4">
                                {/* Hero Buttons Render Logic if needed, typically inside ProfileHero or separate component */}
                            </div>
                        )}

                        {/* Show Socials */}
                        <ProfileSocials socialLinks={profile?.socialLinks} getSocialIcon={getSocialIcon} />

                        {/* Show Tools if enabled (Home Preview) */}
                        {featureFlags.userToolsEnabled && (
                            <div className="px-4">
                                <ProfileTools profile={profile} limit={4} />
                            </div>
                        )}

                        {/* Show Offers if enabled */}
                        {featureFlags.userOffersEnabled && (
                            <div className="px-4">
                                <ProfileOffers profile={profile} />
                            </div>
                        )}
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && featureFlags.userToolsEnabled && (
                    <div className="p-4 animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold mb-4">My Tools</h2>
                        <ProfileTools profile={profile} />
                    </div>
                )}

                {/* PROMPTS TAB */}
                {activeTab === 'prompts' && featureFlags.userPromptsEnabled && (
                    <div className="p-4 animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold mb-4">Favorite Prompts</h2>
                        <ProfilePrompts profile={profile} />
                    </div>
                )}

                {/* OFFERS TAB */}
                {activeTab === 'offers' && featureFlags.userOffersEnabled && (
                    <div className="p-4 animate-in fade-in duration-300">
                        <ProfileOffers profile={profile} />
                    </div>
                )}

                {/* LINKS TAB */}
                {activeTab === 'links' && featureFlags.userLinksEnabled && (
                    <div className="p-4 animate-in fade-in duration-300 space-y-6">
                        <h2 className="text-xl font-bold">Important Links</h2>
                        <ProfileLinks importantLinks={profile?.importantLinks} />

                        {profile?.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
                            <div>
                                <h2 className="text-xl font-bold mb-3">Social Media</h2>
                                <div className="space-y-2">
                                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                                        if (!url) return null;
                                        return (
                                            <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-xl">{getSocialIcon(platform)}</div>
                                                    <div>
                                                        <div className="font-medium capitalize">{platform}</div>
                                                        <div className="text-xs text-gray-400 truncate max-w-[150px]">{url}</div>
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* UPDATES TAB (Passing updates prop is required if we want real data) */}
                {/* For now let's skip updates in preview or assume they are passed in profileData if refactored */}
            </div>

            {/* Bottom Navigation - Fixed at bottom of phone mockup */}
            {(featureFlags.userNavigationEnabled !== false || featureFlags.userBottomNavEnabled !== false) && (
                <div className="absolute m-19 bottom-0 left-0 right-0 z-20 rounded-b-[30px] overflow-hidden bg-white border-t border-gray-100">
                    <ProfileBottomNav
                        profile={profile}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        featureFlags={featureFlags}
                        updates={updates || []}
                        isPreview={true}
                    />
                </div>
            )}
        </div>
    );
};

export default DashboardProfilePreview;
