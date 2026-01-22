import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Home, BookOpen, Bell, Menu, X, Star, ChevronRight, ArrowRight, MessageCircle,
    ExternalLink, Share2, Layout, Gift
} from 'lucide-react';
import {
    FaInstagram, FaYoutube, FaTelegram, FaTwitter,
    FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin,
    FaGithub, FaTiktok
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'offers', 'links', 'updates'].includes(tab)) {
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

    // Sample updates data (replace with real data from backend)
    const updates = profile?.updates || [];

    return (
        <div className="profile-page">
            {/* Mobile Header */}
            <header className="profile-mobile-header">
                <button
                    className="profile-mobile-header__menu-btn"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
                <div className="profile-mobile-header__title">
                    {activeTab === 'offers' ? 'Offers' :
                        activeTab === 'profile' ? 'Profile' :
                            activeTab === 'links' ? 'Links' : 'Updates'}
                </div>
                <img
                    src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                    alt="Profile"
                    className="profile-mobile-header__avatar"
                />
            </header>

            {/* Menu Drawer Overlay */}
            <div
                className={`profile-drawer-overlay ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <aside className={`profile-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div className="profile-drawer__header">
                    <h2 className="profile-drawer__title">Menu</h2>
                    <button
                        className="profile-drawer__close"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="profile-drawer__nav">
                    <button
                        className={`profile-drawer__item ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('profile');
                            setIsMenuOpen(false);
                        }}
                    >
                        <Home size={24} />
                        <span>Profile</span>
                    </button>
                    {(profile?.activeTools?.length > 0) && (
                        <button
                            className={`profile-drawer__item ${activeTab === 'tools' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('tools');
                                setIsMenuOpen(false);
                            }}
                        >
                            <Layout size={24} />
                            <span>Tools</span>
                        </button>
                    )}
                    {(profile?.favoritesPrompts?.length > 0) && (
                        <button
                            className={`profile-drawer__item ${activeTab === 'prompts' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('prompts');
                                setIsMenuOpen(false);
                            }}
                        >
                            <MessageCircle size={24} />
                            <span>Prompts</span>
                        </button>
                    )}
                    <button
                        className={`profile-drawer__item ${activeTab === 'offers' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('offers');
                            setIsMenuOpen(false);
                        }}
                    >
                        <Gift size={24} />
                        <span>Offers</span>
                    </button>
                    <button
                        className={`profile-drawer__item ${activeTab === 'links' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('links');
                            setIsMenuOpen(false);
                        }}
                    >
                        <ExternalLink size={24} />
                        <span>Links</span>
                    </button>
                    <button
                        className={`profile-drawer__item ${activeTab === 'updates' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('updates');
                            setIsMenuOpen(false);
                        }}
                    >
                        <Bell size={24} />
                        <span>Updates</span>
                        {updates.length > 0 && (
                            <span className="profile-drawer__badge">{updates.length}</span>
                        )}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="profile-content">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="profile-tab">
                        {/* Hero Card */}
                        <div className="profile-hero-card">
                            <div className="profile-hero-card__avatar-wrapper">
                                <img
                                    src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                                    alt={profile.name}
                                    className="profile-hero-card__avatar"
                                />
                                <div className="profile-hero-card__badge">AI</div>
                            </div>
                            <h1 className="profile-hero-card__name">{profile.name || username}</h1>
                            <p className="profile-hero-card_bio profile-hero-card_username"><span>@  {username} </span></p>
                            <p className="profile-hero-card__bio">{profile.bio || 'AI Course Creator | Educator'}</p>
                            <div className="profile-hero-card__actions">
                                <button className="profile-hero-card__btn profile-hero-card__btn--secondary">
                                    <MessageCircle size={18} />
                                    Get Help
                                </button>
                                <Link
                                    to={`/prompts`}
                                    className="profile-hero-card__btn profile-hero-card__btn--primary"
                                >
                                    <Star size={18} />
                                    Free Prompts
                                </Link>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        {profile?.socialLinks && Object.keys(profile.socialLinks).some(key => profile.socialLinks[key]) && (
                            <div className="profile-social-section">
                                <h3 className="profile-social-title">Connect With Me</h3>
                                <div className="profile-social-grid">
                                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={platform}
                                                href={url.startsWith('http') ? url : `https://${url}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="profile-social-item"
                                            >
                                                <div className={`profile-link-item__icon profile-link-item__icon--${platform}`}>
                                                    {getSocialIcon(platform)}
                                                </div>
                                                <span className="profile-social-label">{platform}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recent Tools Preview */}
                        {profile?.activeTools?.length > 0 && (
                            <div className="profile-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                                    <h3 className="profile-section-title">My Logic</h3>
                                    <button onClick={() => setActiveTab('tools')} className="text-blue-600 text-sm font-semibold">View All</button>
                                </div>
                                <div className="profile-course-grid" style={{ marginBottom: '24px' }}>
                                    {profile.activeTools.slice(0, 2).map((tool) => (
                                        <a key={tool._id} href={tool.url} target="_blank" rel="noreferrer" className="profile-course-card">
                                            <div className="profile-course-card__image-wrapper" style={{ aspectRatio: '1', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                                                <img src={tool.logo} alt={tool.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                            </div>
                                            <div className="profile-course-card__body">
                                                <h3 className="profile-course-card__title">{tool.name}</h3>
                                                <p style={{ fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tool.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Important Links */}
                        {profile?.importantLinks && profile.importantLinks.length > 0 && (
                            <div className="profile-links-section">
                                {profile.importantLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="profile-link-item"
                                    >
                                        <div className="profile-link-item__content">
                                            <div className="profile-link-item__icon">
                                                <ExternalLink size={20} />
                                            </div>
                                            <div className="profile-link-item__text">
                                                <div className="profile-link-item__title">{link.title}</div>
                                                <div className="profile-link-item__url">{link.url}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="profile-link-item__arrow" size={20} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && (
                    <div className="profile-courses">
                        <h2 className="profile-section-title" style={{ paddingLeft: '4px' }}>My Tools</h2>
                        {profile?.activeTools?.length > 0 ? (
                            <div className="profile-course-grid">
                                {profile.activeTools.map((tool) => (
                                    <a
                                        key={tool._id}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="profile-course-card"
                                    >
                                        <div className="profile-course-card__image-wrapper" style={{ aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
                                            <img
                                                src={tool.logo}
                                                alt={tool.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                                            />
                                        </div>
                                        <div className="profile-course-card__body">
                                            <h3 className="profile-course-card__title">{tool.name}</h3>
                                            <p style={{
                                                fontSize: '13px',
                                                color: '#6b7280',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {tool.description}
                                            </p>
                                            <div className="profile-course-card__link">
                                                Visit Tool <ExternalLink size={14} />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="profile-empty-state">
                                <Layout size={48} className="profile-empty-icon" />
                                <p className="profile-empty-text">No tools added yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* PROMPTS TAB */}
                {activeTab === 'prompts' && (
                    <div className="profile-courses">
                        <h2 className="profile-section-title" style={{ paddingLeft: '4px' }}>Favorite Prompts</h2>
                        {profile?.favoritesPrompts?.length > 0 ? (
                            <div className="profile-course-grid">
                                {profile.favoritesPrompts.map((prompt) => (
                                    <div key={prompt._id} className="profile-course-card" style={{ cursor: 'default' }}>
                                        <div className="profile-course-card__body">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '24px' }}>✨</span>
                                                <h3 className="profile-course-card__title" style={{ margin: 0 }}>{prompt.name}</h3>
                                            </div>
                                            <div style={{
                                                background: '#f3f4f6',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: '1px dashed #d1d5db',
                                                fontSize: '13px',
                                                color: '#374151',
                                                fontFamily: 'monospace',
                                                marginBottom: '12px',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {prompt.prompt}
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                                                {prompt.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="profile-empty-state">
                                <MessageCircle size={48} className="profile-empty-icon" />
                                <p className="profile-empty-text">No prompts saved yet</p>
                            </div>
                        )}
                    </div>
                )}

                {/* OFFERS TAB */}
                {activeTab === 'offers' && (
                    <div className="profile-courses">
                        {/* Hero Banner */}
                        <div className="profile-hero-banner">
                            <div className="profile-hero-banner__content">
                                <span className="profile-hero-banner__badge">Limited Time Offer</span>
                                <h1 className="profile-hero-banner__title">
                                    5-in-1 AI<br />
                                    Viral Offer Pack
                                </h1>
                                <p className="profile-hero-banner__subtitle">
                                    Get 20% Off This Weekend Only!
                                </p>
                                <button className="profile-hero-banner__cta">
                                    GRAB OFFER <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <div className="profile-filters">
                            <button className="profile-filter-pill active">Premium Offers</button>
                            <button className="profile-filter-pill">Free Offers</button>
                            <button className="profile-filter-pill">Best Sellers</button>
                            <button className="profile-filter-pill">New Arrivals</button>
                        </div>

                        {/* Offer Grid */}
                        <div className="profile-course-grid">
                            {(profile?.banners || []).map((banner, idx) => (
                                <a
                                    key={idx}
                                    href={banner.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="profile-course-card"
                                >
                                    <div className="profile-course-card__image-wrapper">
                                        <img
                                            src={banner.imageUrl || `https://source.unsplash.com/random/400x300?${idx}`}
                                            alt={banner.title}
                                            className="profile-course-card__image"
                                        />
                                        <span className={`profile-course-card__badge ${idx % 3 === 0 ? 'profile-course-card__badge--trending' : ''}`}>
                                            {idx % 3 === 0 ? 'Trending' : 'New'}
                                        </span>
                                    </div>
                                    <div className="profile-course-card__body">
                                        <h3 className="profile-course-card__title">{banner.title}</h3>
                                        <div className="profile-course-card__footer">
                                            <div className="profile-course-card__rating">
                                                <Star size={14} />
                                                {(4.0 + Math.random()).toFixed(1)}
                                            </div>
                                            <span className="profile-course-card__discount">
                                                {idx % 2 === 0 ? '50% OFF' : '30% OFF'}
                                            </span>
                                        </div>
                                        <div className="profile-course-card__link">
                                            View Offer <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* LINKS TAB */}
                {activeTab === 'links' && (
                    <div className="profile-links">
                        <h2 className="profile-section-title">Important Links</h2>

                        {/* Important Links */}
                        {profile?.importantLinks && profile.importantLinks.length > 0 && (
                            <div className="profile-links-section">
                                {profile.importantLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="profile-link-item"
                                    >
                                        <div className="profile-link-item__content">
                                            <div className="profile-link-item__icon">
                                                <ExternalLink size={20} />
                                            </div>
                                            <div className="profile-link-item__text">
                                                <div className="profile-link-item__title">{link.title}</div>
                                                <div className="profile-link-item__url">{link.url}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="profile-link-item__arrow" size={20} />
                                    </a>
                                ))}
                            </div>
                        )}

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
                {activeTab === 'updates' && (
                    <div className="profile-updates">
                        {updates.map((update) => (
                            <div key={update._id} className="profile-update-item">
                                {update.thumbnail && (
                                    <img
                                        src={update.thumbnail}
                                        alt=""
                                        className="profile-update-item__thumbnail"
                                    />
                                )}
                                <div className="profile-update-item__content">
                                    <div className="profile-update-item__title">
                                        <span className="profile-update-item__emoji">{update.emoji}</span>
                                        {update.title}
                                    </div>
                                    <p className="profile-update-item__text">{update.text}</p>

                                    {/* Link in Updates */}
                                    {update.link && (
                                        <a
                                            href={update.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm mb-2 hover:underline"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 600, fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}
                                        >
                                            <ExternalLink size={14} />
                                            View Link
                                        </a>
                                    )}

                                    <div className="profile-update-item__time">{formatDate(update.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="profile-bottom-nav">
                <button
                    className={`profile-bottom-nav__item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <Home size={24} />
                    <span className="profile-bottom-nav__label">Profile</span>
                </button>
                {(profile?.activeTools?.length > 0) && (
                    <button
                        className={`profile-bottom-nav__item ${activeTab === 'tools' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tools')}
                    >
                        <Layout size={24} />
                        <span className="profile-bottom-nav__label">Tools</span>
                    </button>
                )}
                {/* 
                {(profile?.favoritesPrompts?.length > 0) && (
                    <button
                        className={`profile-bottom-nav__item ${activeTab === 'prompts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prompts')}
                    >
                        <MessageCircle size={24} />
                        <span className="profile-bottom-nav__label">Prompts</span>
                    </button>
                )} 
                */}
                <button
                    className={`profile-bottom-nav__item ${activeTab === 'links' ? 'active' : ''}`}
                    onClick={() => setActiveTab('links')}
                >
                    <ExternalLink size={24} />
                    <span className="profile-bottom-nav__label">Links</span>
                </button>
                <button
                    className={`profile-bottom-nav__item ${activeTab === 'updates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('updates')}
                >
                    <Bell size={24} />
                    <span className="profile-bottom-nav__label">Updates</span>
                    {updates.length > 0 && (
                        <span className="profile-bottom-nav__badge">{updates.length}</span>
                    )}
                </button>
            </nav>
        </div>
    );
};

export default Profile;