import React, { useState, useEffect, useContext } from 'react';
import { Shield, Save, AlertCircle, CheckCircle, Settings as SettingsIcon, Layout, MessageCircle, Gift, Link2, Bell, Navigation, MousePointerClick, Users, Eye, EyeOff, Globe } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const AdminPanel = () => {
    const { user, API_URL } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [features, setFeatures] = useState({
        userToolsEnabled: true,
        userPromptsEnabled: true,
        userOffersEnabled: true,
        userLinksEnabled: true,
        userUpdatesEnabled: true,
        userNavigationEnabled: true,
        userBottomNavEnabled: true,
        userHeroButtonsEnabled: true,
        userPublicBranding: true,
        globalLibraryEnabled: true,
        globalLibraryPublicEnabled: true
    });
    const [siteName, setSiteName] = useState('WitHub');
    const [siteLogo, setSiteLogo] = useState('');
    const [siteFavicon, setSiteFavicon] = useState('');
    const [publicProfileLogoSource, setPublicProfileLogoSource] = useState('site_logo');
    const [customPublicLogo, setCustomPublicLogo] = useState('');
    const [uploadingImage, setUploadingImage] = useState(null);

    const featuresList = [
        {
            key: 'userToolsEnabled',
            label: 'AI Tools Stack',
            description: 'Let users showcase their favorite AI tools',
            icon: Layout,
            color: 'blue',
            impact: 'Dashboard & Public Profile'
        },
        {
            key: 'userPromptsEnabled',
            label: 'Prompts Library',
            description: 'Enable custom and curated prompts management',
            icon: MessageCircle,
            color: 'purple',
            impact: 'Dashboard & Public Profile'
        },
        {
            key: 'userOffersEnabled',
            label: 'Offers & Banners',
            description: 'Allow promotional content and special offers',
            icon: Gift,
            color: 'pink',
            impact: 'Dashboard & Public Profile'
        },
        {
            key: 'userLinksEnabled',
            label: 'Important Links',
            description: 'Enable custom link collections',
            icon: Link2,
            color: 'green',
            impact: 'Dashboard & Public Profile'
        },
        {
            key: 'userUpdatesEnabled',
            label: 'Updates & News',
            description: 'Allow users to post updates and announcements',
            icon: Bell,
            color: 'orange',
            impact: 'Dashboard & Public Profile'
        },
        {
            key: 'userNavigationEnabled',
            label: 'Navigation Customization',
            description: 'Allow users to customize their navigation menu',
            icon: SettingsIcon,
            color: 'indigo',
            impact: 'Dashboard Only'
        },
        {
            key: 'userBottomNavEnabled',
            label: 'Bottom Navigation Bar',
            description: 'Show/Hide the bottom navigation bar on mobile',
            icon: Navigation,
            color: 'cyan',
            impact: 'Public Profile Only'
        },
        {
            key: 'userHeroButtonsEnabled',
            label: 'Hero Buttons',
            description: 'Customize hero section call-to-action buttons',
            icon: MousePointerClick,
            color: 'cyan',
            impact: 'Dashboard Only'
        },
        {
            key: 'userPublicBranding',
            label: 'Public Profile Branding',
            description: 'Enable "WitHub" logo on public profiles. Users cannot disable this.',
            icon: Shield,
            color: 'red',
            impact: 'Public Profile Only'
        },
        {
            key: 'globalLibraryEnabled',
            label: 'Global Prompts (Library)',
            description: 'Disable this to stop showing website prompts in user dashboard',
            icon: Globe,
            color: 'blue',
            impact: 'Dashboard Only'
        },
        {
            key: 'globalLibraryPublicEnabled',
            label: 'Global Prompts (Public Profile)',
            description: 'Disable this to hide website collection from public profiles',
            icon: Eye,
            color: 'purple',
            impact: 'Public Profile Only'
        }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/admin/settings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Merge defaults with fetched data
            setFeatures(prev => ({ ...prev, ...(data.features || {}) }));

            setSiteName(data.siteName || 'WitHub');
            setSiteLogo(data.siteLogo || '');
            setSiteFavicon(data.siteFavicon || '');
            setPublicProfileLogoSource(data.publicProfileLogoSource || 'site_logo');
            setCustomPublicLogo(data.customPublicLogo || '');

        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to load settings'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (featureName) => {
        setFeatures(prev => ({
            ...prev,
            [featureName]: !prev[featureName]
        }));
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        // Map types to proper item name
        let itemName = `platform_${type}`;
        if (type === 'custom') itemName = 'platform_custom_logo';

        setUploadingImage(type);

        try {
            const res = await axios.post(`${API_URL}/upload?context=tool&itemName=${itemName}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (type === 'logo') setSiteLogo(res.data);
            if (type === 'favicon') setSiteFavicon(res.data);
            if (type === 'custom') setCustomPublicLogo(res.data);

            setMessage({ type: 'success', text: `${type === 'custom' ? 'Custom Logo' : type === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully` });
        } catch (err) {
            console.error('Upload failed', err);
            setMessage({ type: 'error', text: 'Upload failed: ' + (err.response?.data?.message || err.message) });
        } finally {
            setUploadingImage(null);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await axios.put(
                `${API_URL}/admin/settings`,
                { features, siteName, siteLogo, siteFavicon, publicProfileLogoSource, customPublicLogo },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            // Reload page to reflect changes globally? Or just update context if we had one for settings.
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save settings'
            });
        } finally {
            setSaving(false);
        }
    };

    // Check if user is admin
    if (user?.role !== 'master_admin') {
        return (
            <div className="p-10 text-center">
                <Shield className="mx-auto mb-4 text-red-500" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Access Denied
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    You don't have permission to access the admin panel.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status"></div>
                <p className="mt-4 text-gray-500">Loading admin settings...</p>
            </div>
        );
    }





    const enabledCount = Object.values(features).filter(Boolean).length;
    const totalCount = Object.keys(features).length;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            {/* Header */}
            <div className="feature-control-header animate-fade-up">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield size={36} className="text-white opacity-90" />
                        <h1>Feature Center</h1>
                    </div>
                    <p>
                        Control platform capabilities in real-time. Changes affect all user dashboards and public profiles immediately.
                    </p>
                </div>
                <div className="feature-stats-badge">
                    <div className="text-3xl font-black">{enabledCount}/{totalCount}</div>
                    <div className="text-sm opacity-80 font-medium">Active Features</div>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shadow-lg ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    <span className="font-bold text-lg flex-1">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="text-2xl opacity-70 hover:opacity-100 transition-opacity">&times;</button>
                </div>
            )}

            {/* Branding Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Branding</h2>
                        <p className="text-sm text-gray-500">Customize the identity of your platform globally</p>
                    </div>
                </div>

                <div className="admin-branding-grid">
                    <div className="admin-input-group">
                        <label className="admin-label">
                            Website Name
                        </label>
                        <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className="admin-text-input"
                            placeholder="e.g. WitHub"
                        />
                        <p className="admin-helper-text">Appears in browser titles, headers, and footer.</p>
                    </div>

                    <div className="admin-input-group">
                        <label className="admin-label">
                            Website Logo
                        </label>
                        <div className="admin-upload-row">
                            <div className="admin-upload-preview group">
                                {uploadingImage === 'logo' && (
                                    <div className="admin-upload-loading">
                                        <div className="admin-spinner"></div>
                                    </div>
                                )}
                                {siteLogo ? (
                                    <>
                                        <img src={siteLogo} alt="Logo" />
                                        <button
                                            onClick={() => setSiteLogo('')}
                                            className="admin-remove-btn group-hover:opacity-100"
                                            title="Remove Logo"
                                        >
                                            &times;
                                        </button>
                                    </>
                                ) : (
                                    <Shield size={24} className="text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="admin-upload-btn">
                                    <Layout size={16} />
                                    Choose
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingImage === 'logo'}
                                        onChange={(e) => handleImageUpload(e, 'logo')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="admin-input-group">
                        <label className="admin-label">
                            Website Favicon
                        </label>
                        <div className="admin-upload-row">
                            <div className="admin-upload-preview group">
                                {uploadingImage === 'favicon' && (
                                    <div className="admin-upload-loading">
                                        <div className="admin-spinner"></div>
                                    </div>
                                )}
                                {siteFavicon ? (
                                    <>
                                        <img src={siteFavicon} alt="Favicon" />
                                        <button
                                            onClick={() => setSiteFavicon('')}
                                            className="admin-remove-btn group-hover:opacity-100"
                                            title="Remove Favicon"
                                        >
                                            &times;
                                        </button>
                                    </>
                                ) : (
                                    <Globe size={24} className="text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="admin-upload-btn">
                                    <Layout size={16} />
                                    Choose
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingImage === 'favicon'}
                                        onChange={(e) => handleImageUpload(e, 'favicon')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-divider">
                    <label className="admin-label">
                        Public Profile Logo Source
                    </label>
                    <div className="admin-logo-source-grid">
                        <button
                            type="button"
                            onClick={() => setPublicProfileLogoSource('site_logo')}
                            className={`logo-source-btn ${publicProfileLogoSource === 'site_logo' ? 'active' : ''}`}
                        >
                            {siteLogo ? (
                                <img src={siteLogo} alt="Site Logo" className="logo-source-img-preview" />
                            ) : (
                                <Layout size={24} />
                            )}
                            <div>
                                <span>Website Logo</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPublicProfileLogoSource('site_favicon')}
                            className={`logo-source-btn ${publicProfileLogoSource === 'site_favicon' ? 'active' : ''}`}
                        >
                            {siteFavicon ? (
                                <img src={siteFavicon} alt="Favicon" className="logo-source-img-preview" />
                            ) : (
                                <Globe size={24} />
                            )}
                            <div>
                                <span>Website Favicon</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPublicProfileLogoSource('custom_logo')}
                            className={`logo-source-btn ${publicProfileLogoSource === 'custom_logo' ? 'active' : ''}`}
                        >
                            {customPublicLogo ? (
                                <img src={customPublicLogo} alt="Custom" className="logo-source-img-preview" />
                            ) : (
                                <Layout size={24} />
                            )}
                            <div>
                                <span>Custom Upload</span>
                            </div>
                        </button>
                    </div>

                    {/* Custom Logo Upload Area - Show when Custom Logo is selected */}
                    {publicProfileLogoSource === 'custom_logo' && (
                        <div className="custom-logo-dropzone">
                            <label className="dropzone-label">
                                Upload Custom Logo for Public Profiles
                            </label>
                            <div className="dropzone-content">
                                <div className="dropzone-preview group">
                                    {uploadingImage === 'custom' && (
                                        <div className="admin-upload-loading">
                                            <div className="admin-spinner"></div>
                                        </div>
                                    )}
                                    {customPublicLogo ? (
                                        <>
                                            <img src={customPublicLogo} alt="Custom Logo" />
                                            <button
                                                onClick={() => setCustomPublicLogo('')}
                                                className="admin-remove-btn group-hover:opacity-100"
                                            >
                                                &times;
                                            </button>
                                        </>
                                    ) : (
                                        <Layout size={24} className="dropzone-placeholder-icon" />
                                    )}
                                </div>
                                <label className="dropzone-upload-btn">
                                    <Layout size={16} />
                                    Upload Custom Logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingImage === 'custom'}
                                        onChange={(e) => handleImageUpload(e, 'custom')}
                                    />
                                </label>
                            </div>
                            <p className="dropzone-helper-text">This logo will effectively override the site logo on users public profiles.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="feature-grid animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {featuresList.map(({ key, label, description, icon: Icon, color, impact }) => {
                    const isEnabled = features[key];
                    return (
                        <div
                            key={key}
                            className={`feature-card ${!isEnabled ? 'disabled' : ''} group`}
                        >
                            <div className="feature-header">
                                <div className={`feature-icon-box bg-gradient-${color}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full shadow-inner">
                                    {isEnabled ? (
                                        <Eye size={20} className="text-emerald-500" />
                                    ) : (
                                        <EyeOff size={20} className="text-slate-400" />
                                    )}
                                </div>
                            </div>

                            <h3 className="feature-title">{label}</h3>
                            <p className="feature-description">{description}</p>

                            <div className="feature-impact-badge">
                                <Users size={12} />
                                {impact}
                            </div>

                            <div className="feature-toggle-wrapper">
                                <span className={`feature-status-text ${isEnabled ? 'text-enabled' : 'text-disabled'}`}>
                                    {isEnabled ? 'Active' : 'Disabled'}
                                </span>
                                <label className="custom-toggle">
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => handleToggle(key)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save Section */}
            {/* Sticky Save Bar */}
            <div className="admin-save-bar-container">
                <div className="admin-save-bar">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="admin-save-btn"
                        >
                            <Save size={20} />
                            {saving ? 'Saving Changes...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning Info */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-2xl p-6">
                <div className="flex gap-4">
                    <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={24} />
                    <div className="text-amber-800 dark:text-amber-200">
                        <h4 className="font-bold text-lg mb-2">⚠️ Important Notice</h4>
                        <ul className="space-y-2 text-sm leading-relaxed">
                            <li>• <strong>Disabled features</strong> are completely hidden from user dashboards and public profiles</li>
                            <li>• Users <strong>cannot access</strong> disabled sections even via direct URLs</li>
                            <li>• Changes apply <strong>instantly</strong> - users may need to refresh to see updates</li>
                            <li>• Re-enabling a feature <strong>restores full functionality</strong> immediately</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AdminPanel;
