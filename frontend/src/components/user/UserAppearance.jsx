import React from 'react';
import { Image, User, AlertCircle, CheckCircle, Save } from 'lucide-react';

const UserAppearance = ({
    profileData,
    handleProfileChange,
    handleImageUpload,
    uploading,
    saveProfile,
    saving
}) => {
    return (
        <form onSubmit={saveProfile} className="appearance-section">
            <h2 className="dashboard-section-title">
                <Image className="text-accent" />
                <span className="text-gray-900 dark:text-white">Appearance</span>
            </h2>

            <div className="space-y-8">
                <div className="form-group">
                    <label className="label-premium mb-4 block">Profile Image</label>

                    <div className="image-upload-container">
                        <div className="profile-image-uploader">
                            <div className="profile-image-preview">
                                {profileData.image ? (
                                    <img src={profileData.image} alt="Profile" />
                                ) : (
                                    <div className="profile-image-placeholder">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            <label htmlFor="image-upload" className="profile-image-overlay">
                                <div className="profile-image-overlay-content">
                                    <div className="profile-image-overlay-icon">
                                        <Image size={20} />
                                    </div>
                                    Change Photo
                                </div>
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="image-upload-details">
                            <div className="image-url-input-group">
                                <label className="image-url-label">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={profileData.image}
                                    onChange={handleProfileChange}
                                    className="image-url-input"
                                    placeholder="https://example.com/your-image.jpg"
                                />
                            </div>

                            <div className="image-upload-help">
                                <div className="image-upload-help-title">
                                    <AlertCircle size={16} />
                                    Upload Instructions
                                </div>
                                <p className="image-upload-help-text">
                                    Click the circular avatar to upload a new photo from your device,
                                    or paste a direct image URL above.
                                </p>
                                <p className="image-upload-help-highlight">
                                    Recommended: Square image (1:1 ratio), JPG or PNG, max 2MB
                                </p>
                            </div>

                            {uploading && (
                                <div className="uploading-indicator">
                                    <div className="uploading-spinner" />
                                    Uploading your image...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {profileData.image && (
                    <div className="avatar-preview-card">
                        <div className="avatar-preview-image">
                            <img src={profileData.image} alt="Preview" />
                        </div>
                        <div className="avatar-preview-info">
                            <p className="avatar-preview-title">
                                Avatar Preview
                                <span className="avatar-preview-badge">
                                    <CheckCircle size={12} />
                                </span>
                            </p>
                            <p className="avatar-preview-subtitle">
                                This is how you'll appear to others on your profile
                            </p>
                        </div>
                    </div>

                )}
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Appearance'}
            </button>
        </form>
    );
};

export default UserAppearance;
