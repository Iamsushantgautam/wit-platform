import { useState } from 'react';
import { Bell, Plus, Edit, Trash2, Upload, X, Link as LinkIcon, Image as ImageIcon, ChevronDown } from 'lucide-react';
import axios from 'axios';
import '../styles/UpdatesForm.css';

const UpdatesTab = ({ updates, addOrUpdateUpdate, deleteUpdate, startEditUpdate, cancelEditUpdate, editingUpdate, updateForm, setUpdateForm, saving, API_URL }) => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(updateForm.image || updateForm.thumbnail || '');
    const [imageInputType, setImageInputType] = useState('upload'); // 'upload' or 'url'
    const [imageUrl, setImageUrl] = useState('');
    const [isEmojiDropdownOpen, setIsEmojiDropdownOpen] = useState(false);

    const emojiOptions = [
        { emoji: '🔔', label: 'Bell' },
        { emoji: '🎉', label: 'Celebration' },
        { emoji: '🚀', label: 'Launch' },
        { emoji: '💡', label: 'Idea' },
        { emoji: '📢', label: 'Announce' },
        { emoji: '🔥', label: 'Hot' },
        { emoji: '✨', label: 'Feature' },
        { emoji: '🎁', label: 'Offer' },
        { emoji: '🏆', label: 'Achievement' },
        { emoji: '💬', label: 'Blog' },
        { emoji: '⭐', label: 'Star' },
        { emoji: '💼', label: 'Business' }
    ];

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
        return d.toLocaleDateString();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=updates`, formData, config);
            setUpdateForm({ ...updateForm, image: imageUrl, thumbnail: imageUrl });
            setImagePreview(imageUrl);
        } catch (error) {
            console.error(error);
            alert('Image upload failed');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            setUpdateForm({ ...updateForm, image: imageUrl, thumbnail: imageUrl });
            setImagePreview(imageUrl);
        }
    };

    const removeImage = () => {
        setUpdateForm({ ...updateForm, image: '', thumbnail: '' });
        setImagePreview('');
        setImageUrl('');
    };

    const handleEditClick = (update) => {
        // Add animation class to form
        const formCard = document.querySelector('.updates-form-card');
        if (formCard) {
            formCard.classList.add('form-edit-animate');
            setTimeout(() => formCard.classList.remove('form-edit-animate'), 600);
        }
        startEditUpdate(update);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const selectedEmoji = emojiOptions.find(opt => opt.emoji === updateForm.emoji) || emojiOptions[0];

    return (
        <div>
            <h2 className="dashboard-section-title">
                <Bell size={26} />
                Manage Updates
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create updates and announcements that will be displayed on your public profile's Updates tab
            </p>

            {/* Add/Edit Update Form */}
            <div className="updates-form-card">
                <div className="updates-form-header">
                    <span className="text-2xl">{editingUpdate ? '✏️' : '➕'}</span>
                    <h3>{editingUpdate ? 'Edit Update' : 'Create New Update'}</h3>
                </div>

                <form onSubmit={addOrUpdateUpdate}>
                    {/* Emoji Selector - Grid for Desktop, Dropdown for Mobile */}
                    <div className="form-section">
                        <label className="form-section-label">
                            Select Icon/Emoji <span className="form-required">*</span>
                        </label>

                        {/* Mobile Dropdown */}
                        <div className="emoji-dropdown-mobile">
                            <button
                                type="button"
                                className="emoji-dropdown-trigger"
                                onClick={() => setIsEmojiDropdownOpen(!isEmojiDropdownOpen)}
                            >
                                <span className="text-2xl">{selectedEmoji.emoji}</span>
                                <span>{selectedEmoji.label}</span>
                                <ChevronDown size={20} className={isEmojiDropdownOpen ? 'rotate-180' : ''} />
                            </button>
                            {isEmojiDropdownOpen && (
                                <div className="emoji-dropdown-menu">
                                    {emojiOptions.map((option) => (
                                        <button
                                            key={option.emoji}
                                            type="button"
                                            className="emoji-dropdown-item"
                                            onClick={() => {
                                                setUpdateForm({ ...updateForm, emoji: option.emoji });
                                                setIsEmojiDropdownOpen(false);
                                            }}
                                        >
                                            <span className="text-2xl">{option.emoji}</span>
                                            <span>{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop Grid */}
                        <div className="emoji-selector-grid-desktop">
                            {emojiOptions.map((option) => (
                                <div
                                    key={option.emoji}
                                    className={`emoji-option ${updateForm.emoji === option.emoji ? 'selected' : ''}`}
                                    onClick={() => setUpdateForm({ ...updateForm, emoji: option.emoji })}
                                >
                                    <span className="emoji-icon">{option.emoji}</span>
                                    <span className="emoji-label">{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-section">
                        <label className="form-section-label">
                            Title <span className="form-required">*</span>
                        </label>
                        <input
                            type="text"
                            value={updateForm.title}
                            onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                            placeholder="e.g., New Feature Launched"
                            className="form-input-enhanced"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="form-section-label">
                            Description <span className="form-required">*</span>
                        </label>
                        <textarea
                            value={updateForm.text}
                            onChange={(e) => setUpdateForm({ ...updateForm, text: e.target.value })}
                            placeholder="Describe your update..."
                            className="form-textarea-enhanced"
                            required
                        />
                    </div>

                    {/* Image Upload/URL - Combined Field */}
                    <div className="form-section">
                        <label className="form-section-label">
                            <ImageIcon size={16} className="inline" /> Update Image <span className="form-optional">(optional)</span>
                        </label>

                        {/* Image Input Type Tabs */}
                        <div className="image-input-tabs">
                            <button
                                type="button"
                                className={`image-tab ${imageInputType === 'upload' ? 'active' : ''}`}
                                onClick={() => setImageInputType('upload')}
                            >
                                📤 Upload
                            </button>
                            <button
                                type="button"
                                className={`image-tab ${imageInputType === 'url' ? 'active' : ''}`}
                                onClick={() => setImageInputType('url')}
                            >
                                🔗 URL
                            </button>
                        </div>

                        {!imagePreview ? (
                            <>
                                {imageInputType === 'upload' ? (
                                    <div className="image-upload-area">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                            disabled={uploadingImage}
                                        />
                                        <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                            <div className="upload-icon">
                                                {uploadingImage ? '⏳' : '📷'}
                                            </div>
                                            <div className="upload-text">
                                                {uploadingImage ? 'Uploading...' : 'Click to upload image (Max 5MB)'}
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="image-url-input-container">
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="form-input-enhanced"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageUrlSubmit}
                                            className="btn btn-outline px-4 py-2 mt-2"
                                            disabled={!imageUrl}
                                        >
                                            Preview Image
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview-large" />
                                <button
                                    type="button"
                                    className="image-preview-remove-large"
                                    onClick={removeImage}
                                >
                                    <X size={20} /> Remove Image
                                </button>
                            </div>
                        )}

                        <p className="form-helper-text">
                            Upload an image file or provide a URL to make your update more visual
                        </p>
                    </div>

                    {/* Link */}
                    <div className="form-section">
                        <label className="form-section-label">
                            <LinkIcon size={16} className="inline" /> Call-to-Action Link <span className="form-optional">(optional)</span>
                        </label>
                        <input
                            type="url"
                            value={updateForm.link || ''}
                            onChange={(e) => setUpdateForm({ ...updateForm, link: e.target.value })}
                            placeholder="https://example.com/your-offer"
                            className="form-input-enhanced"
                        />
                        <p className="form-helper-text">
                            Add a link where users can take action (e.g., buy, sign up, learn more)
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={saving || uploadingImage}
                            className="btn-submit-update"
                        >
                            {saving ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    {editingUpdate ? '💾 Update' : '➕ Add Update'}
                                </>
                            )}
                        </button>
                        {editingUpdate && (
                            <button
                                type="button"
                                onClick={cancelEditUpdate}
                                className="btn btn-outline px-6 py-3"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Updates List - Public Profile Style */}
            <div className="mt-8">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Your Updates</h3>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                    }}>
                        {updates.length}
                    </span>
                </div>

                {updates.length === 0 ? (
                    <div style={{
                        background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
                        border: '2px dashed #d1d5db',
                        borderRadius: '1.5rem',
                        padding: '3rem 2rem',
                        textAlign: 'center'
                    }}>
                        <Bell size={56} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                        <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>
                            No updates yet
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            Create your first update to engage with your audience!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {updates.map((update) => (
                            <div
                                key={update._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '1.25rem',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease'
                                }}
                                className="hover:shadow-lg hover:-translate-y-1"
                            >
                                {(update.image || update.thumbnail) && (
                                    <img
                                        src={update.image || update.thumbnail}
                                        alt={update.title}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '2rem' }}>{update.emoji}</span>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, flex: 1 }}>
                                            {update.title}
                                        </h4>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEditClick(update)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    background: 'transparent',
                                                    color: '#3b82f6',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="hover:bg-blue-50 hover:scale-110"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteUpdate(update._id)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    background: 'transparent',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="hover:bg-red-50 hover:scale-110"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                        {update.text}
                                    </p>
                                    {update.link && (
                                        <a
                                            href={update.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                color: '#3b82f6',
                                                textDecoration: 'none',
                                                padding: '0.5rem 1rem',
                                                background: '#eff6ff',
                                                borderRadius: '0.5rem',
                                                marginBottom: '0.75rem',
                                                transition: 'all 0.2s'
                                            }}
                                            className="hover:bg-blue-100"
                                        >
                                            <LinkIcon size={16} />
                                            View Link
                                        </a>
                                    )}
                                    <div style={{
                                        paddingTop: '0.75rem',
                                        borderTop: '1px solid #e5e7eb',
                                        fontSize: '0.75rem',
                                        color: '#9ca3af'
                                    }}>
                                        📅 {formatDate(update.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdatesTab;
