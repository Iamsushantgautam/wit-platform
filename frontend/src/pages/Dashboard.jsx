import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    ExternalLink, CheckCircle, AlertCircle, Megaphone, Eye, X,
    Smartphone, Tablet, Monitor, Home, Crown, Coins
} from 'lucide-react';
import ProfileCustomizer from '../components/ProfileCustomizer';
import UpdatesTab from '../components/UpdatesTab';
import { addOrUpdateUpdate, deleteUpdate, startEditUpdate, cancelEditUpdate } from '../utils/updatesHelpers';
import '../styles/DashboardAppearance.css';
import '../styles/DashboardLinks.css';
import '../styles/DashboardOffers.css';
import '../styles/DashboardPrompts.css';


// User Components
import DashboardSidebar from '../components/user/DashboardSidebar';
import UserProfile from '../components/user/UserProfile';

import UserHeroButtons from '../components/user/UserHeroButtons';
import UserNavigation from '../components/user/UserNavigation';
import UserLinks from '../components/user/UserLinks';
import UserOffers from '../components/user/UserOffers';
import UserTools from '../components/user/UserTools';
import UserPrompts from '../components/user/UserPrompts';
import UserPurchases from '../components/user/UserPurchases';
import UserAccount from '../components/user/UserAccount';
import UserShare from '../components/user/UserShare';
import BannerModal from '../components/user/BannerModal';
import CustomToolModal from '../components/user/CustomToolModal';
import CustomPromptModal from '../components/user/CustomPromptModal';
import '../styles/DashboardLayout.css'; // Import Helper CSS

