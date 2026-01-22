import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    User, Image, Link as LinkIcon, Layout, Settings,
    ExternalLink, Plus, Trash2, CheckCircle, AlertCircle,
    ChevronRight, Save, ShieldAlert, Share2, QrCode, Megaphone,
    Eye, EyeOff, Search, Instagram, Twitter, Facebook, Linkedin, Github, Youtube, MessageCircle, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/DashboardAppearance.css';
import '../styles/DashboardLinks.css';
import '../styles/DashboardOffers.css';
import '../styles/DashboardPrompts.css';
import QRCode from 'react-qr-code';

const Dashboard = () => {
    const { user, logout, API_URL } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [profileData, setProfileData] = useState({
        name: '',
        bio: '',
        image: '',
        category: 'Developer',
        importantLinks: [],
        banners: [],
        activeTools: [],
        socialLinks: { instagram: '', youtube: '', telegram: '', x: '', facebook: '', whatsapp: '' },
        customItems: []
    });

    const [availableTools, setAvailableTools] = useState([]);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [toolSearch, setToolSearch] = useState('');

    // Filtered Tools for Stack
    const filteredAvailableTools = availableTools.filter(t =>
        (t.type !== 'prompt') &&
        (t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(toolSearch.toLowerCase()))
    );

    const filteredAvailablePrompts = availableTools.filter(t =>
        (t.type === 'prompt') &&
        (t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
            t.category.toLowerCase().includes(toolSearch.toLowerCase()))
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, toolsRes] = await Promise.all([
                    axios.get(`${API_URL}/profiles/me`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`${API_URL}/tools`)
                ]);
                setProfileData(profileRes.data);
                setAvailableTools(toolsRes.data);
                setUsername(user.username);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, API_URL]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...profileData.importantLinks];
        newLinks[index][field] = value;
        setProfileData({ ...profileData, importantLinks: newLinks });
    };

    const addLink = () => {
        setProfileData({
            ...profileData,
            importantLinks: [...profileData.importantLinks, { title: '', url: '' }]
        });
        setSuccessMsg('Link added successfully');
        setTimeout(() => setSuccessMsg(''), 2000);
    };

    const removeLink = (index) => {
        const newLinks = profileData.importantLinks.filter((_, i) => i !== index);
        setProfileData({ ...profileData, importantLinks: newLinks });
    };

    // Banner Handlers
    const handleBannerChange = (index, field, value) => {
        const newBanners = [...profileData.banners];
        newBanners[index][field] = value;
        setProfileData({ ...profileData, banners: newBanners });
    };

    const addBanner = () => {
        setProfileData({
            ...profileData,
            banners: [...(profileData.banners || []), { title: '', imageUrl: '', link: '', isVisible: true }]
        });
        setSuccessMsg('Banner added successfully');
        setTimeout(() => setSuccessMsg(''), 2000);
    };

    const removeBanner = (index) => {
        const newBanners = profileData.banners.filter((_, i) => i !== index);
        setProfileData({ ...profileData, banners: newBanners });
    };

    // Custom Social Handlers
    const addCustomSocial = () => {
        setProfileData({
            ...profileData,
            customSocials: [...(profileData.customSocials || []), { label: '', url: '', icon: '' }]
        });
    };

    const handleCustomSocialChange = (index, field, value) => {
        const newSocials = [...(profileData.customSocials || [])];
        newSocials[index][field] = value;
        setProfileData({ ...profileData, customSocials: newSocials });
    };

    const removeCustomSocial = (index) => {
        const newSocials = profileData.customSocials.filter((_, i) => i !== index);
        setProfileData({ ...profileData, customSocials: newSocials });
    };

    const toggleTool = (toolId) => {
        const currentTools = [...profileData.activeTools];
        const index = currentTools.indexOf(toolId);
        if (index > -1) {
            currentTools.splice(index, 1);
        } else {
            currentTools.push(toolId);
        }
        setProfileData({ ...profileData, activeTools: currentTools });
    };

    const toggleFavorite = async (e, toolId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            const { data } = await axios.post(`${API_URL}/profiles/favorites/prompt`, { toolId }, config);
            setProfileData(data);
        } catch (error) {
            console.error('Error toggling favorite', error);
        }
    };

    const [uploading, setUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=avatar`, formData, config);

            // Update state and auto-save
            const updatedProfile = { ...profileData, image: imageUrl };
            setProfileData(updatedProfile);

            await axios.post(`${API_URL}/profiles`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setMessage({ type: 'success', text: 'Profile image updated!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Image upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleBannerImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setBannerUploading(index);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=uploads`, formData, config);

            const newBanners = [...(profileData.banners || [])];
            newBanners[index].imageUrl = imageUrl;

            const updatedProfile = { ...profileData, banners: newBanners };
            setProfileData(updatedProfile);

            await axios.post(`${API_URL}/profiles`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setMessage({ type: 'success', text: 'Banner uploaded and saved!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Banner upload failed' });
        } finally {
            setBannerUploading(null);
        }
    };

    const saveProfile = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await axios.post(`${API_URL}/profiles`, profileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const updateAccount = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await axios.put(`${API_URL}/user-manage/profile`,
                { username, password: password || undefined },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (res.data.username !== user.username) {
                alert("Username updated! Please login again.");
                logout();
                return;
            }

            setMessage({ type: 'success', text: 'Account settings updated!' });
            setPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <div className="p-10 text-center">Please login</div>;
    if (loading) return <div className="p-10 text-center py-20"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status"></div><p className="mt-4 text-gray-500">Loading your workspace...</p></div>;

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`sidebar-tab ${activeTab === id ? 'active' : ''}`}
        >
            <Icon size={20} />
            <span>{label}</span>
            {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
        </button>
    );

    const publicProfileUrl = window.location.hostname.includes('localhost')
        ? `http://${user.username}.localhost:5173`
        : `http://${user.username}.${window.location.host}`;

    const favouritesUrl = `${publicProfileUrl}?tab=prompts`;

    return (
        <div className="container dashboard-container min-h-screen">
            <header className="dashboard-header flex justify-between items-end mb-10 pt-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Workspace</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">Design your digital identity</p>
                </div>
                <div className="flex gap-3 items-center">
                    <a
                        href={publicProfileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary flex items-center gap-2 px-6 py-3"
                    >
                        <ExternalLink size={18} /> <span>Live Preview</span>
                    </a>
                    <a
                        href={favouritesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline flex items-center gap-2 px-4 py-3"
                    >
                        <Megaphone size={18} /> <span>Favourite Prompts</span>
                    </a>
                </div>
            </header>

            {message && (
                <div className={`p-4 mb-8 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100 shadow-sm' : 'bg-red-50 text-red-700 border border-red-100 shadow-sm'}`}>
                    {message.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100">&times;</button>
                </div>
            )}

            <div className="dashboard-layout">
                {/* Sidebar Navigation */}
                <aside className="sidebar-nav">
                    <TabButton id="profile" label="Profile Details" icon={User} />
                    <TabButton id="appearance" label="Appearance" icon={Image} />
                    <TabButton id="links" label="Connections & Links" icon={LinkIcon} />
                    <TabButton id="offers" label="Offers & Banners" icon={Megaphone} />
                    {/* Socials merged into Links */}
                    <TabButton id="tools" label="AI Tools" icon={Layout} />
                    <TabButton id="prompts" label="My Prompts" icon={Megaphone} />
                    <TabButton id="share" label="Share Profile" icon={QrCode} />

                    {user.role === 'master_admin' && (
                        <Link to="/admin" className="sidebar-tab text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                            <ShieldAlert size={20} />
                            <span>Master Admin</span>
                        </Link>
                    )}

                    <div className="my-6 mx-4 border-t border-gray-100 dark:border-gray-800"></div>
                    <TabButton id="account" label="Account Settings" icon={Settings} />
                </aside>

                {/* Main Content Area */}
                <main className="content-card">

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <form onSubmit={saveProfile}>
                            <h2 className="dashboard-section-title">
                                <User className="text-accent" />
                                <span className="text-gray-900 dark:text-white">Profile Details</span>
                            </h2>

                            <div className="space-y-8">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="label-premium">Display Name</label>
                                        <input
                                            type="text" name="name"
                                            value={profileData.name} onChange={handleProfileChange}
                                            className="input-premium" placeholder="e.g. John Doe"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label-premium">Category</label>
                                        <select
                                            name="category"
                                            value={profileData.category} onChange={handleProfileChange}
                                            className="input-premium"
                                        >
                                            <option value="Developer">Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="Creator">Content Creator</option>
                                            <option value="Entrepreneur">Entrepreneur</option>
                                            <option value="Student">Student</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="label-premium">Bio</label>
                                    <textarea
                                        name="bio" rows="4"
                                        value={profileData.bio} onChange={handleProfileChange}
                                        className="input-premium" placeholder="Tell the world about yourself..."
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}

                    {/* APPEARANCE TAB */}
                    {activeTab === 'appearance' && (
                        <form onSubmit={saveProfile} className="appearance-section">
                            <h2 className="dashboard-section-title">
                                <Image className="text-accent" />
                                <span className="text-gray-900 dark:text-white">Appearance</span>
                            </h2>

                            <div className="space-y-8">
                                <div className="form-group">
                                    <label className="label-premium mb-4 block">Profile Image</label>

                                    <div className="image-upload-container">
                                        {/* Image Preview & Upload Trigger */}
                                        <div className="profile-image-uploader">
                                            <div className="profile-image-preview">
                                                {profileData.image ? (
                                                    <img src={profileData.image} alt="Profile" />
                                                ) : (
                                                    <div className="profile-image-placeholder">
                                                        <User size={48} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hover Overlay for Upload */}
                                            <label htmlFor="image-upload" className="profile-image-overlay">
                                                <div className="profile-image-overlay-content">
                                                    <div className="profile-image-overlay-icon">
                                                        <Image size={20} />
                                                    </div>
                                                    Change Photo
                                                </div>
                                            </label>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </div>

                                        <div className="image-upload-details">
                                            <div className="image-url-input-group">
                                                <label className="image-url-label">Image URL</label>
                                                <input
                                                    type="text"
                                                    name="image"
                                                    value={profileData.image}
                                                    onChange={handleProfileChange}
                                                    className="image-url-input"
                                                    placeholder="https://example.com/your-image.jpg"
                                                />
                                            </div>

                                            <div className="image-upload-help">
                                                <div className="image-upload-help-title">
                                                    <AlertCircle size={16} />
                                                    Upload Instructions
                                                </div>
                                                <p className="image-upload-help-text">
                                                    Click the circular avatar to upload a new photo from your device,
                                                    or paste a direct image URL above.
                                                </p>
                                                <p className="image-upload-help-highlight">
                                                    Recommended: Square image (1:1 ratio), JPG or PNG, max 2MB
                                                </p>
                                            </div>

                                            {uploading && (
                                                <div className="uploading-indicator">
                                                    <div className="uploading-spinner" />
                                                    Uploading your image...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {profileData.image && (
                                    <div className="avatar-preview-card">
                                        <div className="avatar-preview-image">
                                            <img src={profileData.image} alt="Preview" />
                                        </div>
                                        <div className="avatar-preview-info">
                                            <p className="avatar-preview-title">
                                                Avatar Preview
                                                <span className="avatar-preview-badge">
                                                    <CheckCircle size={12} />
                                                </span>
                                            </p>
                                            <p className="avatar-preview-subtitle">
                                                This is how you'll appear to others on your profile
                                            </p>
                                        </div>
                                    </div>

                                )}
                            </div>

                            <button type="submit" disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Appearance'}
                            </button>
                        </form>
                    )}

                    {/* LINKS TAB */}
                    {activeTab === 'links' && (
                        <div className="links-section">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="dashboard-section-title mb-0">
                                    <LinkIcon className="text-accent" />
                                    <span>Connections & Links</span>
                                </h2>
                            </div>

                            {/* 1. IMPORTANT LINKS SECTION */}
                            <div className="mb-10">
                                <div className="section-header">
                                    <h3>Important Links</h3>
                                    <span className="section-badge">{profileData.importantLinks.length} Added</span>
                                </div>

                                <div className="links-container">
                                    {profileData.importantLinks.map((link, index) => (
                                        <div key={index} className="link-card animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                            <div className="link-card-drag">
                                                <Layout size={16} />
                                            </div>
                                            <div className="link-card-inputs">
                                                <input
                                                    type="text"
                                                    placeholder="Title (e.g. My Portfolio)"
                                                    className="input-premium"
                                                    value={link.title}
                                                    onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="URL (https://...)"
                                                        className="input-premium pl-9"
                                                        value={link.url}
                                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                    />
                                                    <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                </div>
                                            </div>
                                            <button onClick={() => removeLink(index)} className="link-card-remove" title="Remove Link">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="add-link-area mt-4">
                                    <button type="button" onClick={addLink} className="btn-add-connection">
                                        <Plus size={18} /> Add New Link
                                    </button>
                                </div>
                            </div>

                            <div className="section-divider" />

                            {/* 2. SOCIAL PROFILES SECTION */}
                            <div className="mb-8">
                                <div className="section-header">
                                    <h3>Social Profiles</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Add your social media profiles to help people connect with you.</p>

                                <div className="socials-grid">
                                    {[
                                        { id: 'instagram', icon: Instagram, color: 'instagram' },
                                        { id: 'whatsapp', icon: MessageCircle, color: 'whatsapp' },
                                        { id: 'twitter', icon: Twitter, color: 'twitter' },
                                        { id: 'linkedin', icon: Linkedin, color: 'linkedin' },
                                        { id: 'github', icon: Github, color: 'github' },
                                        { id: 'youtube', icon: Youtube, color: 'youtube' },
                                        { id: 'facebook', icon: Facebook, color: 'facebook' },
                                        { id: 'discord', icon: MessageCircle, color: 'discord' },
                                    ].map((platform) => {
                                        const Icon = platform.icon;
                                        return (
                                            <div key={platform.id} className="social-card">
                                                <div className={`social-icon-box ${platform.color}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="social-input-wrapper">
                                                    <label className="social-label">{platform.id}</label>
                                                    <input
                                                        type="text"
                                                        className="social-input"
                                                        placeholder={`@username or Link`}
                                                        value={profileData.socialLinks?.[platform.id] || ''}
                                                        onChange={(e) => setProfileData({
                                                            ...profileData,
                                                            socialLinks: { ...profileData.socialLinks, [platform.id]: e.target.value }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Success Toast */}
                            {successMsg && (
                                <div className="connection-success-msg">
                                    <CheckCircle size={20} />
                                    {successMsg}
                                </div>
                            )}

                            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                                <Save size={20} />
                                {saving ? 'Saving Changes...' : 'Save Connections'}
                            </button>
                        </div>
                    )
                    }

                    {/* OFFERS TAB */}
                    {
                        activeTab === 'offers' && (
                            <div className="offers-section">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="dashboard-section-title mb-0">
                                        <Megaphone className="text-accent" />
                                        <span>Offers & Banners</span>
                                    </h2>
                                    <button type="button" onClick={addBanner} className="btn btn-outline flex items-center gap-2 py-2 px-4 rounded-xl">
                                        <Plus size={18} /> Add Banner
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {(profileData.banners || []).map((banner, index) => (
                                        <div key={index} className={`banner-card ${!banner.isVisible ? 'opacity-75 grayscale' : ''}`}>
                                            {/* Header with Toggle */}
                                            <div className="banner-header">
                                                <div className="banner-title-group">
                                                    <span className="banner-number">#{index + 1}</span>
                                                    <div className="toggle-switch-group">
                                                        <label className="toggle-label whitespace-nowrap">
                                                            {banner.isVisible !== false ? 'Visible' : 'Hidden'}
                                                        </label>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="toggle-checkbox"
                                                                checked={banner.isVisible !== false}
                                                                onChange={(e) => handleBannerChange(index, 'isVisible', e.target.checked)}
                                                            />
                                                            <div className="toggle-slider"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="banner-actions">
                                                    <button onClick={() => removeBanner(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Remove Banner">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Main Content */}
                                            <div className="space-y-6">
                                                <div className="form-group">
                                                    <label className="label-premium mb-2 block">Banner Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. 50% Off Consulting Services"
                                                        className="input-premium font-bold text-lg"
                                                        value={banner.title}
                                                        onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                                                    />
                                                </div>

                                                {/* Image Upload Area */}
                                                <div>
                                                    <label className="label-premium mb-2 block">Banner Image</label>
                                                    <div className="relative">
                                                        <label className={`banner-preview-area ${banner.imageUrl ? 'has-image' : ''}`}>
                                                            {banner.imageUrl ? (
                                                                <>
                                                                    <img src={banner.imageUrl} alt="Banner" className="banner-image-display" />
                                                                    <div className="banner-overlay">
                                                                        <div className="bg-white/20 p-3 rounded-full mb-2 backdrop-blur-md">
                                                                            <Image size={24} className="text-white" />
                                                                        </div>
                                                                        <span className="text-white font-bold text-sm">Change Image</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="upload-placeholder">
                                                                    <div className="upload-icon-circle">
                                                                        {bannerUploading === index ? (
                                                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                                                                        ) : (
                                                                            <Image size={24} />
                                                                        )}
                                                                    </div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">Click to upload banner</p>
                                                                    <p className="text-xs">Recommended: 1200x600px (2:1)</p>
                                                                </div>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleBannerImageUpload(e, index)}
                                                                disabled={bannerUploading === index}
                                                            />
                                                        </label>

                                                        {/* Error/Loading Overlay for Upload */}
                                                        {bannerUploading === index && (
                                                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-2"></div>
                                                                    <span className="font-bold text-primary">Uploading...</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* URL Input Toggle using Details/Summary */}
                                                    <details className="mt-2" open={!banner.imageUrl}>
                                                        <summary className="banner-url-toggler text-xs list-none flex items-center gap-1">
                                                            <LinkIcon size={12} />
                                                            {banner.imageUrl ? 'Edit Image URL' : 'Or paste image URL'}
                                                        </summary>
                                                        <div className="mt-2 animate-in slide-in-from-top-2">
                                                            <input
                                                                type="text"
                                                                placeholder="https://imgur.com/..."
                                                                className="input-premium text-sm"
                                                                value={banner.imageUrl}
                                                                onChange={(e) => handleBannerChange(index, 'imageUrl', e.target.value)}
                                                            />
                                                        </div>
                                                    </details>
                                                </div>

                                                <div className="form-group">
                                                    <label className="label-premium mb-2 block">Destination Link</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Where should this banner link to?"
                                                            className="input-premium pl-10"
                                                            value={banner.link}
                                                            onChange={(e) => handleBannerChange(index, 'link', e.target.value)}
                                                        />
                                                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(profileData.banners || []).length === 0 && (
                                        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <Megaphone size={40} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-lg text-gray-400 font-medium">No offers added.</p>
                                            <button onClick={addBanner} className="text-accent font-bold mt-2 hover:underline">Create your first banner</button>
                                        </div>
                                    )}
                                </div>

                                <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Offers'}
                                </button>
                            </div>
                        )
                    }  {/* TOOLS TAB */}
                    {activeTab === 'tools' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="dashboard-section-title mb-1">
                                        <Layout className="text-accent" />
                                        <span>AI Stack</span>
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">Select the tools you use to feature them on your profile.</p>
                                </div>
                                <div className="search-wrapper-premium w-full md:w-64">
                                    <Search className="search-icon-premium" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search tools..."
                                        className="search-input-premium !py-2 !text-sm"
                                        value={toolSearch}
                                        onChange={(e) => setToolSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="tool-grid-premium">
                                {filteredAvailableTools.map(tool => (
                                    <div
                                        key={tool._id}
                                        onClick={() => toggleTool(tool._id)}
                                        className={`tool-select-card ${profileData.activeTools.includes(tool._id) ? 'selected' : ''}`}
                                    >
                                        <div className="tool-icon-placeholder">
                                            {tool.logo ? <img src={tool.logo} alt="" className="w-full h-full object-cover rounded-lg" /> : <Layout size={24} />}
                                        </div>
                                        <h4 className="font-bold text-sm mb-1">{tool.name}</h4>
                                        <span className="text-xs opacity-60 uppercase font-bold tracking-wider">{tool.category}</span>

                                        {profileData.activeTools.includes(tool._id) && (
                                            <div className="absolute top-2 right-2 text-blue-600 bg-white rounded-full">
                                                <CheckCircle size={18} fill="currentColor" className="text-primary" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Update Stack'}
                            </button>
                        </div>
                    )
                    }

                    {/* PROMPTS TAB */}
                    {
                        activeTab === 'prompts' && (
                            <div className="prompts-section">
                                {/* Header with Stats */}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="dashboard-section-title mb-1">
                                            <Megaphone className="text-accent" />
                                            <span>My Prompts Library</span>
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Select prompts to display. <span className="font-bold text-accent">{profileData.activeTools.filter(id => availableTools.find(t => t._id === id)?.type === 'prompt').length}</span> selected.
                                        </p>
                                    </div>
                                    <div className="search-wrapper-premium w-full md:w-64">
                                        <Search className="search-icon-premium" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search prompts..."
                                            className="search-input-premium !py-2 !text-sm"
                                            value={toolSearch}
                                            onChange={(e) => setToolSearch(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="prompt-grid">
                                    {filteredAvailablePrompts.map(tool => {
                                        // Safe check for favorites
                                        const isFav = profileData.favoritesPrompts?.some(f => (f._id || f) === tool._id);
                                        const isSelected = profileData.activeTools.includes(tool._id);

                                        return (
                                            <div
                                                key={tool._id}
                                                onClick={() => toggleTool(tool._id)}
                                                className={`prompt-card ${isSelected ? 'selected' : ''}`}
                                            >
                                                <div className="prompt-image-wrapper">
                                                    {tool.logo ? (
                                                        <img src={tool.logo} alt={tool.name} className="prompt-image" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                            <Megaphone size={40} />
                                                        </div>
                                                    )}

                                                    {/* Selection Overlay */}
                                                    <div className="prompt-overlay">
                                                        <div className="prompt-check-badge">
                                                            <CheckCircle size={24} fill="white" className="text-purple-600" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="prompt-content">
                                                    <div className="prompt-header">
                                                        <h4 className="prompt-title" title={tool.name}>{tool.name}</h4>
                                                        <span className="prompt-badge">{tool.platform || 'AI'}</span>
                                                    </div>
                                                    <p className="prompt-description" title={tool.description}>{tool.description}</p>

                                                    <div className="prompt-actions">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                                                            {isSelected ? 'Selected' : 'Click to select'}
                                                        </span>
                                                        <button
                                                            className={`btn-favorite ${isFav ? 'active' : ''}`}
                                                            onClick={(e) => toggleFavorite(e, tool._id)}
                                                            title={isFav ? "Remove from favorites" : "Add to favorites"}
                                                        >
                                                            <Heart size={20} className={isFav ? "fill-current" : ""} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Library'}
                                </button>
                            </div>
                        )
                    }

                    {/* ACCOUNT TAB */}
                    {
                        activeTab === 'account' && (
                            <form onSubmit={updateAccount}>
                                <h2 className="dashboard-section-title text-red-600">
                                    <ShieldAlert />
                                    <span>Security Settings</span>
                                </h2>

                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-6 rounded-2xl mb-10">
                                    <div className="flex gap-4">
                                        <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-red-800 dark:text-red-400">Important Notice</h4>
                                            <p className="text-sm text-red-700 dark:text-red-500/80 mt-1 leading-relaxed">
                                                Changing your username will update your public profile URL. Your current URL will be automatically redirected to the new one, but we recommend only doing this when necessary.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="form-group max-w-md">
                                        <label className="label-premium">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="input-premium"
                                        />
                                    </div>

                                    <div className="form-group max-w-md">
                                        <label className="label-premium">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-premium pr-10" placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Leave blank if you don't want to change your password.</p>
                                    </div>
                                </div>

                                <button type="submit" disabled={saving} className="btn mt-10 px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none">
                                    {saving ? 'Updating...' : 'Update Account'}
                                </button>
                            </form>
                        )
                    }



                    {/* SHARE TAB */}
                    {
                        activeTab === 'share' && (
                            <div className="text-center">
                                <h2 className="dashboard-section-title justify-center">
                                    <QrCode className="text-accent" />
                                    <span>Share Your Profile</span>
                                </h2>

                                <div className="bg-white p-8 rounded-2xl shadow-xl inline-block mb-8 border border-gray-100">
                                    <QRCode value={`http://${user.username}.${window.location.hostname.includes('localhost') ? 'localhost:5173' : window.location.host}`} size={200} />
                                </div>

                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Scan to visit your profile</p>
                                <p className="text-gray-500 mb-8">{`http://${user.username}.${window.location.host}`}</p>

                                <a
                                    href={`http://${user.username}.${window.location.hostname.includes('localhost') ? 'localhost:5173' : window.location.host}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary px-8 py-3"
                                >
                                    Open Public Profile <ExternalLink size={18} className="ml-2" />
                                </a>
                            </div>
                        )}

                </main>
            </div>
        </div >
    );
};

export default Dashboard;
