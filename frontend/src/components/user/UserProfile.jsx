import React from 'react';
import { User, Save, Image, AlertCircle, CheckCircle } from 'lucide-react';

const UserProfile = ({
    profileData,
    handleProfileChange,
    handleImageUpload,
    handleLogoUpload,
    uploading,
    saveProfile,
    saving
}) => {
    return (
        <form onSubmit={saveProfile} className="space-y-10">
            {/* Header */}
            <div>
                <h2 className="dashboard-section-title">
                    <User className="text-accent" />
                    <span className="text-gray-900 dark:text-white">Profile</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">Manage your public profile details, appearance, and branding.</p>
            </div>

            {/* 1. Appearance / Image Upload Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <br />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Image Uploader */}
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

                            <div className="image-upload-details mt-4">

                                {/* 3. Basic Details Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                                        <User size={20} className="text-blue-500" />
                                        Basic Details
                                    </h3><br />

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="label-premium">Display Name</label>
                                            <input
                                                type="text" name="name"
                                                value={profileData.name} onChange={handleProfileChange}
                                                className="input-premium" placeholder="e.g. John Doe"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="label-premium">Category</label>
                                            <select
                                                name="category"
                                                value={profileData.category} onChange={handleProfileChange}
                                                className="input-premium"
                                            >
                                                <option value="Developer">Developer</option>
                                                <option value="Designer">Designer</option>
                                                <option value="Creator">Content Creator</option>
                                                <option value="Entrepreneur">Entrepreneur</option>
                                                <option value="Student">Student</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="label-premium">Bio</label>
                                        <textarea
                                            name="bio" rows="4"
                                            value={profileData.bio} onChange={handleProfileChange}
                                            className="input-premium" placeholder="Tell the world about yourself..."
                                        />
                                    </div>
                                </div><br></br>

                                <button type="submit" disabled={saving} className="btn btn-primary mt-6 px-8 py-3 w-full md:w-auto">
                                    <Save size={18} />
                                    {saving ? 'Saving...' : 'Save Profile Changes'}
                                </button>

                                {uploading && (
                                    <div className="uploading-indicator mt-2">
                                        <div className="uploading-spinner" />
                                        Uploading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="flex flex-col justify-center">
                        {profileData.image && (
                            <div className="avatar-preview-card w-full max-w-xs mx-auto">
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

                        <br></br>

                        <div className="mt-6 text-sm text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400 mb-1">

                                <AlertCircle size={16} />
                                Upload Instructions
                            </div>
                            <p>
                                Click the circular avatar to upload a new photo from your device.
                                Recommended: Square image (1:1 ratio), JPG or PNG, max 2MB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>






        </form>
    );
};

export default UserProfile;
