import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Users, Layout, Image } from 'lucide-react';

const MasterAdminDashboard = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [tools, setTools] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // Moved up
    const [filterType, setFilterType] = useState('tool'); // Moved up
    const [editingTool, setEditingTool] = useState(null); // Moved up
    const [toolForm, setToolForm] = useState({
        name: '', description: '', url: '', logo: '', category: '', prompt: '', promptDescription: '', type: 'tool'
    }); // Moved up

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.role === 'master_admin') {
                try {
                    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                    const usersRes = await axios.get(`${API_URL}/user-manage`, config);
                    const toolsRes = await axios.get(`${API_URL}/tools/admin`, config);
                    setUsers(usersRes.data);
                    setTools(toolsRes.data);
                } catch (error) {
                    console.error('Error fetching admin data', error);
                }
            }
        };
        fetchData();
    }, [API_URL, user]);

    // Redirect if not master admin
    if (user && user.role !== 'master_admin') {
        return <div className="text-center text-danger p-10">Access Denied</div>;
    }

    const resetForm = () => {
        setEditingTool(null);
        setToolForm({ name: '', description: '', url: '', logo: '', category: '', prompt: '', promptDescription: '', type: filterType });
    };

    const handleToolSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

            if (editingTool) {
                const res = await axios.put(`${API_URL}/tools/${editingTool._id}`, toolForm, config);
                setTools(tools.map(t => t._id === editingTool._id ? res.data : t));
            } else {
                const res = await axios.post(`${API_URL}/tools`, toolForm, config);
                setTools([...tools, res.data]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving tool', error);
            alert('Failed to save tool');
        }
    };

    const editTool = (tool) => {
        setEditingTool(tool);
        setToolForm({
            name: tool.name,
            description: tool.description,
            url: tool.url,
            logo: tool.logo,
            category: tool.category,
            prompt: tool.prompt || '',
            promptDescription: tool.promptDescription || '',
            type: tool.type || 'tool'
        });
    };

    const deleteTool = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tool?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.delete(`${API_URL}/tools/${id}`, config);
            setTools(tools.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting tool', error);
        }
    };

    const toggleBlockUser = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/user-manage/${id}/block`, {}, config);
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (error) {
            console.error('Error blocking user', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Stats */}
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-6">Master Control</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                                <Layout size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Tools</p>
                                <p className="text-2xl font-bold">{tools.filter(t => (t.type || 'tool') === 'tool').length}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-xl">
                                <Image size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Prompts</p>
                                <p className="text-2xl font-bold">{tools.filter(t => t.type === 'prompt').length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        User Registry
                        {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`pb-4 px-2 font-medium text-sm transition-colors relative ${activeTab === 'tools' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Directory Manager
                        {activeTab === 'tools' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>}
                    </button>
                </div>

                {/* USER MANAGEMENT */}
                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">User</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Email</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Role</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{u.username}</td>
                                            <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'master_admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                                                    {u.role === 'master_admin' ? 'Admin' : 'Member'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {u.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role !== 'master_admin' && (
                                                    <button
                                                        onClick={() => toggleBlockUser(u._id)}
                                                        className={`font-medium text-xs px-3 py-1.5 rounded-lg transition-colors ${u.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                    >
                                                        {u.isBlocked ? 'Unblock Access' : 'Block Access'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TOOL MANAGEMENT */}
                {activeTab === 'tools' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-10">
                                <h3 className="font-bold text-lg mb-6">{editingTool ? 'Edit Item' : 'Add New Item'}</h3>
                                <form onSubmit={handleToolSubmit} className="space-y-4">
                                    <div className="form-group">
                                        <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Type</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={toolForm.type} onChange={e => setToolForm({ ...toolForm, type: e.target.value })}
                                        >
                                            <option value="tool">AI Tool</option>
                                            <option value="prompt">Image Prompt</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Name</label>
                                        <input
                                            type="text" placeholder="e.g. Midjourney"
                                            value={toolForm.name} onChange={e => setToolForm({ ...toolForm, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Category</label>
                                            <input
                                                type="text" placeholder="e.g. Image Gen"
                                                value={toolForm.category} onChange={e => setToolForm({ ...toolForm, category: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Logo URL</label>
                                            <input
                                                type="url" placeholder="https://..."
                                                value={toolForm.logo} onChange={e => setToolForm({ ...toolForm, logo: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required
                                            />
                                        </div>
                                    </div>

                                    {toolForm.type === 'tool' && (
                                        <div className="form-group">
                                            <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Website URL</label>
                                            <input
                                                type="url" placeholder="https://..."
                                                value={toolForm.url} onChange={e => setToolForm({ ...toolForm, url: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="text-xs font-semibold uppercase text-slate-400 mb-1 block">Description</label>
                                        <textarea
                                            placeholder="Short description..."
                                            value={toolForm.description} onChange={e => setToolForm({ ...toolForm, description: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" required
                                        />
                                    </div>

                                    {toolForm.type === 'prompt' && (
                                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                            <h4 className="font-semibold mb-2 text-xs text-slate-500 uppercase tracking-wide">AI Prompt Config</h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="text" placeholder="Prompt Label (e.g. 'Realistic Portrait')"
                                                    value={toolForm.promptDescription} onChange={e => setToolForm({ ...toolForm, promptDescription: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                />
                                                <textarea
                                                    placeholder="The actual prompt text..."
                                                    value={toolForm.prompt} onChange={e => setToolForm({ ...toolForm, prompt: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none">
                                            {editingTool ? 'Update' : 'Add New'}
                                        </button>
                                        {editingTool && (
                                            <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-2">
                                    <button onClick={() => setFilterType('tool')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'tool' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        AI Tools
                                    </button>
                                    <button onClick={() => setFilterType('prompt')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'prompt' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        Prompts
                                    </button>
                                </div>
                                <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[800px]">
                                    {tools.filter(t => (t.type || 'tool') === filterType).length === 0 && (
                                        <div className="text-center py-20 text-slate-400">
                                            No items found. Add one on the left.
                                        </div>
                                    )}
                                    {tools.filter(t => (t.type || 'tool') === filterType).map(tool => (
                                        <div key={tool._id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-blue-200 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <img src={tool.logo} className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm" alt={tool.name} />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{tool.name}</h4>
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">{tool.category}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => editTool(tool)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteTool(tool._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterAdminDashboard;
