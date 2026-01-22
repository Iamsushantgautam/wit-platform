import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    User, Image, Link as LinkIcon, Layout, Settings,
    ExternalLink, Plus, Trash2, CheckCircle, AlertCircle,
    ChevronRight, Save, ShieldAlert, Share2, QrCode, Megaphone,
    Eye, EyeOff, Search, Instagram, Twitter, Facebook, Linkedin, Github, Youtube, MessageCircle, Heart, Palette, Bell, Edit, Star, X, Tag, Ticket, AlignLeft, Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileCustomizer from '../components/ProfileCustomizer';
import UpdatesTab from '../components/UpdatesTab';
import { addOrUpdateUpdate, deleteUpdate, startEditUpdate, cancelEditUpdate } from '../utils/updatesHelpers';
import '../styles/DashboardAppearance.css';
import '../styles/DashboardLinks.css';
import '../styles/DashboardOffers.css';
import '../styles/DashboardPrompts.css';
import '../styles/AiTools.css';
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
        socialLinks: {
            instagram: '',
            youtube: '',
            telegram: '',
            x: '',
            twitter: '',
            facebook: '',
            whatsapp: '',
            linkedin: '',
            github: '',
            discord: ''
        },
        customItems: [],
        heroOffer: {
            title: '',
            subtitle: '',
            badge: '',
            ctaText: '',
            ctaLink: '',
            backgroundColor: '#1f2937',
            isVisible: true
        }
    });

    const [availableTools, setAvailableTools] = useState([]);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [toolSearch, setToolSearch] = useState('');

    // Updates state
    const [updates, setUpdates] = useState([]);
    const [editingUpdate, setEditingUpdate] = useState(null);
    const [updateForm, setUpdateForm] = useState({ emoji: '🎉', title: '', text: '', thumbnail: '', image: '', link: '' });

    // Banner Modal State
    const [bannerModalOpen, setBannerModalOpen] = useState(false);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(null);
    const [tempBanner, setTempBanner] = useState({
        title: '',
        imageUrl: '',
        link: '',
        caption: '',
        promoCode: '',
        tags: [],
        isVisible: true
    });

    const openAddBannerModal = () => {
        setTempBanner({
            title: '',
            imageUrl: '',
            link: '',
            caption: '',
            promoCode: '',
            tags: [],
            isVisible: true
        });
        setCurrentBannerIndex(null);
        setBannerModalOpen(true);
    };

    const openEditBannerModal = (index) => {
        const banner = profileData.banners[index];
        setTempBanner({
            title: banner.title || '',
            imageUrl: banner.imageUrl || '',
            link: banner.link || '',
            caption: banner.caption || '',
            promoCode: banner.promoCode || '',
            tags: banner.tags || [],
            isVisible: banner.isVisible ?? true
        });
        setCurrentBannerIndex(index);
        setBannerModalOpen(true);
    };

    const saveBannerFromModal = () => {
        let newBanners = [...(profileData.banners || [])];
        if (currentBannerIndex !== null) {
            newBanners[currentBannerIndex] = tempBanner;
        } else {
            newBanners.push(tempBanner);
        }
        setProfileData({ ...profileData, banners: newBanners });
        setBannerModalOpen(false);
        setSuccessMsg(currentBannerIndex !== null ? 'Banner updated!' : 'Banner added!');
        setTimeout(() => setSuccessMsg(''), 2000);
    };

    // Custom Tool Handlers
    const [toolModalOpen, setToolModalOpen] = useState(false);
    const [tempTool, setTempTool] = useState({
        title: '',
        description: '',
        url: '',
        image: '',
        category: 'Productivity'
    });

    const openAddToolModal = () => {
        setTempTool({ title: '', description: '', url: '', image: '', category: 'Productivity' });
        setToolModalOpen(true);
    };

    const handleCustomToolImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setBannerUploading('tool');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=user_tool`, formData, config);
            setTempTool({ ...tempTool, image: imageUrl });
            setMessage({ type: 'success', text: 'Logo uploaded!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Upload failed' });
        } finally {
            setBannerUploading(null);
        }
    };

    const saveCustomToolFromModal = () => {
        if (!tempTool.title) {
            setMessage({ type: 'error', text: 'Tool name is required' });
            return;
        }
        const newTool = { ...tempTool, type: 'tool' };
        setProfileData({ ...profileData, customItems: [...(profileData.customItems || []), newTool] });
        setToolModalOpen(false);
        setSuccessMsg('Custom tool added!');
        setTimeout(() => setSuccessMsg(''), 2000);
    };

    const removeCustomItem = (itemToRemove) => {
        const newItems = profileData.customItems.filter(i => i !== itemToRemove);
        setProfileData({ ...profileData, customItems: newItems });
    };

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
                const [profileRes, toolsRes, updatesRes] = await Promise.all([
                    axios.get(`${API_URL}/profiles/me`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`${API_URL}/tools`),
                    axios.get(`${API_URL}/profiles/updates`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);
                setProfileData(profileRes.data);
                setAvailableTools(toolsRes.data);
                setUpdates(updatesRes.data);
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

    // Banner Handlers (Legacy / Inline - kept for compatibility if needed, but removeBanner is used)
    const handleBannerChange = (index, field, value) => {
        const newBanners = [...profileData.banners];
        newBanners[index][field] = value;
        setProfileData({ ...profileData, banners: newBanners });
    };

    const addBanner = () => {
        openAddBannerModal();
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
        // Kept for direct upload potential, though modal uses URL
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
            setMessage({ type: 'error', text: 'Banner upload failed' });
        } finally {
            setBannerUploading(null);
        }
    };

    const handleTempBannerImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setBannerUploading('temp');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=uploads`, formData, config);
            setTempBanner({ ...tempBanner, imageUrl: imageUrl });
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Upload failed. Please try a different image.' });
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
            setSuccessMsg('Social profiles saved successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
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
                    <TabButton id="updates" label="Updates" icon={Bell} />
                    <TabButton id="customize" label="Customize Profile" icon={Palette} />
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
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="dashboard-section-title mb-0">
                                    <LinkIcon className="text-accent" />
                                    <span>Connections & Links</span>
                                </h2>
                            </div>

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
                                <h2 className="dashboard-section-title">
                                    <Megaphone className="text-accent" />
                                    <span>Offers & Banners</span>
                                </h2>

                                {/* Hero Offer Editor */}
                                <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                                            Hero Offer Banner
                                        </h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="toggle-checkbox"
                                                checked={profileData.heroOffer?.isVisible !== false}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    heroOffer: { ...profileData.heroOffer, isVisible: e.target.checked }
                                                })}
                                            />
                                            <div className="toggle-slider"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {profileData.heroOffer?.isVisible !== false ? 'Visible' : 'Hidden'}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="label-premium">Banner Title</label>
                                            <input
                                                type="text"
                                                className="input-premium font-bold"
                                                value={profileData.heroOffer?.title || ''}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    heroOffer: { ...profileData.heroOffer, title: e.target.value }
                                                })}
                                                placeholder="e.g. 5-in-1 AI Viral Offer Pack"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="label-premium">Badge Text</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                value={profileData.heroOffer?.badge || ''}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    heroOffer: { ...profileData.heroOffer, badge: e.target.value }
                                                })}
                                                placeholder="e.g. Limited Time Offer"
                                            />
                                        </div>
                                        <div className="form-group md:col-span-2">
                                            <label className="label-premium">Subtitle / Description</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                value={profileData.heroOffer?.subtitle || ''}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    heroOffer: { ...profileData.heroOffer, subtitle: e.target.value }
                                                })}
                                                placeholder="Get 20% Off This Weekend Only!"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="label-premium">Button Text</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                value={profileData.heroOffer?.ctaText || ''}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    heroOffer: { ...profileData.heroOffer, ctaText: e.target.value }
                                                })}
                                                placeholder="GRAB OFFER"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="label-premium">Button Link</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="input-premium pl-9"
                                                    value={profileData.heroOffer?.ctaLink || ''}
                                                    onChange={(e) => setProfileData({
                                                        ...profileData,
                                                        heroOffer: { ...profileData.heroOffer, ctaLink: e.target.value }
                                                    })}
                                                    placeholder="https://..."
                                                />
                                                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="label-premium">Background Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    className="h-10 w-20 rounded cursor-pointer border-0 p-0"
                                                    value={profileData.heroOffer?.backgroundColor || '#1f2937'}
                                                    onChange={(e) => setProfileData({
                                                        ...profileData,
                                                        heroOffer: { ...profileData.heroOffer, backgroundColor: e.target.value }
                                                    })}
                                                />
                                                <span className="text-sm text-gray-500 font-mono">
                                                    {profileData.heroOffer?.backgroundColor || '#1f2937'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Additional Banners</h3>
                                    <button type="button" onClick={openAddBannerModal} className="btn btn-outline flex items-center gap-2 py-2 px-4 rounded-xl">
                                        <Plus size={18} /> Add Banner
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(profileData.banners || []).map((banner, index) => (
                                        <div key={index} className={`bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 group transition-all hover:shadow-md ${!banner.isVisible ? 'opacity-60' : ''}`}>
                                            {/* Thumbnail */}
                                            <div className="w-24 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 relative">
                                                {banner.imageUrl ? (
                                                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Image size={20} />
                                                    </div>
                                                )}
                                                {!banner.isVisible && (
                                                    <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center">
                                                        <EyeOff size={16} className="text-gray-500" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{banner.title || 'Untitled Banner'}</h4>
                                                    {!banner.isVisible && <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-px rounded">Hidden</span>}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                                    {banner.tags && banner.tags.length > 0 && (
                                                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                                                            <Tag size={10} /> {banner.tags.length} tags
                                                        </span>
                                                    )}
                                                    {banner.promoCode && (
                                                        <span className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded text-xs border border-green-100 dark:border-green-900">
                                                            <Ticket size={10} /> {banner.promoCode}
                                                        </span>
                                                    )}
                                                    {banner.caption && (
                                                        <span className="flex items-center gap-1 text-xs truncate max-w-[200px]" title={banner.caption}>
                                                            <AlignLeft size={10} /> {banner.caption}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditBannerModal(index)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition" title="Edit">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => removeBanner(index)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {(!profileData.banners || profileData.banners.length === 0) && (
                                        <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center gap-3">
                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                                                <Megaphone size={24} className="text-gray-400" />
                                            </div>
                                            <p>No additional banners added yet.</p>
                                            <button onClick={openAddBannerModal} className="text-blue-600 font-semibold hover:underline text-sm">Create your first banner</button>
                                        </div>
                                    )}
                                </div>

                                <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                                    <Save size={20} />
                                    {saving ? 'Saving...' : 'Save Offers'}
                                </button>
                            </div>
                        )
                    }

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="dashboard-section-title mb-1">
                                        <Layout className="text-accent" />
                                        <span>AI Stack</span>
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">Manage your featured tools. Add custom tools or select from library.</p>
                                </div>
                                <button onClick={openAddToolModal} className="btn btn-outline flex items-center gap-2 py-2 px-4 whitespace-nowrap">
                                    <Plus size={18} /> Add Custom Tool
                                </button>
                            </div>

                            {/* Custom Tools Section */}
                            {profileData.customItems && profileData.customItems.filter(i => (!i.type || i.type === 'tool')).length > 0 && (
                                <div className="mb-10">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                                        <Wrench size={18} className="text-blue-500" /> Your Custom Tools
                                    </h3>
                                    <div className="tools-grid">
                                        {profileData.customItems.filter(i => (!i.type || i.type === 'tool')).map((tool, idx) => (
                                            <article key={idx} className="tool-card relative group">
                                                <button
                                                    onClick={() => removeCustomItem(tool)}
                                                    className="absolute top-2 right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-20 hover:bg-red-200"
                                                    title="Remove Tool"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="tool-card-header">
                                                    <div className="tool-card-logo">
                                                        {tool.image ? (
                                                            <img src={tool.image} alt={tool.title} />
                                                        ) : (
                                                            <Wrench className="tool-card-logo-icon" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="tool-card-info">
                                                        <h3 className="tool-card-title">{tool.title}</h3>
                                                        <span className="tool-card-category">
                                                            {tool.category || 'Custom Tool'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="tool-card-description line-clamp-3">
                                                    {tool.description}
                                                </p>
                                                <div className="tool-card-action">
                                                    <a
                                                        href={tool.url || '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="tool-card-btn"
                                                    >
                                                        Visit Website
                                                        <ExternalLink size={18} className="tool-card-btn-icon" />
                                                    </a>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Global Tools Section */}
                            <div className="mb-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Select from Library</h3>
                                    <div className="search-wrapper-premium w-full md:w-64">
                                        <Search className="search-icon-premium" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search library..."
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
                                                <div className="absolute top-2 right-2 text-blue-600 bg-white rounded-full shadow-sm">
                                                    <CheckCircle size={20} fill="currentColor" className="text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
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


                    {/* UPDATES TAB */}
                    {activeTab === 'updates' && (
                        <UpdatesTab
                            updates={updates}
                            addOrUpdateUpdate={(e) => {
                                e.preventDefault();
                                addOrUpdateUpdate(API_URL, editingUpdate, updateForm, setUpdates, setMessage, setEditingUpdate, setUpdateForm, setSaving);
                            }}
                            deleteUpdate={(id) => deleteUpdate(API_URL, id, setUpdates, setMessage)}
                            startEditUpdate={(update) => startEditUpdate(update, setEditingUpdate, setUpdateForm)}
                            cancelEditUpdate={() => cancelEditUpdate(setEditingUpdate, setUpdateForm)}
                            editingUpdate={editingUpdate}
                            updateForm={updateForm}
                            setUpdateForm={setUpdateForm}
                            saving={saving}
                            API_URL={API_URL}
                        />)}

                    {/* CUSTOMIZE TAB */}
                    {activeTab === 'customize' && <ProfileCustomizer />}

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
            {/* BANNER MODAL */}
            {bannerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800 flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    {currentBannerIndex !== null ? <Edit size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                                    {currentBannerIndex !== null ? 'Edit Banner' : 'Create New Banner'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Add details for your promotional banner</p>
                            </div>
                            <button onClick={() => setBannerModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            {/* Toggle Visibility */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                <span className="font-medium text-gray-900 dark:text-white">Banner Visibility</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="toggle-checkbox"
                                        checked={tempBanner.isVisible}
                                        onChange={(e) => setTempBanner({ ...tempBanner, isVisible: e.target.checked })}
                                    />
                                    <div className="toggle-slider"></div>
                                </label>
                            </div>

                            {/* Title */}
                            <div className="form-group">
                                <label className="label-premium">Banner Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={tempBanner.title}
                                    onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                                    placeholder="e.g. Summer Sale 2024"
                                />
                            </div>

                            {/* Banner Image Selection */}
                            <div className="form-group">
                                <label className="label-premium mb-3 block">Banner Image</label>

                                {/* Upload/Preview Area */}
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleTempBannerImageUpload}
                                        className="absolute inset-0 w-full h-full cursor-pointer z-10"
                                        style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
                                        disabled={bannerUploading === 'temp'}
                                    />

                                    {tempBanner.imageUrl ? (
                                        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-inner">
                                            <img src={tempBanner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                                                    <Image size={18} /> Change Image
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                            {bannerUploading === 'temp' ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
                                            ) : (
                                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform">
                                                    <Image size={28} />
                                                </div>
                                            )}
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                                {bannerUploading === 'temp' ? 'Uploading...' : 'Click to upload banner image'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max 2MB)</p>
                                        </div>
                                    )}
                                </div>

                                {/* URL fallback */}
                                <div className="mt-3">
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-gray-500 hover:text-blue-600 font-medium list-none flex items-center gap-1 w-max">
                                            <LinkIcon size={12} /> Or paste direct image URL
                                        </summary>
                                        <div className="mt-2 animate-in slide-in-from-top-1">
                                            <input
                                                type="text"
                                                className="input-premium pl-3 text-xs py-2 h-9"
                                                value={tempBanner.imageUrl}
                                                onChange={(e) => setTempBanner({ ...tempBanner, imageUrl: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </details>
                                </div>
                            </div>

                            {/* Link */}
                            <div className="form-group">
                                <label className="label-premium">Destination Link</label>
                                <div className="relative" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-premium pl-10"
                                        value={tempBanner.link}
                                        onChange={(e) => setTempBanner({ ...tempBanner, link: e.target.value })}
                                        placeholder="https://yourstore.com/offer"
                                    />
                                    <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                        <LinkIcon size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Promo Code */}
                                <div className="form-group">
                                    <label className="label-premium">Promo Code</label>
                                    <div className="relative" style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="input-premium pl-10 font-mono"
                                            value={tempBanner.promoCode}
                                            onChange={(e) => setTempBanner({ ...tempBanner, promoCode: e.target.value })}
                                            placeholder="SAVE20"
                                        />
                                        <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                            <Ticket size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="form-group">
                                    <label className="label-premium">Tags (comma separated)</label>
                                    <div className="relative" style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className="input-premium pl-10"
                                            value={Array.isArray(tempBanner.tags) ? tempBanner.tags.join(', ') : tempBanner.tags}
                                            onChange={(e) => setTempBanner({ ...tempBanner, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                            placeholder="sale, limited, new"
                                        />
                                        <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                            <Tag size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="form-group">
                                <label className="label-premium">Caption / Description</label>
                                <textarea
                                    rows="3"
                                    className="input-premium min-h-[80px]"
                                    value={tempBanner.caption}
                                    onChange={(e) => setTempBanner({ ...tempBanner, caption: e.target.value })}
                                    placeholder="Add a short description or terms for this offer..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
                            <button onClick={() => setBannerModalOpen(false)} className="btn btn-ghost px-6">Cancel</button>
                            <button onClick={saveBannerFromModal} className="btn btn-primary px-8">
                                {currentBannerIndex !== null ? 'Save Changes' : 'Create Banner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD CUSTOM TOOL MODAL */}
            {toolModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800 flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                <Plus size={24} className="text-blue-500" /> Add Custom Tool
                            </h3>
                            <button onClick={() => setToolModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                            {/* Logo Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCustomToolImageUpload}
                                        className="absolute inset-0 w-full h-full cursor-pointer z-20"
                                        style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20 }}
                                        disabled={bannerUploading === 'tool'}
                                    />
                                    {tempTool.image ? (
                                        <div className="relative w-full h-full">
                                            <img src={tempTool.image} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <Edit size={16} className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center gap-1 pointer-events-none">
                                            {bannerUploading === 'tool' ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div> : <Image size={32} />}
                                            <span className="text-[10px]">Logo</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Upload tool logo (Square recommended)</p>
                            </div>

                            <div className="form-group">
                                <label className="label-premium">Tool Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={tempTool.title}
                                    onChange={(e) => setTempTool({ ...tempTool, title: e.target.value })}
                                    placeholder="e.g. My SaaS Tool"
                                />
                            </div>

                            <div className="form-group">
                                <label className="label-premium">Category</label>
                                <select
                                    className="input-premium"
                                    value={tempTool.category}
                                    onChange={(e) => setTempTool({ ...tempTool, category: e.target.value })}
                                >
                                    <option value="Productivity">Productivity</option>
                                    <option value="Design">Design</option>
                                    <option value="Development">Development</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Writing">Writing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label-premium">Website URL</label>
                                <div className="relative" style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="input-premium pl-10"
                                        value={tempTool.url}
                                        onChange={(e) => setTempTool({ ...tempTool, url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                        <LinkIcon size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label-premium">Description</label>
                                <textarea
                                    className="input-premium min-h-[100px]"
                                    value={tempTool.description}
                                    onChange={(e) => setTempTool({ ...tempTool, description: e.target.value })}
                                    placeholder="Briefly describe what this tool does..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
                            <button onClick={() => setToolModalOpen(false)} className="btn btn-ghost px-6">Cancel</button>
                            <button onClick={saveCustomToolFromModal} className="btn btn-primary px-8">Save Tool</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;