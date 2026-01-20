import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Home, BookOpen, Bell, Menu, Search, Star,
    ExternalLink, Share2, Grid, Copy, CheckCircle,
    ChevronRight, ArrowRight, Flag, Filter, Award
} from 'lucide-react';
import {
    FaInstagram, FaYoutube, FaTelegram, FaTwitter,
    FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin,
    FaGithub, FaTiktok
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import QRCode from 'react-qr-code';

const Profile = ({ usernameOverride }) => {
    // --- Data & Logic ---
    const params = useParams();
    const location = useLocation();
    const username = usernameOverride || params.username;
    const { API_URL, user } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('courses'); // Default to Courses as per request focus
    const [showShare, setShowShare] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isOwner = user && profile && user.username === profile.username;

    // Fetch Profile
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

    // Tab Sync
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'courses', 'prompts', 'updates'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    // Social Icon Helper
    const getSocialIcon = (platform) => {
        const icons = {
            instagram: <FaInstagram />, youtube: <FaYoutube />, telegram: <FaTelegram />,
            x: <FaXTwitter />, facebook: <FaFacebook />, whatsapp: <FaWhatsapp />,
            discord: <FaDiscord />, linkedin: <FaLinkedin />, github: <FaGithub />,
            tiktok: <FaTiktok />
        };
        return icons[platform] || <ExternalLink />;
    };

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

    // --- UI Components ---

    const SidebarItem = ({ id, icon: Icon, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
            <span>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
        </button>
    );

    const BottomNavItem = ({ id, icon: Icon, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center py-1 flex-1 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'
                }`}
        >
            <Icon size={24} className={active ? 'fill-current' : 'stroke-current'} />
            <span className="text-[10px] font-medium mt-1">{label}</span>
        </button>
    );

    const Badge = ({ children, type }) => {
        const styles = {
            new: 'bg-blue-600 text-white',
            trending: 'bg-purple-600 text-white',
            bestseller: 'bg-orange-500 text-white',
            discount: 'bg-green-100 text-green-700 border border-green-200'
        };
        return (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide ${styles[type] || 'bg-gray-100 text-gray-600'}`}>
                {children}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 font-sans text-slate-900">

            {/* 1. Mobile Header (Sticky) */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40 md:hidden">
                <button className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <Menu size={24} />
                </button>
                <div className="font-bold text-lg">
                    {activeTab === 'courses' ? 'Courses' :
                        activeTab === 'profile' ? 'Profile' :
                            activeTab === 'prompts' ? 'Prompts' : 'Updates'}
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                    <img
                        src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </header>

            {/* 2. Desktop Sidebar (Fixed) */}
            <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex-col p-6 z-30">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                        {profile.name ? profile.name[0] : 'W'}
                    </div>
                    <div className="font-bold text-xl tracking-tight">{profile.name || 'WitHub'}</div>
                </div>

                <nav className="space-y-1 flex-1">
                    <SidebarItem id="courses" icon={BookOpen} label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                    <SidebarItem id="profile" icon={Home} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SidebarItem id="prompts" icon={Star} label="Prompts" active={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')} />
                    <SidebarItem id="updates" icon={Bell} label="Updates" active={activeTab === 'updates'} onClick={() => setActiveTab('updates')} />
                </nav>

                {isOwner && (
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                            <Grid size={18} /> Dashboard
                        </Link>
                    </div>
                )}

                <div className="mt-6 text-xs text-center text-gray-400">
                    © 2026 WitHub Platform
                </div>
            </aside>

            {/* 3. Main Content Area */}
            <main className="pt-20 pb-24 px-4 md:pt-8 md:pb-10 md:px-10 md:ml-72 max-w-7xl mx-auto">

                {/* === COURSES TAB === */}
                {activeTab === 'courses' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Hero Banner */}
                        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white aspect-[5/4] sm:aspect-[3/1] shadow-xl group">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=2000&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                                    alt="Hero"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-center items-start z-10">
                                <span className="inline-block bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider shadow-lg shadow-blue-600/30">
                                    Limited Time Offer
                                </span>
                                <h1 className="text-3xl sm:text-5xl font-black mb-3 leading-tight max-w-lg">
                                    5-in-1 AI <br />
                                    <span className="text-blue-400">Viral Course Pack</span>
                                </h1>
                                <p className="text-gray-300 mb-8 font-medium text-sm sm:text-lg max-w-sm">
                                    Get 20% Off This Weekend Only! Master the art of AI content creation.
                                </p>
                                <button className="bg-white text-slate-900 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2 transform active:scale-95">
                                    GRAB OFFER <ArrowRight size={18} />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-6 left-6 flex gap-2">
                                    <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
                                    <div className="w-2 h-1.5 bg-white/20 rounded-full"></div>
                                    <div className="w-2 h-1.5 bg-white/20 rounded-full"></div>
                                </div>
                            </div>

                            {/* Right Image (Desktop Only) */}
                            <div className="hidden sm:block absolute bottom-0 right-10 w-1/3 h-[90%] pointer-events-none">
                                <img
                                    src="https://res.cloudinary.com/dj2pvb25l/image/upload/v1710609312/pointing-model_y6t4uv.png"
                                    className="w-full h-full object-contain object-bottom drop-shadow-2xl opacity-0 sm:opacity-100 transition-opacity duration-700"
                                    onError={(e) => e.target.style.display = 'none'}
                                    alt="Model"
                                />
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="sticky top-16 md:top-0 z-20 bg-white md:bg-transparent py-2">
                            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
                                {['Premium Courses', 'Free Courses', 'Best Sellers', 'New Arrivals'].map((filter, i) => (
                                    <button
                                        key={filter}
                                        className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all snap-start ${i === 0
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                                                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(profile?.banners || []).map((banner, idx) => (
                                <a
                                    key={idx}
                                    href={banner.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden h-full"
                                >
                                    {/* Card Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img
                                            src={banner.imageUrl || `https://source.unsplash.com/random/400x300?sig=${idx}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={banner.title}
                                        />
                                        <div className="absolute top-3 left-3">
                                            {idx % 2 === 0 ? <Badge type="new">New</Badge> : <Badge type="bestseller">Bestseller</Badge>}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {banner.title}
                                        </h3>

                                        <div className="mt-auto space-y-3">
                                            {/* Rating & Discount Row */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    4.5 <span className="text-gray-400 font-normal">(120)</span>
                                                </div>
                                                <Badge type="discount">50% OFF</Badge>
                                            </div>

                                            {/* Link */}
                                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-blue-600 text-sm font-bold">
                                                <span>View Course</span>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                            {/* Skeleton Cards if empty */}
                            {(!profile.banners || profile.banners.length === 0) && [1, 2, 3, 4].map(n => (
                                <div key={n} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                                    <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* === PROFILE TAB === */}
                {activeTab === 'profile' && (
                    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>

                            <img
                                src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                                className="w-28 h-28 rounded-full border-4 border-white shadow-xl mx-auto mb-4 object-cover relative z-10"
                                alt="Profile"
                            />

                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                            <p className="text-gray-500 mb-6 font-medium">{profile.bio || 'Digital Creator & Educator'}</p>

                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setShowShare(true)} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                                    <Share2 size={16} /> Share
                                </button>
                                {isOwner && (
                                    <Link to="/dashboard" className="bg-gray-100 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                        Edit
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Quick Links List (Mobile First Style) */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg px-2">Quick Links</h3>
                            {(profile.importantLinks || []).map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <ExternalLink size={18} />
                                        </div>
                                        <span className="font-bold text-gray-700">{link.title}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* === PROMPTS TAB === */}
                {activeTab === 'prompts' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">Free AI Prompts</h2>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{profile?.favoritesPrompts?.length || 0} Saved</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(profile?.favoritesPrompts || []).map((prompt, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-gray-900 relative">
                                        <img src={prompt.logo} alt="Prompt" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <p className="text-white text-center font-medium line-clamp-3 text-sm italic">"{prompt.prompt}"</p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm mb-1">{prompt.name}</h3>
                                                <div className="flex gap-2">
                                                    {(prompt.tags || []).slice(0, 2).map(t => (
                                                        <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(prompt.prompt); alert('Copied!') }}
                                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* 4. Mobile Bottom Navigation (Fixed) */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around pb-4 md:hidden z-40 px-4">
                <BottomNavItem id="courses" icon={BookOpen} label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                <BottomNavItem id="profile" icon={Home} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                <BottomNavItem id="updates" icon={Bell} label="Updates" active={activeTab === 'updates'} onClick={() => setActiveTab('updates')} />
            </nav>

            {/* Share Modal Logic */}
            {showShare && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowShare(false)}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-6">Share Profile</h3>
                        <div className="bg-white p-4 rounded-xl shadow-lg border inline-block mb-6">
                            <QRCode value={window.location.href} size={180} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link Copied!') }} className="py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2">
                                <ExternalLink size={18} /> Copy
                            </button>
                            <button onClick={() => setShowShare(false)} className="py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
