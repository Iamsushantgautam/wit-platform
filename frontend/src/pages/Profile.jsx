import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Home, Bell, Layout, MessageCircle, ExternalLink, Share2, Gift, Ticket,
    ChevronRight, ArrowRight
} from 'lucide-react';
import {
    FaInstagram, FaYoutube, FaTelegram, FaTwitter,
    FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin,
    FaGithub, FaTiktok
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
    ProfileHeader,
    ProfileDrawer,
    ProfileHero,
    ProfileSocials,
    ProfileTools,
    ProfilePrompts,
    ProfileLinks,
    ProfileOffers,
    ProfileUpdates,
    ProfileBottomNav
} from '../components/public-profile';
import '../styles/PublicProfile.css';


const Profile = ({ usernameOverride }) => {
    const params = useParams();
    const location = useLocation();
    const username = usernameOverride || params.username;
    const { API_URL, user } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [featureFlags, setFeatureFlags] = useState({
        userToolsEnabled: true,
        userPromptsEnabled: true,
        userOffersEnabled: true,
        userLinksEnabled: true,
        userUpdatesEnabled: true
    });
    const [branding, setBranding] = useState({
        siteName: 'WitHub',
        siteLogo: '',
        siteFavicon: '',
        publicProfileLogoSource: 'site_logo',
        customPublicLogo: ''
    });

    const isOwner = user && profile && user.username === profile.username;

    // Get social icon helper
    const getSocialIcon = (platform) => {
        const icons = {
            instagram: <FaInstagram />, youtube: <FaYoutube />, telegram: <FaTelegram />,
            x: <FaXTwitter />, twitter: <FaTwitter />, facebook: <FaFacebook />,
            whatsapp: <FaWhatsapp />, discord: <FaDiscord />, linkedin: <FaLinkedin />,
            github: <FaGithub />, tiktok: <FaTiktok />
        };
        return icons[platform.toLowerCase()] || <ExternalLink />;
    };

    // Format date helper
    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
        return d.toLocaleDateString();
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, featuresRes] = await Promise.all([
                    axios.get(`${API_URL}/profiles/u/${username}`),
                    axios.get(`${API_URL}/admin/features`)
                ]);
                setProfile(profileRes.data);

                // Handle new API structure vs old (if any)
                if (featuresRes.data.features) {
                    setFeatureFlags(featuresRes.data.features);
                    setBranding({
                        siteName: featuresRes.data.siteName || 'WitHub',
                        siteLogo: featuresRes.data.siteLogo || '',
                        siteFavicon: featuresRes.data.siteFavicon || '',
                        publicProfileLogoSource: featuresRes.data.publicProfileLogoSource || 'site_logo',
                        customPublicLogo: featuresRes.data.customPublicLogo || ''
                    });
                } else {
                    setFeatureFlags(featuresRes.data);
                }

            } catch (err) {
                if (err.response && err.response.status === 301) {
                    window.location.href = `/${err.response.data.redirect}`;
                } else {
                    setError('User not found');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username, API_URL]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'tools', 'prompts', 'offers', 'links', 'updates'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="text-xl font-bold text-gray-800 mb-2">Profile Not Found</div>
            <p className="text-gray-500">{error}</p>
            <Link to="/" className="mt-4 text-blue-600 font-semibold hover:underline">Go Home</Link>
        </div>
    );

    const updates = profile?.updates || [];

    return (
        <div className="profile-page">
            {/* Mobile Header */}
            <ProfileHeader
                activeTab={activeTab}
                profile={profile}
                username={username}
                onMenuToggle={() => setIsMenuOpen(true)}
                branding={branding}
            />

            {/* Menu Drawer */}
            <ProfileDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                profile={profile}
                updates={updates}
                featureFlags={featureFlags}
                branding={branding}
            />

            {/* Main Content */}
            <main className="profile-content">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="profile-tab">
                        <ProfileHero profile={profile} username={username} featureFlags={featureFlags} branding={branding} />
                        <ProfileSocials socialLinks={profile?.socialLinks} getSocialIcon={getSocialIcon} />
                        {/* Important Links */}
                        <ProfileLinks importantLinks={profile?.importantLinks} />
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && featureFlags.userToolsEnabled && profile?.user?.plan !== 'free' && (
                    <div className="profile-courses">
                        <h2 className="profile-section-title" style={{ paddingLeft: '4px' }}>My Tools</h2>
                        <ProfileTools profile={profile} />
                    </div>
                )}

                {/* PROMPTS TAB */}
                {activeTab === 'prompts' && featureFlags.userPromptsEnabled && profile?.user?.plan !== 'free' && (
                    <div className="profile-courses">
                        <h2 className="profile-section-title" style={{ paddingLeft: '4px' }}>Favorite Prompts</h2>
                        <ProfilePrompts profile={profile} featureFlags={featureFlags} />
                    </div>
                )}

                {/* OFFERS TAB */}
                {activeTab === 'offers' && featureFlags.userOffersEnabled && profile?.user?.plan !== 'free' && (
                    <div className="profile-courses">
                        <ProfileOffers profile={profile} />
                    </div>

                )}

                {/* LINKS TAB */}
                {activeTab === 'links' && featureFlags.userLinksEnabled && (
                    <div className="profile-links">
                        <h2 className="profile-section-title">Important Links</h2>
                        <ProfileLinks importantLinks={profile?.importantLinks} />


                        {/* Social Media Links */}
                        {profile?.socialLinks && Object.keys(profile.socialLinks).some(key => profile.socialLinks[key]) && (
                            <>
                                <h2 className="profile-section-title">Social Media</h2>
                                <div className="profile-links-section">
                                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={platform}
                                                href={url.startsWith('http') ? url : `https://${url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="profile-link-item"
                                            >
                                                <div className="profile-link-item__content">
                                                    <div className={`profile-link-item__icon profile-link-item__icon--${platform}`}>
                                                        {getSocialIcon(platform)}
                                                    </div>
                                                    <div className="profile-link-item__text">
                                                        <div className="profile-link-item__title">{platform.charAt(0).toUpperCase() + platform.slice(1)}</div>
                                                        <div className="profile-link-item__url">{url}</div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="profile-link-item__arrow" size={20} />
                                            </a>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {(!profile?.importantLinks || profile.importantLinks.length === 0) &&
                            (!profile?.socialLinks || !Object.keys(profile.socialLinks).some(key => profile.socialLinks[key])) && (
                                <div className="profile-empty-state">
                                    <ExternalLink size={48} className="profile-empty-icon" />
                                    <p className="profile-empty-text">No links added yet</p>
                                </div>
                            )}
                    </div>
                )}

                {/* UPDATES TAB */}
                {activeTab === 'updates' && featureFlags.userUpdatesEnabled && profile?.user?.plan !== 'free' && (
                    <div className="profile-updates">
                        <h2 className="profile-section-title">Recent Updates</h2>
                        <ProfileUpdates updates={updates} formatDate={formatDate} />
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            {(featureFlags.userBottomNavEnabled !== false) && (
                <ProfileBottomNav
                    profile={profile}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    updates={updates}
                    featureFlags={featureFlags}
                />
            )}
        </div>
    );
};

export default Profile;