import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ExternalLink, Globe, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
    const { username } = useParams();
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

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {profile.importantLinks && profile.importantLinks.map((link, i) => (
                                <a key={i} href={link.url} target="_blank" rel="noreferrer" className="link-pill">
                                    <Globe size={16} /> {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-8" style={{ maxWidth: '1024px' }}>
                {/* Banners / Offers */}
                {profile.banners && profile.banners.length > 0 && (
                    <div className="mb-12">
                        <h2 className="section-title-sm mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded-full" style={{ width: '4px', height: '24px', backgroundColor: 'var(--primary-color)', borderRadius: '99px' }}></span> Featured Offers
                        </h2>
                        <div className="dashboard-grid">
                            {profile.banners.map((banner, i) => (
                                <a key={i} href={banner.link} target="_blank" rel="noreferrer" className="banner-card group">
                                    {banner.imageUrl ? (
                                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover-scale" />
                                    ) : (
                                        <div className="w-full h-full gradient-bg flex items-center justify-center text-accent font-bold text-xl">{banner.title}</div>
                                    )}
                                    <div className="banner-overlay">
                                        <h3 className="banner-title">{banner.title}</h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tools */}
                {profile.activeTools && profile.activeTools.length > 0 && (
                    <div>
                        <h2 className="section-title-sm mb-6 flex items-center gap-2">
                            <span style={{ width: '4px', height: '24px', backgroundColor: '#a855f7', borderRadius: '99px' }}></span> My Toolkit
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            {profile.activeTools.map((tool) => (
                                <a key={tool._id} href={tool.url} target="_blank" rel="noreferrer" className="tool-card group">
                                    <div className="tool-header">
                                        <img src={tool.logo} alt={tool.name} className="tool-logo" />
                                        <h3 className="tool-name">{tool.name}</h3>
                                    </div>
                                    <p className="tool-desc">{tool.description}</p>
                                    <div className="tool-footer">
                                        Visit Website <ExternalLink size={16} className="transform group-hover-translate-x" />
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
