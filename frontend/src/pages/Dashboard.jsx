import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    ExternalLink, CheckCircle, AlertCircle, Megaphone
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
import UserAppearance from '../components/user/UserAppearance';
import UserHeroButtons from '../components/user/UserHeroButtons';
import UserNavigation from '../components/user/UserNavigation';
import UserLinks from '../components/user/UserLinks';
import UserOffers from '../components/user/UserOffers';
import UserTools from '../components/user/UserTools';
import UserPrompts from '../components/user/UserPrompts';
import UserAccount from '../components/user/UserAccount';
import UserShare from '../components/user/UserShare';
import BannerModal from '../components/user/BannerModal';
import CustomToolModal from '../components/user/CustomToolModal';
import CustomPromptModal from '../components/user/CustomPromptModal';

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
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

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


    // Init
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
                <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

                {/* Main Content Area */}
                <main className="content-card">

                    {activeTab === 'profile' && (
                        <UserProfile
                            profileData={profileData}
                            handleProfileChange={handleProfileChange}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'appearance' && (
                        <UserAppearance
                            profileData={profileData}
                            handleProfileChange={handleProfileChange}
                            handleImageUpload={handleImageUpload}
                            uploading={uploading}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'heroButtons' && (
                        <UserHeroButtons
                            profileData={profileData}
                            setProfileData={setProfileData}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'navigation' && (
                        <UserNavigation
                            profileData={profileData}
                            setProfileData={setProfileData}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'links' && (
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

                    {activeTab === 'offers' && (
                        <UserOffers
                            profileData={profileData}
                            setProfileData={setProfileData}
                            openAddBannerModal={openAddBannerModal}
                            openEditBannerModal={openEditBannerModal}
                            removeBanner={removeBanner}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'tools' && (
                        <UserTools
                            profileData={profileData}
                            availableTools={availableTools}
                            openAddToolModal={openAddToolModal}
                            removeCustomItem={removeCustomItem}
                            toggleTool={toggleTool}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === 'prompts' && (
                        <UserPrompts
                            profileData={profileData}
                            availableTools={availableTools}
                            openAddPromptModal={openAddPromptModal}
                            openEditPromptModal={openEditPromptModal}
                            removeCustomItem={removeCustomItem}
                            toggleTool={toggleTool}
                            toggleFavorite={toggleFavorite}
                            handleProfileChange={handleProfileChange}
                            saveProfile={saveProfile}
                            saving={saving}
                        />
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
                        />
                    )}

                    {activeTab === 'customize' && <ProfileCustomizer />}

                    {activeTab === 'share' && <UserShare user={user} />}

                </main>
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

        </div>
    );
};

export default Dashboard;