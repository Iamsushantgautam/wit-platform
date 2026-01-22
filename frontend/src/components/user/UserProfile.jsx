import React from 'react';
import { User, Save } from 'lucide-react';

const UserProfile = ({ profileData, handleProfileChange, saveProfile, saving }) => {
    return (
        <form onSubmit={saveProfile}>
            <h2 className="dashboard-section-title">
                <User className="text-accent" />
                <span className="text-gray-900 dark:text-white">Profile Details</span>
            </h2>

            <div className="space-y-8">
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
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary mt-10 px-8 py-3">
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

export default UserProfile;
