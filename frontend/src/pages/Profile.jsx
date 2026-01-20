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

    // --- Design Helpers ---
    const NavItem = ({ id, label, onClick, active }) => (
        <button
            onClick={onClick}
            className={`w-full text-left font-semibold px-4 py-2 rounded-xl transition-all ${active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            {label}
        </button>
    );

    const MobileNavItem = ({ id, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`font-semibold ${active ? 'text-blue-600' : 'text-gray-500'}`}
        >
            {label}
        </button>
    );

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

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans text-slate-800">

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-64 bg-white border-r flex-col justify-between p-6 fixed h-full z-20">
                <div>
                    <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {profile?.name || 'WitHub'}
                    </h2>
                    <nav className="space-y-4">
                        <NavItem id="profile" label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                        <NavItem id="courses" label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                        <NavItem id="prompts" label="Prompts" active={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')} />
                        {isOwner && (
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <Link to="/dashboard" className="w-full block text-left font-semibold px-4 py-2 text-gray-500 hover:text-blue-600 transition-colors">
                                    Dashboard
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
                <div className="text-sm text-gray-300">© 2026 WitHub</div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 md:ml-64">

                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                        {/* Profile Card */}
                        <div className="bg-gradient-to-r from-black to-blue-900 rounded-3xl p-8 text-white text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                            {/* Edit Button (Owner) */}
                            {isOwner && (
                                <Link to="/dashboard" className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors">
                                    <Edit size={16} />
                                </Link>
                            )}

                            <div className="relative inline-block mb-4">
                                <img
                                    src={profile?.image || `https://ui-avatars.com/api/?name=${user?.username || 'User'}`}
                                    className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl object-cover bg-white"
                                    alt="Profile"
                                />
                                {profile?.category && (
                                    <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-black">
                                        {profile.category}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-3xl font-bold mb-1">{profile?.name || user?.username}</h2>
                            <p className="text-blue-100 mb-6 font-medium opacity-90">{profile?.bio || 'Digital Creator'}</p>

                            <div className="flex gap-4 justify-center flex-wrap">
                                <button onClick={() => setShowShare(true)} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2">
                                    <Share2 size={18} /> Share
                                </button>
                                <button onClick={() => setActiveTab('prompts')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                                    <Grid size={18} /> Prompts
                                </button>
                            </div>
                        </div>

                        {/* Courses Preview (First 2) */}
                        {profile?.banners && profile.banners.length > 0 && (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-between items-end mb-4 px-2">
                                    <h3 className="font-bold text-xl text-gray-800">Featured Courses</h3>
                                    <button onClick={() => setActiveTab('courses')} className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {profile.banners.slice(0, 2).map((banner, idx) => (
                                        <a key={idx} href={banner.link} target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-3 group border border-gray-100">
                                            {banner.imageUrl && (
                                                <div className="overflow-hidden rounded-xl mb-3 relative aspect-video">
                                                    <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={banner.title} />
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded">
                                                        New
                                                    </div>
                                                </div>
                                            )}
                                            <h3 className="font-bold text-gray-900 leading-tight mb-1">{banner.title}</h3>
                                            <div className="text-xs text-gray-500 mb-3">Limited Time Offer</div>
                                            <button className="text-blue-600 font-bold text-sm">View Course &rarr;</button>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Important Links */}
                        <div className="max-w-4xl mx-auto space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="font-bold text-xl text-gray-800">Quick Links</h3>
                            </div>
                            {(profile?.importantLinks || []).map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-100 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <ExternalLink size={20} />
                                        </div>
                                        <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">{link.title}</span>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </a>
                            ))}
                            {/* Socials Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                {Object.entries(profile?.socialLinks || {}).map(([key, url]) => {
                                    if (!url) return null;
                                    return (
                                        <a key={key} href={url} target="_blank" rel="noreferrer" className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                                            <div className="text-gray-600">
                                                {getSocialIcon(key)}
                                            </div>
                                            <span className="text-xs font-bold capitalize text-gray-500">{key}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}


                {/* --- COURSES TAB --- */}
                {activeTab === 'courses' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">All Courses & Offers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {(profile?.banners || []).map((banner, idx) => (
                                <a key={idx} href={banner.link} target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all p-4 group border border-gray-100">
                                    {banner.imageUrl ? (
                                        <div className="overflow-hidden rounded-xl mb-4 relative aspect-video shadow-inner">
                                            <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={banner.title} />
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                                            <Layers size={40} />
                                        </div>
                                    )}
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">{banner.title}</h3>
                                    <div className="text-sm text-gray-500">Premium Content</div>
                                    <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">Access Now</button>
                                </a>
                            ))}
                        </div>
                        {(!profile?.banners || profile.banners.length === 0) && (
                            <div className="text-center py-20 bg-white rounded-3xl border-dashed border-2 border-gray-200">
                                <p className="text-gray-400">No courses available yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- PROMPTS TAB --- */}
                {activeTab === 'prompts' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Prompt Collection</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(profile?.activeTools || []).filter(t => t.type === 'prompt').map((prompt, idx) => (
                                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                                        <img src={prompt.logo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prompt.name} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                            <p className="text-white text-xs font-mono line-clamp-4 text-center">"{prompt.prompt}"</p>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">{prompt.platform}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 truncate">{prompt.name}</h3>
                                        <button onClick={() => { navigator.clipboard.writeText(prompt.prompt); alert('Copied!') }} className="w-full py-2 border border-gray-200 rounded-xl font-bold text-xs text-gray-600 hover:bg-gray-900 hover:text-white transition-colors">
                                            Copy Prompt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(!profile?.activeTools?.some(t => t.type === 'prompt')) && (
                            <div className="text-center py-20 bg-white rounded-3xl border-dashed border-2 border-gray-200">
                                <p className="text-gray-400">No prompts showcased.</p>
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* Bottom Mobile Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 md:hidden z-50 pb-safe">
                <MobileNavItem label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                <MobileNavItem label="Courses" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                <MobileNavItem label="Prompts" active={activeTab === 'prompts'} onClick={() => setActiveTab('prompts')} />
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
