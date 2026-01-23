import React, { useState } from 'react';
import { Eye, EyeOff, Tag, Link2, Type, CheckCircle } from 'lucide-react';
import '../../styles/HeroButtons.css';

const UserHeroButtons = ({ profileData, setProfileData, saveProfile, saving }) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleButtonChange = (buttonKey, field, value) => {
        setProfileData({
            ...profileData,
            heroButtons: {
                ...profileData.heroButtons,
                [buttonKey]: {
                    ...profileData.heroButtons[buttonKey],
                    [field]: value
                }
            }
        });
    };

    const toggleButtonVisibility = (buttonKey) => {
        setProfileData({
            ...profileData,
            heroButtons: {
                ...profileData.heroButtons,
                [buttonKey]: {
                    ...profileData.heroButtons[buttonKey],
                    isVisible: !profileData.heroButtons[buttonKey].isVisible
                }
            }
        });
    };

    const handleSave = async () => {
        // Auto-fill # for empty links before saving
        const updatedButtons = { ...profileData.heroButtons };

        if (!updatedButtons.button1.link || updatedButtons.button1.link.trim() === '') {
            updatedButtons.button1.link = '#';
        }
        if (!updatedButtons.button2.link || updatedButtons.button2.link.trim() === '') {
            updatedButtons.button2.link = '#';
        }

        setProfileData({
            ...profileData,
            heroButtons: updatedButtons
        });

        // Save profile
        await saveProfile();

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const button1 = profileData.heroButtons?.button1 || {
        label: 'Get Help',
        icon: 'MessageCircle',
        link: '#',
        isVisible: true
    };

    const button2 = profileData.heroButtons?.button2 || {
        label: 'Free Prompts',
        icon: 'Star',
        link: '/prompts',
        isVisible: true
    };

    // Comprehensive list of popular Lucide icons
    const iconOptions = [
        { value: 'MessageCircle', label: '💬 MessageCircle' },
        { value: 'Star', label: '⭐ Star' },
        { value: 'Heart', label: '❤️ Heart' },
        { value: 'Gift', label: '🎁 Gift' },
        { value: 'Send', label: '📤 Send' },
        { value: 'Mail', label: '✉️ Mail' },
        { value: 'Phone', label: '📞 Phone' },
        { value: 'Download', label: '⬇️ Download' },
        { value: 'ExternalLink', label: '🔗 ExternalLink' },
        { value: 'Link', label: '🔗 Link' },
        { value: 'Zap', label: '⚡ Zap' },
        { value: 'Rocket', label: '🚀 Rocket' },
        { value: 'ShoppingCart', label: '🛒 ShoppingCart' },
        { value: 'Calendar', label: '📅 Calendar' },
        { value: 'Coffee', label: '☕ Coffee' },
        { value: 'Music', label: '🎵 Music' },
        { value: 'Video', label: '🎥 Video' },
        { value: 'Image', label: '🖼️ Image' },
        { value: 'Book', label: '📚 Book' },
        { value: 'FileText', label: '📄 FileText' },
        { value: 'Sparkles', label: '✨ Sparkles' },
        { value: 'Award', label: '🏆 Award' },
        { value: 'Target', label: '🎯 Target' },
        { value: 'TrendingUp', label: '📈 TrendingUp' },
        { value: 'Users', label: '👥 Users' },
        { value: 'User', label: '👤 User' },
        { value: 'Bell', label: '🔔 Bell' },
        { value: 'Settings', label: '⚙️ Settings' },
        { value: 'Search', label: '🔍 Search' },
        { value: 'Home', label: '🏠 Home' },
        { value: 'Plus', label: '➕ Plus' },
        { value: 'Check', label: '✓ Check' },
        { value: 'X', label: '✕ X' },
        { value: 'ArrowRight', label: '→ ArrowRight' },
        { value: 'ChevronRight', label: '› ChevronRight' },
        { value: 'Play', label: '▶ Play' },
        { value: 'Pause', label: '⏸ Pause' },
        { value: 'Share2', label: '🔀 Share2' },
        { value: 'Upload', label: '⬆️ Upload' },
        { value: 'Eye', label: '👁️ Eye' },
        { value: 'Edit', label: '✏️ Edit' },
        { value: 'Trash', label: '🗑️ Trash' },
        { value: 'Save', label: '💾 Save' },
        { value: 'Globe', label: '🌐 Globe' },
        { value: 'Lock', label: '🔒 Lock' },
        { value: 'Unlock', label: '🔓 Unlock' }
    ];

    return (
        <div className="hero-buttons-container">
            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    <CheckCircle className="success-icon" size={24} />
                    <span>Hero Buttons saved successfully!</span>
                </div>
            )}

            {/* Header */}
            <div className="hero-buttons-header">
                <h2 className="hero-buttons-title">Hero Buttons</h2>
                <p className="hero-buttons-subtitle">
                    Customize the action buttons displayed on your profile hero section
                </p>
            </div>

            {/* Button 1 */}
            <div className="hero-button-card">
                <div className="hero-button-card-header">
                    <div className="hero-button-card-title">
                        Button 1
                        <span className="hero-button-badge hero-button-badge--secondary">Secondary</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleButtonVisibility('button1')}
                        className={`visibility-toggle ${button1.isVisible
                            ? 'visibility-toggle--visible'
                            : 'visibility-toggle--hidden'
                            }`}
                    >
                        {button1.isVisible ? (
                            <>
                                <Eye size={18} />
                                Visible
                            </>
                        ) : (
                            <>
                                <EyeOff size={18} />
                                Hidden
                            </>
                        )}
                    </button>
                </div>

                <div className="hero-button-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Type className="form-label-icon" size={16} />
                                Button Label
                            </label>
                            <input
                                type="text"
                                value={button1.label}
                                onChange={(e) => handleButtonChange('button1', 'label', e.target.value)}
                                placeholder="Get Help"
                                className="form-input"
                            />
                            <span className="form-hint">Displayed text on the button</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Tag className="form-label-icon" size={16} />
                                Icon
                            </label>
                            <select
                                value={button1.icon}
                                onChange={(e) => handleButtonChange('button1', 'icon', e.target.value)}
                                className="form-select"
                            >
                                {iconOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="form-hint">Select Lucide icon for button</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Link2 className="form-label-icon" size={16} />
                            Button Link
                        </label>
                        <input
                            type="text"
                            value={button1.link}
                            onChange={(e) => handleButtonChange('button1', 'link', e.target.value)}
                            placeholder="https://example.com or /page (leave empty for #)"
                            className="form-input"
                        />
                        <span className="form-hint">
                            Internal: /page | External: https://... | Leave empty for disabled (#)
                        </span>
                    </div>
                </div>
            </div>

            {/* Button 2 */}
            <div className="hero-button-card">
                <div className="hero-button-card-header">
                    <div className="hero-button-card-title">
                        Button 2
                        <span className="hero-button-badge hero-button-badge--primary">Primary</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleButtonVisibility('button2')}
                        className={`visibility-toggle ${button2.isVisible
                            ? 'visibility-toggle--visible'
                            : 'visibility-toggle--hidden'
                            }`}
                    >
                        {button2.isVisible ? (
                            <>
                                <Eye size={18} />
                                Visible
                            </>
                        ) : (
                            <>
                                <EyeOff size={18} />
                                Hidden
                            </>
                        )}
                    </button>
                </div>

                <div className="hero-button-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <Type className="form-label-icon" size={16} />
                                Button Label
                            </label>
                            <input
                                type="text"
                                value={button2.label}
                                onChange={(e) => handleButtonChange('button2', 'label', e.target.value)}
                                placeholder="Free Prompts"
                                className="form-input"
                            />
                            <span className="form-hint">Displayed text on the button</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Tag className="form-label-icon" size={16} />
                                Icon
                            </label>
                            <select
                                value={button2.icon}
                                onChange={(e) => handleButtonChange('button2', 'icon', e.target.value)}
                                className="form-select"
                            >
                                {iconOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className="form-hint">Select Lucide icon for button</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Link2 className="form-label-icon" size={16} />
                            Button Link
                        </label>
                        <input
                            type="text"
                            value={button2.link}
                            onChange={(e) => handleButtonChange('button2', 'link', e.target.value)}
                            placeholder="https://example.com or /prompts (leave empty for #)"
                            className="form-input"
                        />
                        <span className="form-hint">
                            Internal: /page | External: https://... | Leave empty for disabled (#)
                        </span>
                    </div>
                </div>
            </div>

            {/* Icon Reference */}
            <div className="icon-reference">
                <h4 className="icon-reference-title">
                    📚 Icon Reference
                </h4>
                <p className="icon-reference-text">
                    Choose from {iconOptions.length}+ popular Lucide icons in the dropdown above, or browse the complete library for even more options.
                </p>
                <p className="icon-reference-text">
                    Visit{' '}
                    <a
                        href="https://lucide.dev/icons"
                        target="_blank"
                        rel="noreferrer"
                        className="icon-reference-link"
                    >
                        lucide.dev/icons
                    </a>
                    {' '}for the full icon collection
                </p>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="save-button"
            >
                {saving ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <CheckCircle size={20} />
                        Save Hero Buttons
                    </>
                )}
            </button>
        </div>
    );
};

export default UserHeroButtons;
