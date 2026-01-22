import React from 'react';
import {
    Link as LinkIcon, Layout, ExternalLink, Trash2, Plus, CheckCircle, Save,
    Instagram, Twitter, Facebook, Linkedin, Github, Youtube, MessageCircle
} from 'lucide-react';

const UserLinks = ({
    profileData,
    handleLinkChange,
    removeLink,
    addLink,
    setProfileData,
    saveProfile,
    saving,
    successMsg
}) => {
    return (
        <div className="links-section">
            <div className="flex justify-between items-center mb-6">
                <h2 className="dashboard-section-title mb-0">
                    <LinkIcon className="text-accent" />
                    <span>Connections & Links</span>
                </h2>
            </div>

            <div className="mb-10">
                <div className="section-header">
                    <h3>Important Links</h3>
                    <span className="section-badge">{profileData.importantLinks.length} Added</span>
                </div>

                <div className="links-container">
                    {profileData.importantLinks.map((link, index) => (
                        <div key={index} className="link-card animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="link-card-drag">
                                <Layout size={16} />
                            </div>
                            <div className="link-card-inputs">
                                <input
                                    type="text"
                                    placeholder="Title (e.g. My Portfolio)"
                                    className="input-premium"
                                    value={link.title}
                                    onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                />
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="URL (https://...)"
                                        className="input-premium pl-9"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                    />
                                    <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <button onClick={() => removeLink(index)} className="link-card-remove" title="Remove Link">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="add-link-area mt-4">
                    <button type="button" onClick={addLink} className="btn-add-connection">
                        <Plus size={18} /> Add New Link
                    </button>
                </div>
            </div>

            <div className="section-divider" />

            <div className="mb-8">
                <div className="section-header">
                    <h3>Social Profiles</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">Add your social media profiles to help people connect with you.</p>

                <div className="socials-grid">
                    {[
                        { id: 'instagram', icon: Instagram, color: 'instagram' },
                        { id: 'whatsapp', icon: MessageCircle, color: 'whatsapp' },
                        { id: 'twitter', icon: Twitter, color: 'twitter' },
                        { id: 'linkedin', icon: Linkedin, color: 'linkedin' },
                        { id: 'github', icon: Github, color: 'github' },
                        { id: 'youtube', icon: Youtube, color: 'youtube' },
                        { id: 'facebook', icon: Facebook, color: 'facebook' },
                        { id: 'discord', icon: MessageCircle, color: 'discord' },
                    ].map((platform) => {
                        const Icon = platform.icon;
                        return (
                            <div key={platform.id} className="social-card">
                                <div className={`social-icon-box ${platform.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="social-input-wrapper">
                                    <label className="social-label">{platform.id}</label>
                                    <input
                                        type="text"
                                        className="social-input"
                                        placeholder={`@username or Link`}
                                        value={profileData.socialLinks?.[platform.id] || ''}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            socialLinks: { ...profileData.socialLinks, [platform.id]: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {successMsg && (
                <div className="connection-success-msg">
                    <CheckCircle size={20} />
                    {successMsg}
                </div>
            )}

            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                <Save size={20} />
                {saving ? 'Saving Changes...' : 'Save Connections'}
            </button>
        </div>
    );
};

export default UserLinks;
