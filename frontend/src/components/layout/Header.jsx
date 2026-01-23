import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { Menu, X, User, LogOut, LayoutDashboard, Settings, Trash2 } from 'lucide-react';

const Header = () => {
    const { user, logout, API_URL } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDrawerOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_URL}/user-manage/profile`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                handleLogout();
            } catch (error) {
                console.error('Error deleting account', error);
                alert('Failed to delete account.');
            }
        }
    };

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <header className="app-header">
            <div className="container" style={{ height: '100%' }}>
                <div className="header-container">
                    {/* Logo */}
                    <div className="logo-container">
                        <Link to="/" className="text-2xl font-bold logo-text text-accent">
                            WitHub
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <ThemeToggle />
                        <Link to="/" className="nav-link">Home</Link>

                        <Link to="/prompts" className="nav-link">Prompts</Link>
                        <Link to="/tools" className="nav-link">AI Tools</Link>
                        {!user ? (
                            <Link to="/login" className="nav-link">Profile</Link>
                        ) : (
                            <Link to="/dashboard" className="nav-link">Profile</Link>
                        )}
                        {!user ? (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-secondary hover-text-primary transition font-medium flex items-center gap-1">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-primary font-medium focus:outline-none">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <span>{user.username}</span>
                                    </button>
                                    {/* Dropdown */}
                                    <div className="nav-dropdown">
                                        <div className="py-2">
                                            <div className="px-3 mb-2">
                                                <div className="public-link-card">
                                                    <span className="public-link-label">Public Profile</span>
                                                    <a
                                                        href={window.location.hostname.includes('localhost')
                                                            ? `http://${user.username}.localhost:5173`
                                                            : `http://${user.username}.${window.location.host}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="public-link-url"
                                                    >
                                                        {user.username}.{window.location.hostname.includes('localhost') ? 'localhost:5173' : window.location.host}
                                                    </a>
                                                </div>
                                            </div>

                                            <Link to="/dashboard" className="dropdown-item">
                                                <Settings size={18} />
                                                <span>Settings</span>
                                            </Link>

                                            <Link to="/dashboard" className="dropdown-item">
                                                <User size={18} />
                                                <span>Edit Profile</span>
                                            </Link>

                                            <button onClick={handleDeleteAccount} className="dropdown-item danger">
                                                <Trash2 size={18} />
                                                <span>Delete Account</span>
                                            </button>

                                            <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                                            <button onClick={handleLogout} className="dropdown-item danger">
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="mobile-menu-btn">
                        <ThemeToggle />
                        <button onClick={toggleDrawer} className="text-secondary hover-text-primary focus:outline-none p-2">
                            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {/* Mobile Drawer */}
            <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-backdrop" onClick={toggleDrawer}></div>
                <div className="drawer-content">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xl font-bold text-primary">Menu</span>
                        <button onClick={toggleDrawer} className="text-secondary"><X size={24} /></button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <Link to="/" onClick={toggleDrawer} className="nav-link block">Home</Link>

                        <Link to="/prompts" onClick={toggleDrawer} className="nav-link block">Prompts</Link>
                        <Link to="/tools" onClick={toggleDrawer} className="nav-link block">AI Tools</Link>
                        {!user ? (
                            <Link to="/login" onClick={toggleDrawer} className="nav-link block">Profile</Link>
                        ) : (
                            <Link to="/dashboard" onClick={toggleDrawer} className="nav-link block">Profile</Link>
                        )}
                        {!user ? (
                            <>
                                <Link to="/login" onClick={toggleDrawer} className="nav-link block">Login</Link>
                                <Link to="/register" onClick={toggleDrawer} className="btn btn-primary w-full text-center">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" onClick={toggleDrawer} className="nav-link flex items-center gap-2">
                                    <LayoutDashboard size={20} /> Dashboard
                                </Link>
                                <Link to={`/u/${user.username}`} onClick={toggleDrawer} className="nav-link flex items-center gap-2">
                                    <User size={20} /> My Profile
                                </Link>
                                <button onClick={handleLogout} className="text-lg text-left text-danger font-medium flex items-center gap-2 mt-4">
                                    <LogOut size={20} /> Logout
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
