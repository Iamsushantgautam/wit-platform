import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    User, Image, Link as LinkIcon, Layout, Settings,
    ExternalLink, Plus, Trash2, CheckCircle, AlertCircle,
    ChevronRight, Save, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
        activeTools: []
    });

    const [availableTools, setAvailableTools] = useState([]);
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');

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
    };

    const removeLink = (index) => {
        const newLinks = profileData.importantLinks.filter((_, i) => i !== index);
        setProfileData({ ...profileData, importantLinks: newLinks });
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
            setMessage({ type: 'error', text: 'Failed to update profile.' });
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

    return (
        <div className="container dashboard-container min-h-screen">
            <header className="dashboard-header flex justify-between items-end mb-10 pt-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">Workspace</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">Design your digital identity</p>
                </div>
                <Link to={`/u/${user.username}`} target="_blank" className="btn btn-primary flex items-center gap-2 px-6 py-3">
                    <ExternalLink size={18} /> <span>Live Preview</span>
                </Link>
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
                    <TabButton id="links" label="Important Links" icon={LinkIcon} />
                    <TabButton id="tools" label="AI Tools" icon={Layout} />
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
                                <span>Profile Details</span>
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
                        <form onSubmit={saveProfile}>
                            <h2 className="dashboard-section-title">
                                <Image className="text-accent" />
                                <span>Appearance</span>
                            </h2>

                            <div className="space-y-8">
                                <div className="form-group">
                                    <label className="label-premium">Profile Image URL</label>
                                    <input
                                        type="text" name="image"
                                        value={profileData.image} onChange={handleProfileChange}
                                        className="input-premium" placeholder="https://cloudinary.com/..."
                                    />
                                    <p className="text-sm text-gray-500 mt-2 italic">Pro Tip: Use a square image for best results.</p>
                                </div>

                                {profileData.image && (
                                    <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                                            <img src={profileData.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">Avatar Preview</p>
                                            <p className="text-sm text-gray-500">This is how you'll look to others</p>
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
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="dashboard-section-title mb-0">
                                    <LinkIcon className="text-accent" />
                                    <span>Important Links</span>
                                </h2>
                                <button type="button" onClick={addLink} className="btn btn-outline flex items-center gap-2 py-2 px-4 rounded-xl">
                                    <Plus size={18} /> Add New Link
                                </button>
                            </div>

                            <div className="space-y-4">
                                {profileData.importantLinks.map((link, index) => (
                                    <div key={index} className="link-item-premium group animate-in slide-in-from-left duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Title (e.g. My Portfolio)"
                                                className="input-premium"
                                                value={link.title}
                                                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="URL (https://...)"
                                                className="input-premium"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            />
                                        </div>
                                        <button onClick={() => removeLink(index)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}

                                {profileData.importantLinks.length === 0 && (
                                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <LinkIcon size={40} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-lg text-gray-400 font-medium">No links added yet.</p>
                                        <button onClick={addLink} className="text-accent font-bold mt-2 hover:underline">Add your first link</button>
                                    </div>
                                )}
                            </div>

                            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save All Links'}
                            </button>
                        </div>
                    )}

                    {/* TOOLS TAB */}
                    {activeTab === 'tools' && (
                        <div>
                            <h2 className="dashboard-section-title">
                                <Layout className="text-accent" />
                                <span>AI Stack</span>
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Select the AI tools you use. These will be featured on your profile page.</p>

                            <div className="tool-grid-premium">
                                {availableTools.map(tool => (
                                    <div
                                        key={tool._id}
                                        onClick={() => toggleTool(tool._id)}
                                        className={`tool-select-card ${profileData.activeTools.includes(tool._id) ? 'selected' : ''}`}
                                    >
                                        <div className="tool-icon-placeholder">
                                            <Layout size={24} />
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
                    )}

                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
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
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-premium" placeholder="••••••••"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Leave blank if you don't want to change your password.</p>
                                </div>
                            </div>

                            <button type="submit" disabled={saving} className="btn mt-10 px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none">
                                {saving ? 'Updating...' : 'Update Account'}
                            </button>
                        </form>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
