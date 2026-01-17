import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Share2, MessageCircle, ExternalLink, User, Layers, Bell, CheckCircle, ChevronRight, Grid, X, Edit, Plus } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTelegram, FaTwitter, FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin, FaGithub, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import QRCode from 'react-qr-code';

const Profile = ({ usernameOverride }) => {
    const params = useParams();
    const username = usernameOverride || params.username;
    const { API_URL, user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [showShare, setShowShare] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isOwner = user && profile && user.username === profile.username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/profiles/u/${username}`);
                setProfile(data);
            } catch (err) {
                if (err.response && err.response.status === 301) {
                    window.location.href = `/u/${err.response.data.redirect}`;
                } else {
                    setError('User not found');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username, API_URL]);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div></div>;
    if (error) return <div className="text-center mt-20 text-gray-500 font-medium">{error}</div>;

    const TabButton = ({ id, label, icon }) => {
        const Icon = icon;
        return (
            <button
                onClick={() => setActiveTab(id)}
                className={`mobile-tab-btn ${activeTab === id ? 'active' : ''}`}
            >
                <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium mt-1">{label}</span>
                {activeTab === id && <span className="mobile-tab-indicator"></span>}
            </button>
        );
    };

    // Social Icon Helper
    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'instagram': return <FaInstagram />;
            case 'youtube': return <FaYoutube />;
            case 'telegram': return <FaTelegram />;
            case 'x': return <FaXTwitter />;
            case 'facebook': return <FaFacebook />;
            case 'whatsapp': return <FaWhatsapp />;
            case 'discord': return <FaDiscord />;
            case 'linkedin': return <FaLinkedin />;
            case 'github': return <FaGithub />;
            case 'tiktok': return <FaTiktok />;
            default: return <ExternalLink />;
        }
    };

    const LinkTreeCard = ({ url, title, icon }) => (
        <a href={url} target="_blank" rel="noreferrer" className="link-tree-card group">
            <div className="link-tree-icon bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <span className="link-tree-text group-hover:text-blue-700 transition-colors">{title}</span>
            <ChevronRight size={18} className="link-tree-chevron group-hover:translate-x-1 transition-transform" />
        </a>
    );

    return (
        <div className="profile-container-wrapper min-h-screen-safe flex justify-center">
            <div className="profile-main-card w-full max-w-mobile bg-white min-h-screen shadow-2xl relative">

                {/* Header Section */}
                <div className="profile-header-card">
                    {/* Top Bar */}
                    <div className="header-top-bar">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
                            <div className="w-4 h-0.5 bg-white mb-1.5"></div>
                            <div className="w-6 h-0.5 bg-white"></div>
                        </button>
                        <h2 className="text-lg font-bold">Profile</h2>

                        {/* Edit Button for Owner or Menu for Visitor */}
                        {isOwner ? (
                            <Link to="/dashboard" className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center gap-2 px-4 shadow-lg backdrop-blur-sm">
                                <Edit size={14} />
                                <span className="text-xs font-bold">Edit Profile</span>
                            </Link>
                        ) : (
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <span className="relative">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full border-2 border-gray-900 box-content"></div>
                                    <div className="header-decoration-1"></div>
                                    <div className="header-decoration-2"></div>
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={profile.image || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                                alt={profile.name}
                                className="profile-avatar-img"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold">{profile.name}</h1>
                            {/* Verified Badge */}
                            <svg className="verified-badge" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <p className="text-gray-400 text-sm mb-2">{profile.category || 'Creator'} | @{username}</p>
                        <p className="text-gray-300 text-sm max-w-[80%] leading-relaxed opacity-90">{profile.bio || 'Digital Creator & Educator'}</p>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 w-full mt-6" style={{ gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowShare(true)}
                                className="action-btn-primary"
                            >
                                <FaWhatsapp size={18} /> Get Help
                            </button>
                            <a
                                href={profile.importantLinks?.[0]?.url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="action-btn-secondary"
                            >
                                <MessageCircle size={18} /> Free Prompts
                            </a>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="profile-bg-blob-1"></div>
                    <div className="profile-bg-blob-2"></div>

                    {/* Desktop Sidebar Navigation */}
                    <div className="desktop-sidebar-nav">
                        <button onClick={() => setActiveTab('profile')} className={`desktop-nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
                            <User size={20} /> Profile
                        </button>
                        <button onClick={() => setActiveTab('courses')} className={`desktop-nav-item ${activeTab === 'courses' ? 'active' : ''}`}>
                            <Layers size={20} /> Courses
                        </button>
                        <button onClick={() => setActiveTab('prompts')} className={`desktop-nav-item ${activeTab === 'prompts' ? 'active' : ''}`}>
                            <Grid size={20} /> Prompts
                        </button>
                    </div>
                </div>



                {/* Content Area */}
                <div className="pb-24 bg-gray-50 min-h-screen-safe profile-content-area">

                    {/* COURSES TAB (Offers) */}
                    {activeTab === 'courses' && (
                        <div className="p-4 space-y-4 animate-in slide-in-from-bottom-4 fade-in">
                            {/* New Launch Banner */}
                            {profile.banners && profile.banners[0] && (
                                <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer mb-6" onClick={() => window.open(profile.banners[0].link, '_blank')}>
                                    <div className="relative z-10 max-w-[70%]">
                                        <h3 className="text-2xl font-bold leading-tight mb-2">{profile.banners[0].title}</h3>
                                        <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">GRAB OFFER</div>
                                        <p className="text-sm text-gray-300 mb-4">Get 20% Off This Weekend!</p>
                                    </div>
                                    <div className="banner-gradient-overlay"></div>
                                    {profile.banners[0].imageUrl && (
                                        <img src={profile.banners[0].imageUrl} className="banner-img-absolute" alt="Banner" />
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between items-center px-1">
                                <h3 className="font-bold text-gray-800">Best Sellers</h3>
                                <button className="text-blue-600 text-xs font-bold">View All</button>
                            </div>

                            <div className="grid grid-cols-2 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                {(profile.banners || []).map((banner, index) => (
                                    <a key={index} href={banner.link} target="_blank" rel="noreferrer" className="course-card">
                                        <div className="course-img-container">
                                            {banner.imageUrl && <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />}
                                            <div className="tag-new">New</div>
                                        </div>
                                        <div className="p-3 flex flex-col flex-1">
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1 leading-tight">{banner.title}</h4>

                                            <div className="flex items-center gap-1 mb-2 mt-auto">
                                                <div className="text-yellow-400 text-xs flex">{'★'.repeat(5)}</div>
                                                <span className="text-[10px] text-gray-400">4.9</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="tag-offer">50% OFF</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB (Linktree Style) */}
                    {activeTab === 'profile' && (
                        <div className="p-4 space-y-6 animate-in slide-in-from-bottom-4 fade-in">

                            {/* Important Links (Top Section) */}
                            <div>
                                <div className="flex justify-between items-center mb-3 px-1">
                                    <h3 className="font-bold text-gray-800">Highlights</h3>
                                    {isOwner && <Link to="/dashboard" className="text-blue-600 text-xs font-bold flex items-center gap-1"><Plus size={12} /> Add New</Link>}
                                </div>
                                <div className="space-y-1">
                                    {(profile.importantLinks || []).map((link, idx) => (
                                        <LinkTreeCard
                                            key={idx}
                                            url={link.url}
                                            title={link.title}
                                            icon={<ExternalLink size={20} />}
                                        />
                                    ))}
                                    {(!profile.importantLinks || profile.importantLinks.length === 0) && (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg text-gray-400 text-sm">No highlights added yet.</div>
                                    )}
                                </div>
                            </div>

                            {/* Social Media Links (Bottom Section) */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 px-1">Connect with me</h3>
                                <div className="space-y-1">
                                    {Object.entries(profile.socialLinks || {}).map(([key, url]) => {
                                        if (!url) return null;
                                        return (
                                            <LinkTreeCard
                                                key={key}
                                                url={url}
                                                title={`Follow me on ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                                icon={getSocialIcon(key)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* UPDATES TAB (Renamed/Used for Prompts based on user flow, but user asked for prompts. I will add a proper Prompts tab) */}
                    {activeTab === 'prompts' && (
                        <div className="p-4 space-y-4 animate-in slide-in-from-bottom-4 fade-in">
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <h3 className="font-bold text-gray-800">Prompt Collection</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {(profile.activeTools || []).filter(t => t.type === 'prompt').map((prompt, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                                        {/* Image Header */}
                                        <div className="h-48 relative overflow-hidden bg-gray-100">
                                            <img
                                                src={prompt.logo}
                                                alt={prompt.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/20 uppercase">
                                                    {prompt.platform || 'AI'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">{prompt.name}</h4>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {(prompt.tags || []).slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Prompt Copy Area */}
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 relative group/copy">
                                                <p className="text-sm text-gray-600 font-mono line-clamp-2">{prompt.prompt}</p>
                                                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover/copy:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(prompt.prompt);
                                                            // Optional: Toast notification
                                                        }}
                                                        className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transform translate-y-2 group-hover/copy:translate-y-0 transition-transform"
                                                    >
                                                        Copy Prompt
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(profile.activeTools || []).filter(t => t.type === 'prompt').length === 0 && (
                                <div className="text-center py-10 opacity-50">
                                    <p>No prompts selected yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Bottom Navigation Bar */}
                <div className="mobile-bottom-nav">
                    <button onClick={() => setActiveTab('profile')} className={`bottom-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}>
                        <User size={20} />
                        <span className="text-[10px]">Profile</span>
                    </button>
                    <button onClick={() => setActiveTab('courses')} className={`bottom-nav-btn ${activeTab === 'courses' ? 'active' : ''}`}>
                        <Layers size={20} />
                        <span className="text-[10px]">Courses</span>
                    </button>
                    <button onClick={() => setActiveTab('prompts')} className={`bottom-nav-btn ${activeTab === 'prompts' ? 'active' : ''}`}>
                        <div className="notification-dot-container">
                            <Grid size={20} />
                            {/* <span className="notification-dot"></span> */}
                        </div>
                        <span className="text-[10px]">Prompts</span>
                    </button>
                    <button onClick={() => setDrawerOpen(true)} className="bottom-nav-btn">
                        <Grid size={20} />
                        <span className="text-[10px]">More</span>
                    </button>
                </div>

                {/* Bottom Drawer (All Links / Edit) */}
                <div className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setDrawerOpen(false)}></div>
                <div className={`bottom-drawer ${drawerOpen ? 'open' : ''}`}>
                    <div className="drawer-header">
                        <h3 className="font-bold text-lg">All Content</h3>
                        <button onClick={() => setDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 space-y-6 pb-20">
                        {/* Drawer content: Just displaying all categories for now */}
                        {isOwner && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2"><Edit size={16} /> Owner Controls</h4>
                                <p className="text-xs text-blue-600 mb-3">You are viewing your own profile. Use these shortcuts to manage your content.</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link to="/dashboard" className="bg-white text-blue-600 py-2 rounded-lg text-sm font-bold text-center border border-blue-200 shadow-sm">Edit Profile</Link>
                                    <Link to="/dashboard" className="bg-blue-600 text-white py-2 rounded-lg text-sm font-bold text-center shadow-lg shadow-blue-500/30">Add Link</Link>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Sections</h4>
                            <button onClick={() => { setActiveTab('courses'); setDrawerOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors mb-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Layers size={20} /></div>
                                <span className="font-bold text-gray-700">All Courses</span>
                                <ChevronRight className="ml-auto text-gray-300" size={18} />
                            </button>
                            <button onClick={() => { setActiveTab('updates'); setDrawerOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors mb-1">
                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><Bell size={20} /></div>
                                <span className="font-bold text-gray-700">Latest Updates</span>
                                <ChevronRight className="ml-auto text-gray-300" size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Share Modal */}
                {showShare && (
                    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowShare(false)}>
                        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold mb-6">Share Profile</h3>
                            <div className="bg-white p-4 rounded-xl shadow-lg border inline-block mb-6">
                                <QRCode value={window.location.href} size={180} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link Copied!') }} className="btn btn-outline py-3 rounded-xl flex items-center justify-center gap-2">
                                    <ExternalLink size={18} /> Copy Link
                                </button>
                                <button onClick={() => setShowShare(false)} className="btn btn-primary py-3 rounded-xl">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;
