import React, { useState, useEffect, useContext } from 'react';
import { Shield, Save, AlertCircle, CheckCircle, Settings as SettingsIcon, Layout, MessageCircle, Gift, Link2, Bell, Navigation, MousePointerClick, Users, Eye, EyeOff } from 'lucide-react';
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
        userHeroButtonsEnabled: true
    });



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
            setFeatures(data.features);
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

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await axios.put(
                `${API_URL}/admin/settings`,
                { features },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <SettingsIcon size={24} className="text-blue-600" />
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Ready to apply changes?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">All changes will take effect immediately</p>
                        </div>
                    </div>
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {saving ? 'Saving Changes...' : 'Save All Changes'}
                    </button>
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
