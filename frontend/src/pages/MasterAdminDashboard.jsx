import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const MasterAdminDashboard = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [tools, setTools] = useState([]);

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
        <div className="container dashboard-container">
            <h1 className="page-title mb-8">Master Admin Panel</h1>

            <div className="mb-8">
                <h2 className="section-title-sm mb-4">Users</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <span className={`status-badge ${u.isBlocked ? 'blocked' : 'active'}`}>
                                            {u.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'master_admin' && (
                                            <button
                                                onClick={() => toggleBlockUser(u._id)}
                                                className={`btn btn-sm ${u.isBlocked ? 'btn-success' : 'btn-danger'}`}
                                            >
                                                {u.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="section-title-sm mb-4">AI Tools</h2>
                <p className="mb-4 text-secondary">Tool management UI would go here (Add/Edit/Delete).</p>
                <div className="card">
                    <ul className="tool-list">
                        {tools.map(tool => (
                            <li key={tool._id} className="tool-list-item">
                                <div className="flex items-center gap-2">
                                    <img src={tool.logo} className="tool-list-logo" alt={tool.name} />
                                    <span className="font-bold">{tool.name}</span>
                                </div>
                                <span className="text-secondary">{tool.category}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MasterAdminDashboard;
