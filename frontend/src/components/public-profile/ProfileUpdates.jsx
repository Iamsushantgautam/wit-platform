import React from 'react';
import { Bell, ExternalLink } from 'lucide-react';
import '../../styles/UpdatesList.css';

const ProfileUpdates = ({ updates, formatDate }) => {
    if (!updates || updates.length === 0) {
        return (
            <div className="updates-empty-state">
                <Bell size={48} className="updates-empty-icon" />
                <h3 className="updates-empty-title">No updates yet</h3>
                <p className="updates-empty-subtitle">Check back later for news and announcements</p>
            </div>
        );
    }

    return (
        <div className="profile-updates">
            {updates.map((update) => (
                <div key={update._id} className="profile-update-item">
                    {update.thumbnail && (
                        <img
                            src={update.thumbnail}
                            alt=""
                            className="profile-update-item__thumbnail"
                        />
                    )}
                    <div className="profile-update-item__content">
                        <div className="profile-update-item__title">
                            <span className="profile-update-item__emoji">{update.emoji}</span>
                            {update.title}
                        </div>
                        <p className="profile-update-item__text">{update.text}</p>

                        {/* Link in Updates */}
                        {update.link && (
                            <a
                                href={update.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm mb-2 hover:underline"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 600, fontSize: '13px', marginBottom: '8px', textDecoration: 'none' }}
                            >
                                <ExternalLink size={14} />
                                View Link
                            </a>
                        )}

                        <div className="profile-update-item__time">{formatDate(update.createdAt)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileUpdates;
