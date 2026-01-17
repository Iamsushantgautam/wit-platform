import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ExternalLink, Globe } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTelegram, FaTwitter, FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin, FaGithub, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Profile = ({ usernameOverride }) => {
    const params = useParams();
    const username = usernameOverride || params.username;
    const { API_URL } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    if (error) return <div className="text-center mt-20 text-xl text-gray-600">{error}</div>;

    return (
        <div className="home-page pb-20">
            {/* Header Section */}
            <div className="card" style={{ borderRadius: 0, padding: 0, overflow: 'visible', border: 'none' }}>
                <div className="profile-header-gradient"></div>
                <div className="container relative text-center" style={{ marginTop: '-4rem' }}>
                    <div className="profile-avatar-container">
                        {profile.image ? (
                            <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-secondary">
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pb-8">
                        <h1 className="profile-name">{profile.name}</h1>
                        <p className="profile-handle">@{username}</p>
                        <p className="profile-bio">{profile.bio || "No bio available."}</p>
                    </div>
                </div>
            </div>

            <div className="container mt-8" style={{ maxWidth: '1280px' }}>
                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {/* Standard Socials */}
                    {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => {
                        if (!url) return null;

                        let icon = <Globe size={20} />;
                        let colorClass = 'bg-gray-600';

                        switch (platform) {
                            case 'instagram': icon = <FaInstagram size={24} />; colorClass = 'bg-gradient-to-tr from-yellow-500 via-purple-500 to-pink-500'; break;
                            case 'youtube': icon = <FaYoutube size={24} />; colorClass = 'bg-red-600'; break;
                            case 'telegram': icon = <FaTelegram size={24} />; colorClass = 'bg-blue-500'; break;
                            case 'x': icon = <FaXTwitter size={24} />; colorClass = 'bg-black'; break;
                            case 'facebook': icon = <FaFacebook size={24} />; colorClass = 'bg-blue-700'; break;
                            case 'whatsapp': icon = <FaWhatsapp size={24} />; colorClass = 'bg-green-500'; break;
                        }

                        return (
                            <a key={platform} href={url} target="_blank" rel="noreferrer"
                                className={`${colorClass} text-white w-12 h-12 flex items-center justify-center rounded-full hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                                {icon}
                            </a>
                        )
                    })}
                    {/* Custom Socials */}
                    {(profile.customSocials || []).map((social, i) => (
                        <a key={i} href={social.url} target="_blank" rel="noreferrer"
                            className="bg-slate-800 text-white px-5 h-12 flex items-center justify-center rounded-full hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg font-bold text-sm tracking-wide gap-2">
                            <Globe size={16} /> {social.label}
                        </a>
                    ))}
                </div>

                {/* Main 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">

                    {/* LEFT COLUMN: Offers */}
                    <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center lg:text-left flex items-center gap-2 justify-center lg:justify-start">
                            <span className="w-8 h-[2px] bg-slate-200"></span> Featured Offers
                        </h3>
                        {profile.banners && profile.banners.length > 0 && (
                            <div className="space-y-6">
                                {profile.banners.map((banner, i) => (
                                    <a key={i} href={banner.link} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 h-64 lg:h-80 w-full transform hover:-translate-y-1">
                                        {banner.imageUrl ? (
                                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl p-6 text-center leading-tight">{banner.title}</div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-bold text-lg leading-snug">{banner.title}</h3>
                                            <span className="text-xs text-white/80 mt-2 inline-block uppercase tracking-wider font-semibold group-hover:text-yellow-300 transition-colors">Check it out &rarr;</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                        {!profile.banners?.length && <div className="hidden lg:block p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-sm">No active offers</div>}
                    </div>

                    {/* CENTER COLUMN: Important Links */}
                    <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center flex items-center gap-2 justify-center">
                            <span className="w-8 h-[2px] bg-slate-200"></span> Important Links <span className="w-8 h-[2px] bg-slate-200"></span>
                        </h3>
                        {profile.importantLinks && profile.importantLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm hover:shadow-xl transition-all duration-300 group flex items-center justify-between transform hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-slate-500 transition-all duration-500 ${profile.image && index === 0 ? 'bg-transparent p-0' : 'bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-blue-600 shadow-inner'}`}>
                                        {profile.image && index === 0 ? <img src={profile.image} className="w-full h-full rounded-full object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition-transform" alt="" /> : <ExternalLink size={24} />}
                                    </div>
                                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{link.title}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-blue-600 relative z-10 bg-white dark:bg-slate-800 rounded-full p-2 shadow-sm">
                                    <ExternalLink size={20} />
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* RIGHT COLUMN: Image Prompts */}
                    <div className="lg:col-span-1 space-y-6 order-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center lg:text-left flex items-center gap-2 justify-center lg:justify-start">
                            <span className="w-8 h-[2px] bg-slate-200"></span> Top Prompts
                        </h3>
                        {profile.activeTools && profile.activeTools.filter(t => t.type === 'prompt').length > 0 ? (
                            <div className="space-y-4">
                                {profile.activeTools.filter(t => t.type === 'prompt').map((tool) => (
                                    <div key={tool._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                                        <div className="flex items-center gap-3 mb-3 border-b border-slate-50 dark:border-slate-800 pb-3">
                                            <img src={tool.logo} alt={tool.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                                            <h4 className="font-bold text-sm line-clamp-1 text-slate-800 dark:text-slate-200">{tool.name}</h4>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-4 relative group-hover:border-blue-200 transition-colors">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs text-slate-400 pointer-events-none">copy</div>
                                            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed tracking-tight">
                                                {tool.prompt}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigator.clipboard.writeText(tool.prompt);
                                                alert('Prompt copied!');
                                            }}
                                            className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 font-bold text-xs transition-all flex justify-center items-center gap-2"
                                        >
                                            <span className="uppercase tracking-wider">Copy Prompt</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="hidden lg:block p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-sm">No prompts added</div>
                        )}
                    </div>
                </div>

                {/* BOTTOM SECTION: AI Tools */}
                {profile.activeTools && profile.activeTools.filter(t => (t.type || 'tool') === 'tool').length > 0 && (
                    <div className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-10">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold mb-2">My Tech Stack</h2>
                            <p className="text-gray-500">Tools I use to build and create</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {profile.activeTools.filter(t => (t.type || 'tool') === 'tool').map((tool) => (
                                <a key={tool._id} href={tool.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 transition-colors group">
                                    <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-xl object-cover" />
                                    <div>
                                        <h3 className="font-bold group-hover:text-primary transition-colors">{tool.name}</h3>
                                        <span className="text-xs text-gray-400">{tool.category}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