const UpgradeBanner = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mx-4 my-8 animate-fade-in-up">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-white dark:ring-slate-800">
            <Crown size={40} fill="currentColor" className="opacity-80" />
        </div>
        <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-lg leading-relaxed">
            This premium feature is locked. Upgrade your plan to unlock unlimited access to tools, prompts, and offers.
        </p>
        <Link to="/membership" className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative flex items-center gap-2">
                Upgrade Now <Crown size={18} />
            </span>
        </Link>
    </div>
);

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
        logo: '',
        showLogo: true,
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
        },
        heroButtons: {
            button1: {
                label: 'Get Help',
                icon: 'MessageCircle',
                link: '#',
                isVisible: true
            },
            button2: {
                label: 'Free Prompts',
                icon: 'Star',
                link: '/prompts',
                isVisible: true
            }
        },
        navigationSettings: {
            bottomNavItems: [],
            useDefaultMenu: true
        }
    });

    const [availableTools, setAvailableTools] = useState([]);
    const [availablePrompts, setAvailablePrompts] = useState([]);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [previewKey, setPreviewKey] = useState(0); // Key to force refresh iframe

    // Updates state
    const [updates, setUpdates] = useState([]);
    const [editingUpdate, setEditingUpdate] = useState(null);
    const [updateForm, setUpdateForm] = useState({ emoji: '🎉', title: '', text: '', thumbnail: '', image: '', link: '' });

    // Feature flags from admin settings
    const [featureFlags, setFeatureFlags] = useState({
        userToolsEnabled: true,
        userPromptsEnabled: true,
        userOffersEnabled: true,
        userLinksEnabled: true,
        userUpdatesEnabled: true,
        userNavigationEnabled: true,
        userHeroButtonsEnabled: true
    });

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

    // Custom Tool/Prompt Modal State
    const [toolModalOpen, setToolModalOpen] = useState(false);
    const [tempTool, setTempTool] = useState({
        title: '',
        description: '',
        url: '',
        image: '',
        category: 'Productivity'
    });

    const [promptModalOpen, setPromptModalOpen] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(null);
    const [tempPrompt, setTempPrompt] = useState({
        title: '',
        prompt: '',
        image: '',
        category: 'General',
        tags: ''
    });

    const [uploading, setUploading] = useState(false);
    const [bannerUploading, setBannerUploading] = useState(null);


    // --- HANDLERS ---

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
        setPreviewKey(prev => prev + 1);
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
            setMessage({ type: 'error', text: 'Upload failed.' });
        } finally {
            setBannerUploading(null);
        }
    };

    const removeBanner = (index) => {
        const newBanners = profileData.banners.filter((_, i) => i !== index);
        setProfileData({ ...profileData, banners: newBanners });
    };

    // Custom Tool Handlers
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

    const saveCustomToolFromModal = async () => {
        if (!tempTool.title) {
            setMessage({ type: 'error', text: 'Tool name is required' });
            return;
        }
        const newTool = { ...tempTool, type: 'tool' };
        const updatedCustomItems = [...(profileData.customItems || []), newTool];
        const updatedProfileData = { ...profileData, customItems: updatedCustomItems };

        setProfileData(updatedProfileData);
        setToolModalOpen(false);

        // Auto-save
        setSaving(true);
        try {
            await axios.post(`${API_URL}/profiles`, updatedProfileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccessMsg('Custom tool saved successfully!');
            setTimeout(() => setSuccessMsg(''), 2000);
            setPreviewKey(prev => prev + 1);
        } catch (error) {
            console.error("Auto-save failed", error);
            setMessage({ type: 'error', text: 'Tool added locally but failed to save to server.' });
        } finally {
            setSaving(false);
        }
    };

    // Custom Prompt Handlers
    const openAddPromptModal = () => {
        setTempPrompt({ title: '', prompt: '', image: '', category: 'General', tags: '' });
        setCurrentPromptIndex(null);
        setPromptModalOpen(true);
    };

    const openEditPromptModal = (index) => {
        const customPrompts = profileData.customItems.filter(i => i.type === 'prompt');
        const prompt = customPrompts[index];
        setTempPrompt({
            title: prompt.title || '',
            prompt: prompt.prompt || '',
            image: prompt.image || '',
            category: prompt.category || 'General',
            tags: Array.isArray(prompt.tags) ? prompt.tags.join(', ') : (prompt.tags || '')
        });
        setCurrentPromptIndex(index);
        setPromptModalOpen(true);
    };

    const handleCustomPromptImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setBannerUploading('prompt');

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=user_prompt`, formData, config);
            setTempPrompt({ ...tempPrompt, image: imageUrl });
            setMessage({ type: 'success', text: 'Image uploaded!' });
        } catch (error) {
            console.error("Upload error:", error);
            const errMsg = error.response?.data?.message || error.message || 'Unknown error';
            setMessage({ type: 'error', text: `Upload failed: ${errMsg}` });
        } finally {
            setBannerUploading(null);
        }
    };

    const saveCustomPromptFromModal = async () => {
        if (!tempPrompt.title || !tempPrompt.prompt) {
            setMessage({ type: 'error', text: 'Title and Prompt are required' });
            return;
        }

        // Process tags
        const processedTags = tempPrompt.tags
            ? tempPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];

        const promptData = {
            ...tempPrompt,
            tags: processedTags,
            type: 'prompt'
        };

        console.log('Saving prompt with data:', promptData); // Debug log
        console.log('Image URL:', promptData.image); // Debug image specifically

        let updatedCustomItems;
        if (currentPromptIndex !== null) {
            // Edit mode: Update existing prompt
            const customPrompts = profileData.customItems.filter(i => i.type === 'prompt');
            const otherItems = profileData.customItems.filter(i => i.type !== 'prompt');
            customPrompts[currentPromptIndex] = promptData;
            updatedCustomItems = [...otherItems, ...customPrompts];
        } else {
            // Add mode: Add new prompt
            updatedCustomItems = [...(profileData.customItems || []), promptData];
        }

        const updatedProfileData = { ...profileData, customItems: updatedCustomItems };

        // Update local state
        setProfileData(updatedProfileData);
        setPromptModalOpen(false);
        setCurrentPromptIndex(null);

        // Auto-save to backend
        setSaving(true);
        try {
            await axios.post(`${API_URL}/profiles`, updatedProfileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccessMsg(currentPromptIndex !== null ? 'Prompt updated successfully!' : 'Custom prompt saved successfully!');
            setTimeout(() => setSuccessMsg(''), 2000);
            setPreviewKey(prev => prev + 1);
        } catch (error) {
            console.error("Auto-save failed", error);
            setMessage({ type: 'error', text: 'Prompt saved locally but failed to save to server.' });
        } finally {
            setSaving(false);
        }
    };

    const removeCustomItem = (itemToRemove) => {
        const newItems = profileData.customItems.filter(i => i !== itemToRemove);
        setProfileData({ ...profileData, customItems: newItems });
    };

    const toggleTool = (toolId) => {
        const currentTools = [...(profileData.activeTools || [])];
        const index = currentTools.indexOf(toolId);
        if (index > -1) {
            currentTools.splice(index, 1);
        } else {
            currentTools.push(toolId);
        }
        setProfileData({ ...profileData, activeTools: currentTools });
    };

    const togglePrompt = (promptId) => {
        const currentPrompts = [...(profileData.activePrompts || [])];
        const index = currentPrompts.indexOf(promptId);
        if (index > -1) {
            currentPrompts.splice(index, 1);
        } else {
            currentPrompts.push(promptId);
        }
        setProfileData({ ...profileData, activePrompts: currentPrompts });
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


    // Init
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

                const [profileRes, toolsRes, promptsRes, updatesRes, featuresRes] = await Promise.all([
                    axios.get(`${API_URL}/profiles/me`, config),
                    axios.get(`${API_URL}/tools`, config),
                    axios.get(`${API_URL}/prompts`, config),
                    axios.get(`${API_URL}/profiles/updates`, config),
                    axios.get(`${API_URL}/admin/features`)
                ]);
                setProfileData(profileRes.data);
                setAvailableTools(toolsRes.data);

                // Process prompts with lock status
                const promptsWithLockStatus = promptsRes.data.map(p => {
                    if (!p.isPaid) return { ...p, isLocked: false };
                    // user.unlockedPrompts is array of objects from AuthContext
                    const isUnlocked = user?.unlockedPrompts?.some(u =>
                        (typeof u === 'string' ? u === p._id : u._id === p._id)
                    );
                    return { ...p, isLocked: !isUnlocked };
                });
                setAvailablePrompts(promptsWithLockStatus);

                setUpdates(updatesRes.data);

                // Fix: Handle the new API response structure where features are nested
                if (featuresRes.data.features) {
                    setFeatureFlags(featuresRes.data.features);
                } else {
                    setFeatureFlags(featuresRes.data);
                }

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

    // Handlers passing to Components
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

            // Auto-save logic
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
            setPreviewKey(prev => prev + 1); // Refresh preview
        }
    };


    const handleLogoUpload = async (e) => {
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
            // reusing 'avatar' context or 'uploads', maybe 'logo' context if backend supports it, defaulting to uploads
            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=uploads`, formData, config);

            // Auto-save logic
            const updatedProfile = { ...profileData, logo: imageUrl };
            setProfileData(updatedProfile);
            await axios.post(`${API_URL}/profiles`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage({ type: 'success', text: 'Logo uploaded!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Logo upload failed' });
        } finally {
            setUploading(false);
            setPreviewKey(prev => prev + 1); // Refresh preview
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
            setSuccessMsg('Changes saved!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
            setPreviewKey(prev => prev + 1);
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

    // Use path-based URL for preview and link
    const publicProfileUrl = `${window.location.origin}/${user.username}`;
    const favouritesUrl = `${publicProfileUrl}?tab=prompts`;

    return (
        <div className="container dashboard-container min-h-screen">
            {/* HEADER - Updated to include Preview Toggle for Tablets */}
            <header className="dashboard-header flex justify-between items-center bg-white border-b border-gray-200 px-6 h-16 fixed top-0 w-full z-50">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Go Home">
                        <Home size={30} />
                    </Link>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        <span className="text-gray-400">Dashboard</span>
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={publicProfileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-semibold transition-colors"
                    >
                        <ExternalLink size={16} /> Live Site
                    </a>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/30">
                            <Coins size={16} />
                            <span className="text-sm font-black">{user?.coins || 0}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            {message && (
                <div className="fixed top-20 right-6 z-[60] p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 bg-white shadow-lg border border-gray-100">
                    {message.type === 'success' ? <CheckCircle size={22} className="text-green-500" /> : <AlertCircle size={22} className="text-red-500" />}
                    <span className="font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100">&times;</button>
                </div>
            )}

            <div className="dashboard-layout-new">
                {/* 1. SIDEBAR COLUMN */}
                <div className="layout-sidebar">
                    <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} featureFlags={featureFlags} />

                    {/* Move Live Preview button to Sidebar for smaller screens or keep in header? Header is fine. */}
                </div>

                {/* 2. MAIN CONTENT COLUMN */}
                {(activeTab || window.innerWidth > 768) && (
                    <main className="layout-content ">
                        {/* Mobile Close Button to return to Preview (md:hidden) */}
                        {activeTab && (
                            <button
                                onClick={() => setActiveTab(null)}
                                className="content-close-mobile-btn"
                            >
                                <X size={20} />
                            </button>
                        )}
                        <div className="content-card"> {/* Keep card styling but it wraps inner content */}

                            {activeTab === 'profile' && (
                                <UserProfile
                                    profileData={profileData}
                                    handleProfileChange={handleProfileChange}
                                    handleImageUpload={handleImageUpload}
                                    handleLogoUpload={handleLogoUpload}
                                    uploading={uploading}
                                    saveProfile={saveProfile}
                                    saving={saving}
                                />
                            )}

                            {activeTab === 'purchases' && (
                                <UserPurchases />
                            )}



                            {activeTab === 'heroButtons' && featureFlags.userHeroButtonsEnabled && (
                                <UserHeroButtons
                                    profileData={profileData}
                                    setProfileData={setProfileData}
                                    saveProfile={saveProfile}
                                    saving={saving}
                                />
                            )}

                            {activeTab === 'navigation' && featureFlags.userNavigationEnabled && (
                                (user.plan === 'pro' || user.plan === 'premium' || user.role === 'master_admin') ? (
                                    <UserNavigation
                                        profileData={profileData}
                                        setProfileData={setProfileData}
                                        saveProfile={saveProfile}
                                        saving={saving}
                                    />
                                ) : (
                                    <UpgradeBanner title="Custom Navigation" />
                                )
                            )}

                            {activeTab === 'links' && featureFlags.userLinksEnabled && (
                                <UserLinks
                                    profileData={profileData}
                                    handleLinkChange={handleLinkChange}
                                    removeLink={removeLink}
                                    addLink={addLink}
                                    setProfileData={setProfileData}
                                    saveProfile={saveProfile}
                                    saving={saving}
                                    successMsg={successMsg}
                                />
                            )}

                            {activeTab === 'offers' && featureFlags.userOffersEnabled && (
                                (user.plan === 'pro' || user.plan === 'premium' || user.role === 'master_admin') ? (
                                    <UserOffers
                                        profileData={profileData}
                                        setProfileData={setProfileData}
                                        openAddBannerModal={openAddBannerModal}
                                        openEditBannerModal={openEditBannerModal}
                                        removeBanner={removeBanner}
                                        saveProfile={saveProfile}
                                        saving={saving}
                                    />
                                ) : (
                                    <UpgradeBanner title="Unlock Exclusive Offers" />
                                )
                            )}

                            {activeTab === 'tools' && featureFlags.userToolsEnabled && (
                                (user.plan === 'pro' || user.plan === 'premium' || user.role === 'master_admin') ? (
                                    <UserTools
                                        profileData={profileData}
                                        availableTools={availableTools}
                                        openAddToolModal={openAddToolModal}
                                        removeCustomItem={removeCustomItem}
                                        toggleTool={toggleTool}
                                        saveProfile={saveProfile}
                                        saving={saving}
                                    />
                                ) : (
                                    <UpgradeBanner title="Unlock AI Tools" />
                                )
                            )}

                            {activeTab === 'prompts' && featureFlags.userPromptsEnabled && (
                                (user.plan === 'pro' || user.plan === 'premium' || user.role === 'master_admin') ? (
                                    <UserPrompts
                                        profileData={profileData}
                                        availableTools={availableTools}
                                        availablePrompts={availablePrompts}
                                        setAvailablePrompts={setAvailablePrompts}
                                        featureFlags={featureFlags}
                                        openAddPromptModal={openAddPromptModal}
                                        openEditPromptModal={openEditPromptModal}
                                        removeCustomItem={removeCustomItem}
                                        toggleTool={togglePrompt}
                                        toggleFavorite={toggleFavorite}
                                        handleProfileChange={handleProfileChange}
                                        saveProfile={saveProfile}
                                        saving={saving}
                                    />
                                ) : (
                                    <UpgradeBanner title="Unlock Premium Prompts" />
                                )
                            )}

                            {activeTab === 'account' && (
                                <UserAccount
                                    username={username}
                                    setUsername={setUsername}
                                    password={password}
                                    setPassword={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    updateAccount={updateAccount}
                                    saving={saving}
                                />
                            )}


                            {activeTab === 'updates' && featureFlags.userUpdatesEnabled && (
                                (user.plan === 'pro' || user.plan === 'premium' || user.role === 'master_admin') ? (
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
                                    />
                                ) : (
                                    <UpgradeBanner title="Manage Updates" />
                                )
                            )}

                            {activeTab === 'customize' && <ProfileCustomizer />}

                            {activeTab === 'share' && <UserShare user={user} />}
                        </div>
                    </main>
                )}

            </div>

            {/* MODALS */}
            <BannerModal
                isOpen={bannerModalOpen}
                onClose={() => setBannerModalOpen(false)}
                tempBanner={tempBanner}
                setTempBanner={setTempBanner}
                onSave={saveBannerFromModal}
                handleImageUpload={handleTempBannerImageUpload}
                uploading={bannerUploading === 'temp'}
                isEdit={currentBannerIndex !== null}
            />

            <CustomToolModal
                isOpen={toolModalOpen}
                onClose={() => setToolModalOpen(false)}
                tempTool={tempTool}
                setTempTool={setTempTool}
                onSave={saveCustomToolFromModal}
                handleImageUpload={handleCustomToolImageUpload}
                uploading={bannerUploading === 'tool'}
            />

            <CustomPromptModal
                isOpen={promptModalOpen}
                onClose={() => setPromptModalOpen(false)}
                tempPrompt={tempPrompt}
                setTempPrompt={setTempPrompt}
                onSave={saveCustomPromptFromModal}
                handleImageUpload={handleCustomPromptImageUpload}
                uploading={bannerUploading === 'prompt'}
            />

        </div >
    );
};

export default Dashboard;