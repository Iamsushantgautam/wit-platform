import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Layout, Image, Plus, Search, Filter, Trash2, Edit2, CheckCircle, XCircle, MoreVertical, LogOut, Settings, Gift } from 'lucide-react';
import '../styles/Admin.css';
import AdminPanel from '../components/user/AdminPanel';
import ToolCard from '../components/blocks/ToolCard';
import PromptCard from '../components/blocks/PromptCard';

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
    const [offers, setOffers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ totalUsers: 0, totalTools: 0, totalPrompts: 0 });

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', url: '', logo: '', category: '',
        prompt: '', promptDescription: '', type: 'tool',
        platform: 'Generic', tags: [],
        code: '', discount: '', expires: '', isActive: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                const [usersRes, toolsRes, offersRes] = await Promise.all([
                    axios.get(`${API_URL}/user-manage`, config),
                    axios.get(`${API_URL}/tools`),
                    axios.get(`${API_URL}/offers/admin`, config)
                ]);
                setUsers(usersRes.data);
                setTools(toolsRes.data);
                setOffers(offersRes.data);

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

        // OFFER SUBMISSION
        if (formData.type === 'offer') {
            const payload = {
                title: formData.name,
                description: formData.description,
                code: formData.code,
                discount: formData.discount,
                expires: formData.expires,
                image: formData.logo,
                tag: formData.category, // Use category field for tag
                isActive: formData.isActive
            };

            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                if (editingItem) {
                    const res = await axios.put(`${API_URL}/offers/${editingItem._id}`, payload, config);
                    setOffers(offers.map(o => o._id === editingItem._id ? res.data : o));
                } else {
                    const res = await axios.post(`${API_URL}/offers`, payload, config);
                    setOffers([res.data, ...offers]);
                }
                closeForm();
            } catch (error) {
                console.error("Error saving offer", error);
                alert('Failed to save offer');
            }
            return;
        }

        // TOOL/PROMPT SUBMISSION
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
        // Determine context
        let context = 'tool';
        if (formData.type === 'offer') context = 'offer';
        else if (formData.type === 'prompt') context = 'prompt';

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post(`${API_URL}/upload?context=${context}`, form, config);
            // API returns the uploaded image path/url
            setFormData(prev => ({ ...prev, logo: res.data }));
        } catch (err) {
            console.error('Upload failed', err);
            alert('Image upload failed. See console.');
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Delete this item permanently?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (type === 'offer') {
                await axios.delete(`${API_URL}/offers/${id}`, config);
                setOffers(offers.filter(o => o._id !== id));
            } else {
                await axios.delete(`${API_URL}/tools/${id}`, config);
                setTools(tools.filter(t => t._id !== id));
            }
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
            if (type === 'offer') {
                setFormData({
                    name: item.title, description: item.description, url: item.link || '',
                    logo: item.image, category: item.tag || '',
                    code: item.code || '', discount: item.discount || '',
                    expires: item.expires || '', isActive: item.isActive,
                    prompt: '', promptDescription: '', type: 'offer', platform: 'Generic', tags: []
                });
            } else {
                setFormData({
                    name: item.name, description: item.description, url: item.url || '',
                    logo: item.logo, category: item.category,
                    prompt: item.prompt || '', promptDescription: item.promptDescription || '',
                    type: item.type || 'tool', platform: item.platform || 'Generic', tags: item.tags || [],
                    code: '', discount: '', expires: '', isActive: true
                });
            }
        } else {
            setEditingItem(null);
            setFormData({
                name: '', description: '', url: '', logo: '', category: '',
                prompt: '', promptDescription: '', type: type,
                platform: 'Generic', tags: [],
                code: '', discount: '', expires: '', isActive: true
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">System Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div onClick={() => setActiveTab('users')} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</h3>
                </div>

                <div onClick={() => setActiveTab('tools')} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-pointer transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Layout size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tools</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalTools}</h3>
                </div>

                <div onClick={() => setActiveTab('prompts')} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-pink-500 cursor-pointer transition-all shadow-sm group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Image size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Library</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalPrompts}</h3>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Stats</h3>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-300">System Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Database Connected</span>
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
                            type === 'tool' ? (
                                <ToolCard
                                    key={item._id}
                                    tool={item}
                                    type="public"
                                    onEdit={() => openForm(type, item)}
                                    onRemove={() => handleDelete(item._id)}
                                />
                            ) : (
                                <PromptCard
                                    key={item._id}
                                    prompt={item}
                                    type="public"
                                    onEdit={() => openForm(type, item)}
                                    onRemove={() => handleDelete(item._id)}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const OffersTab = () => {
        const filteredOffers = offers.filter(o =>
            (o.title && o.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.description && o.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return (
            <div className="space-y-6 animate-fade-up">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Offers</h2>
                    <button onClick={() => openForm('offer')} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                        <Plus size={18} /> Add Offer
                    </button>
                </div>

                <div className="tool-grid-premium">
                    {filteredOffers.map(offer => (
                        <div key={offer._id} className="tool-admin-card group">
                            {offer.image && (
                                <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate flex-1 pr-2">{offer.title}</h3>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${offer.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600'}`}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 truncate">{offer.description}</p>
                            <div className="flex gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded mb-4">
                                <span className="font-bold">{offer.code || 'NO CODE'}</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-blue-500">{offer.discount}</span>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button onClick={() => openForm('offer', offer)} className="tool-btn edit flex items-center justify-center gap-2 flex-1">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleDelete(offer._id, 'offer')} className="tool-btn delete flex items-center justify-center gap-2 flex-1">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
                        <SidebarItem id="offers" label="Manage Offers" icon={Gift} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
                        <SidebarItem id="settings" label="Feature Controls" icon={Settings} activeTab={activeTab} setActiveTab={(id) => { setActiveTab(id); setIsSidebarOpen(false); }} />
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
                    {activeTab === 'offers' && <OffersTab />}
                    {activeTab === 'settings' && <AdminPanel />}
                </main>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4">
                        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? `Edit ${formData.type === 'tool' ? 'Tool' : 'Prompt'}` : `Add New ${formData.type === 'tool' ? 'Tool' : 'Prompt'}`}
                            </h2>
                            <button onClick={closeForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <XCircle size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">

                            {/* --- ISOATED FORM FOR PROMPTS --- */}
                            {formData.type === 'prompt' ? (
                                <div className="space-y-6">
                                    {/* Image Upload (Center Stage) */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative group w-full max-w-sm aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors">
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                                    <Image size={48} className="mb-2 opacity-50" />
                                                    <span className="text-sm font-bold">Upload Result Image (Required)</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f = e.target.files && e.target.files[0];
                                                    if (f) handleLogoFile(f);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-[100px] h-[100px] z-10 object-cover"
                                                required={!formData.logo}
                                            />
                                            {/* Loading State Overlay */}
                                            {/* You might want to add a loading state here if upload is slow */}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Click to upload the generated image</p>
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
                            ) : formData.type === 'offer' ? (
                                /* --- OFFER FORM --- */
                                <div className="space-y-6">
                                    {/* Image Upload for Offer */}
                                    <div className="flex flex-col items-center justify-center">
                                        <span className="mb-2 text-sm font-bold text-slate-500 uppercase tracking-wider">Offer Banner</span>
                                        <div className="relative group w-full aspect-[2/1] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer">
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                    <Image size={32} className="mb-2 opacity-50" />
                                                    <span className="text-xs font-bold">Upload Image</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleLogoFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer w-[100px] h-[100px] z-10" />
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div>
                                            <label className="label-premium">Title</label>
                                            <input type="text" className="input-premium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="label-premium">Tag/Label</label>
                                            <input type="text" className="input-premium" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Hot Deal" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label-premium">Description</label>
                                        <textarea className="input-premium" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                    </div>

                                    <div className="form-grid">
                                        <div>
                                            <label className="label-premium">Promo Code</label>
                                            <input type="text" className="input-premium font-mono" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="Leave empty if none" />
                                        </div>
                                        <div>
                                            <label className="label-premium">Discount</label>
                                            <input type="text" className="input-premium" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} placeholder="e.g. 50% OFF" />
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div>
                                            <label className="label-premium">Expires</label>
                                            <input type="text" className="input-premium" value={formData.expires} onChange={e => setFormData({ ...formData, expires: e.target.value })} placeholder="e.g. Dec 31 or Limited Time" />
                                        </div>
                                        <div>
                                            <label className="label-premium">Status</label>
                                            <select className="input-premium" value={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}>
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
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
                                        <label className="label-premium">Logo URL</label>
                                        <div className="file-input-row">
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="url"
                                                    className="input-premium"
                                                    value={formData.logo}
                                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                                    placeholder="https://example.com/logo.png"
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
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
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
