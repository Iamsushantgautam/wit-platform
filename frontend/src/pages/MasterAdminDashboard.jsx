import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Layout, Image, Plus, Search, Filter, Trash2, Edit2, CheckCircle, XCircle, MoreVertical, LogOut, Globe, Wand2 } from 'lucide-react';
import '../styles/Admin.css';
import '../styles/Prompts.css';

// Sidebar Item Component
const SidebarItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`sidebar-tab w-full ${activeTab === id ? 'active' : ''}`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </button>
);

const MasterAdminDashboard = () => {
    const { API_URL, user, logout } = useContext(AuthContext);

    // State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [tools, setTools] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ totalUsers: 0, totalTools: 0, totalPrompts: 0 });

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', url: '', logo: '', category: '',
        prompt: '', promptDescription: '', type: 'tool',
        platform: 'Generic', tags: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                const [usersRes, toolsRes] = await Promise.all([
                    axios.get(`${API_URL}/user-manage`, config),
                    axios.get(`${API_URL}/tools`)
                ]);
                setUsers(usersRes.data);
                setTools(toolsRes.data);

                // Calculate Stats
                setStats({
                    totalUsers: usersRes.data.length,
                    totalTools: toolsRes.data.filter(t => t.type !== 'prompt').length,
                    totalPrompts: toolsRes.data.filter(t => t.type === 'prompt').length
                });
            } catch (error) {
                console.error("Error loading admin data", error);
            }
        };
        fetchData();
    }, [API_URL]);

    // Handlers
    // Handlers
    const handleSave = async (e) => {
        e.preventDefault();

        const payload = { ...formData }; // Clone to avoid mutation side effects

        // Validation & Defaults Logic
        if (formData.type === 'prompt') {
            if (!formData.name) return alert('Please give this prompt a Title/Name.');
            if (!formData.logo) return alert('An image upload is required for prompts.');
            if (!formData.prompt) return alert('The prompt text is required.');

            // Defaults for schema compliance
            if (!payload.description) payload.description = payload.prompt.substring(0, 100) + (payload.prompt.length > 100 ? '...' : '');
            if (!payload.url) payload.url = '#'; // Prompts don't have a link usually
            if (!payload.category || payload.category === '') payload.category = 'AI Image';
        } else {
            // Tool Validation
            if (!formData.name || formData.name.trim() === '') {
                return alert('Name is required.');
            }
            if (formData.type === 'tool' && !formData.url && !formData.logo) {
                return alert('Provide a tool URL or upload a logo image.');
            }
        }

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingItem) {
                const res = await axios.put(`${API_URL}/tools/${editingItem._id}`, payload, config);
                setTools(tools.map(t => t._id === editingItem._id ? res.data : t));
            } else {
                const res = await axios.post(`${API_URL}/tools`, payload, config);
                setTools([res.data, ...tools]);
            }
            closeForm();
        } catch (error) {
            console.error("Error saving item", error);
            const message = error.response?.data?.message || error.message || 'Failed to save item';
            alert(`Failed to save item: ${message}`);
        }
    };

    // Image upload handler for logo
    const handleLogoFile = async (file) => {
        if (!file) return;
        const form = new FormData();
        form.append('image', file);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post(`${API_URL}/upload`, form, config);
            // API returns the uploaded image path/url
            setFormData(prev => ({ ...prev, logo: res.data }));
        } catch (err) {
            console.error('Upload failed', err);
            alert('Image upload failed. See console.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item permanently?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.delete(`${API_URL}/tools/${id}`, config);
            setTools(tools.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error deleting", error);
        }
    };

    const toggleBlockUser = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/user-manage/${id}/block`, {}, config);
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (error) {
            console.error("Error blocking user", error);
        }
    };

    const openForm = (type = 'tool', item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name, description: item.description, url: item.url || '',
                logo: item.logo, category: item.category,
                prompt: item.prompt || '', promptDescription: item.promptDescription || '',
                type: item.type || 'tool', platform: item.platform || 'Generic', tags: item.tags || []
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '', description: '', url: '', logo: '', category: '',
                prompt: '', promptDescription: '', type: type,
                platform: 'Generic', tags: []
            });
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    // --- Sub-Components for Tab Content ---

    const OverviewTab = () => (
        <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stat-card bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-colors cursor-pointer" onClick={() => setActiveTab('users')}>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Users</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalUsers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={24} />
                    </div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-purple-500 transition-colors cursor-pointer" onClick={() => setActiveTab('tools')}>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Active Tools</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalTools}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Layout size={24} />
                    </div>
                </div>
                <div className="stat-card bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-pink-500 transition-colors cursor-pointer" onClick={() => setActiveTab('prompts')}>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Prompt Library</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.totalPrompts}</h3>
                    </div>
                    <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Image size={24} />
                    </div>
                </div>
            </div>

            {/* Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Manage Prompts</h3>
                        <p className="text-blue-100 mb-6 max-w-sm">Add exciting new prompts to the public library. Curate the best AI generation prompts for users.</p>
                        <button onClick={() => { setActiveTab('prompts'); openForm('prompt'); }} className="glass-panel text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-lg btn btn-primary">
                            Add New Prompt
                        </button>
                    </div>
                    <Image size={200} className="absolute -bottom-10 -right-10 opacity-20 rotate-12" />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-medium">Server Status</span>
                            </div>
                            <span className="text-green-600 font-bold text-sm">Online</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="font-medium">Database</span>
                            </div>
                            <span className="text-blue-600 font-bold text-sm">Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const UsersTab = () => {
        const filteredUsers = users.filter(u =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
                    <div className="search-wrapper-premium">
                        <Search className="search-icon-premium" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input-premium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-table-container">
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-blue-600 text-sm shadow-sm border border-blue-100 dark:border-blue-800">
                                                    {u.username.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{u.username}</p>
                                                    <p className="text-xs text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.role === 'master_admin' ? 'admin' : 'member'}`}>
                                                {u.role === 'master_admin' ? 'Admin' : 'Member'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${u.isBlocked ? 'blocked' : 'active'}`}>
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            {u.role !== 'master_admin' && (
                                                <button onClick={() => toggleBlockUser(u._id)} className={`p-2 rounded-xl transition-all ${u.isBlocked ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-red-600 bg-red-50 hover:bg-red-100'}`} title={u.isBlocked ? "Unblock" : "Block"}>
                                                    {u.isBlocked ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const ItemsTab = ({ type }) => {
        const items = tools.filter(t => (t.type || 'tool') === type);
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return (
            <div className="space-y-6 animate-fade-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{type === 'tool' ? 'AI Tools Registry' : 'Prompt Library'}</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="search-wrapper-premium">
                            <Search className="search-icon-premium" size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${type}s...`}
                                className="search-input-premium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => openForm(type)} className="bg-blue-600 text-white shadow-lg shadow-blue-500/30 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                            <Plus size={18} /> Add New {type === 'tool' ? 'Tool' : 'Prompt'}
                        </button>
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            {searchTerm ? <Search size={32} /> : <Plus size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {searchTerm ? "No results found" : `No ${type}s found`}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {searchTerm ? `We couldn't find any ${type} matching "${searchTerm}"` : `Get started by adding your first ${type} to the collection.`}
                        </p>
                        {!searchTerm && <button onClick={() => openForm(type)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-xl">Add {type}</button>}
                    </div>
                ) : (
                    <div className={type === 'prompt' ? 'prompts-grid' : 'tool-grid-premium'}>
                        {filteredItems.map(item => (
                            type === 'prompt' ? (
                                // Prompt Card - Public Library Style
                                <article key={item._id} className="prompt-card">
                                    <div className="prompt-image-wrap">
                                        {item.logo ? (
                                            <img src={item.logo} alt={item.name} className="prompt-image" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600">
                                                <Image size={60} />
                                            </div>
                                        )}
                                        <div className="prompt-overlay" />

                                        {/* Top Row - Title and Platform */}
                                        <div className="prompt-top-row">
                                            <span className="prompt-chip">{item.name || 'Untitled Prompt'}</span>
                                            <div className="prompt-top-row-actions">
                                                {item.platform && (
                                                    <span className="prompt-chip prompt-chip--platform">
                                                        {item.platform}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Body - Prompt Text and Actions */}
                                        <div className="prompt-body">
                                            {item.prompt && (
                                                <p className="prompt-text">
                                                    Prompt: {item.prompt.length > 100 ? item.prompt.substring(0, 100) + '...' : item.prompt}
                                                </p>
                                            )}
                                            <div className="prompt-footer">
                                                <button
                                                    onClick={() => openForm(type, item)}
                                                    className="prompt-copy-btn"
                                                    style={{ flex: '0 1 auto' }}
                                                >
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                                {item.category && (
                                                    <span className="prompt-meta-tag">{item.category}</span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="prompt-icon-btn"
                                                    style={{ background: 'rgba(239, 68, 68, 0.9)' }}
                                                    title="Delete Prompt"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ) : (
                                // Tool Card - Original design
                                <div key={item._id} className="tool-admin-card group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                                            <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{item.category}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
                                        {item.description}
                                    </p>

                                    <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                        <button onClick={() => openForm(type, item)} className="tool-btn edit flex items-center justify-center gap-2">
                                            <Edit2 size={14} /> <span>Edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="tool-btn delete flex items-center justify-center gap-2">
                                            <Trash2 size={14} /> <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Overlay for Mobile */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />

            {/* Mobile Header */}
            <div className="mobile-header">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <MoreVertical size={24} className="rotate-90 text-slate-600 dark:text-slate-300" />
                </button>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">Admin Dashboard</h2>
                <Link to="/dashboard" className="dashboard-link">
                    Dashboard
                </Link>
            </div>

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="mb-6">
                        <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Console</h1>
                        <p className="text-xs text-slate-400 mt-1">Master Control Panel</p>
                    </div>

                    <nav className="flex-1 space-y-1">
                        <SidebarItem id="overview" label="Overview" icon={Layout} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
                        <SidebarItem id="users" label="User Management" icon={Users} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
                        <SidebarItem id="tools" label="AI Tools" icon={Filter} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
                        <SidebarItem id="prompts" label="Prompt Library" icon={Image} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
                    </nav>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 logout-btn">
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="min-w-0">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'tools' && <ItemsTab type="tool" />}
                    {activeTab === 'prompts' && <ItemsTab type="prompt" />}
                </main>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="prompt-modal-backdrop" onClick={closeForm}>
                    <div className="prompt-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '48rem' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingItem ? `Edit ${formData.type === 'tool' ? 'Tool' : 'Prompt'}` : `Add New ${formData.type === 'tool' ? 'Tool' : 'Prompt'}`}
                            </h2>
                            <button onClick={closeForm} className="btn-close" type="button">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>

                            {/* --- ISOLATED FORM FOR PROMPTS --- */}
                            {formData.type === 'prompt' ? (
                                <div className="space-y-6">
                                    {/* Image Upload (Center Stage) */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className={`image-upload-area group ${formData.logo ? 'has-image' : ''}`}>
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                                    <Image size={48} className="mb-3 opacity-50" />
                                                    <span className="text-sm font-bold">Upload Result Image</span>
                                                    <span className="text-xs opacity-75 mt-1">Click or drag to upload</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f = e.target.files && e.target.files[0];
                                                    if (f) handleLogoFile(f);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                required={!formData.logo}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 text-center">
                                            {formData.logo ? 'Click to change image' : 'Supports JPG, PNG, WebP (Max 5MB)'}
                                        </p>
                                    </div>

                                    <div className="form-grid">
                                        <div>
                                            <label className="label-premium">Title / Name</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                placeholder="e.g. Cyberpunk City"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label-premium">AI Model</label>
                                            <select
                                                className="input-premium"
                                                value={formData.platform}
                                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                            >
                                                <option value="Midjourney">Midjourney</option>
                                                <option value="DALL-E">DALL-E</option>
                                                <option value="Stable Diffusion">Stable Diffusion</option>
                                                <option value="Leonardo AI">Leonardo AI</option>
                                                <option value="Bing Image Creator">Bing Image Creator</option>
                                                <option value="Adobe Firefly">Adobe Firefly</option>
                                                <option value="Generic">Generic</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-premium">Prompt Details</label>
                                        <textarea
                                            className="input-premium font-mono text-sm leading-relaxed"
                                            rows="4"
                                            placeholder="Enter the exact prompt used..."
                                            value={formData.prompt}
                                            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label-premium">Tags</label>
                                        <input
                                            type="text"
                                            className="input-premium"
                                            placeholder="3d, character, lighting (comma separated)"
                                            value={formData.tags.join(', ')}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* --- STANDARD FORM FOR TOOLS --- */
                                <div className="space-y-6">
                                    <div className="form-grid">
                                        <div>
                                            <label className="label-premium">Name</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label-premium">Category</label>
                                            <input
                                                type="text"
                                                className="input-premium"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-premium">Description</label>
                                        <textarea
                                            className="input-premium"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label-premium">Tool URL</label>
                                        <input
                                            type="url"
                                            className="input-premium"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label-premium">Logo</label>
                                        <div className="space-y-3">
                                            {/* Preview & Actions */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                                                    {formData.logo ? (
                                                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Image size={32} className="text-slate-600" />
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2 flex-1">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!formData.url) return alert("Please enter a Tool URL first");
                                                                try {
                                                                    const urlObj = new URL(formData.url);
                                                                    const domain = urlObj.hostname;
                                                                    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                                                                    setFormData({ ...formData, logo: faviconUrl });
                                                                } catch (e) {
                                                                    alert("Invalid URL format");
                                                                }
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 rounded-lg text-xs font-bold transition-colors border border-blue-600/20"
                                                        >
                                                            <Globe size={14} /> Fetch from URL
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!formData.name) return alert("Please enter a Name first");
                                                                const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                                                const avatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128&bold=true`;
                                                                setFormData({ ...formData, logo: avatarUrl });
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-500 rounded-lg text-xs font-bold transition-colors border border-purple-600/20"
                                                        >
                                                            <Wand2 size={14} /> Generate Custom
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500">
                                                        Auto-fetch gets the favicon from the website URL. Generate creates an initial-based avatar.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* URL Input */}
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    className="input-premium pl-10"
                                                    value={formData.logo}
                                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                                    placeholder="https://example.com/logo.png"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                    <Image size={16} />
                                                </div>
                                            </div>

                                            {/* File Upload Fallback */}
                                            <div className="relative group">
                                                <button type="button" className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors">
                                                    Or upload a file from computer
                                                </button>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const f = e.target.files && e.target.files[0];
                                                        if (f) handleLogoFile(f);
                                                    }}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="form-submit-buttons">
                                <button type="button" onClick={closeForm} className="btn-submit btn-submit-secondary">
                                    <XCircle size={18} />
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit btn-submit-primary">
                                    <CheckCircle size={18} />
                                    {editingItem ? 'Update' : 'Create'} {formData.type === 'tool' ? 'Tool' : 'Prompt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterAdminDashboard;
