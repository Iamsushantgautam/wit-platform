import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Layout, Image, Plus, Search, Filter, Trash2, Edit2, CheckCircle, XCircle, MoreVertical, LogOut } from 'lucide-react';
import '../styles/Admin.css';

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
    const handleSave = async (e) => {
        e.preventDefault();
        // Basic front-end validation
        if (!formData.name || formData.name.trim() === '') {
            return alert('Name is required.');
        }
        if (formData.type === 'tool' && !formData.url && !formData.logo) {
            return alert('Provide a tool URL or upload a logo image.');
        }
        if (formData.type === 'prompt' && (!formData.prompt || formData.prompt.trim() === '')) {
            return alert('Prompt text is required.');
        }

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (editingItem) {
                const res = await axios.put(`${API_URL}/tools/${editingItem._id}`, formData, config);
                setTools(tools.map(t => t._id === editingItem._id ? res.data : t));
            } else {
                const res = await axios.post(`${API_URL}/tools`, formData, config);
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
                        <button onClick={() => { setActiveTab('prompts'); openForm('prompt'); }} className="glass-panel text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-lg">
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
                    <div className="tool-grid-premium">
                        {filteredItems.map(item => (
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

                                {type === 'prompt' && (
                                    <div className="mb-4 space-y-3">
                                        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 text-xs font-mono text-slate-500 dark:text-slate-400 line-clamp-2 border border-slate-100 dark:border-slate-800 italic">
                                            "{item.prompt}"
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                            {(item.tags || []).map((tag, i) => (
                                                <span key={i} className="whitespace-nowrap text-[10px] px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md font-bold border border-blue-100 dark:border-blue-900/30">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <button onClick={() => openForm(type, item)} className="tool-btn edit flex items-center justify-center gap-2">
                                        <Edit2 size={14} /> <span>Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="tool-btn delete flex items-center justify-center gap-2">
                                        <Trash2 size={14} /> <span>Delete</span>
                                    </button>
                                </div>
                            </div>
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4">
                        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? `Edit ${formData.type}` : `Add New ${formData.type}`}
                            </h2>
                            <button onClick={closeForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <XCircle size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
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

                            {formData.type === 'tool' && (
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
                            )}

                            <div>
                                <label className="label-premium">Logo URL</label>
                                <div className="file-input-row">
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="url"
                                            className="input-premium"
                                            value={formData.logo}
                                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                            placeholder="https://example.com/logo.png or upload below"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files && e.target.files[0];
                                                if (f) handleLogoFile(f);
                                            }}
                                            style={{ marginTop: '0.5rem' }}
                                        />
                                    </div>
                                    <div className="file-preview" aria-hidden>
                                        {formData.logo ? <img src={formData.logo} alt="preview" /> : <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: 6 }}>No image</div>}
                                    </div>
                                </div>
                            </div>

                            {formData.type === 'prompt' && (
                                <>
                                    <div>
                                        <label className="label-premium">Platform Model</label>
                                        <select
                                            className="input-premium"
                                            value={formData.platform}
                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                        >
                                            <option value="Generic">Generic</option>
                                            <option value="ChatGPT">ChatGPT</option>
                                            <option value="Claude">Claude</option>
                                            <option value="Gemini">Gemini</option>
                                            <option value="Midjourney">Midjourney</option>
                                            <option value="DALL-E">DALL-E</option>
                                            <option value="Stable Diffusion">Stable Diffusion</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="label-premium">Prompt</label>
                                        <textarea
                                            className="input-premium"
                                            rows="4"
                                            value={formData.prompt}
                                            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label-premium">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            className="input-premium"
                                            value={formData.tags.join(', ')}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                            placeholder="creative, art, design"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingItem ? 'Update' : 'Create'} {formData.type}
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
