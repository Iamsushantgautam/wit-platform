import React from 'react';
import { MessageCircle } from 'lucide-react';

const ProfilePrompts = ({ profile }) => {
    const hasPrompts = profile?.favoritesPrompts?.length > 0 || profile?.customItems?.some(i => i.type === 'prompt');

    if (!hasPrompts) {
        return (
            <div className="profile-empty-state">
                <MessageCircle size={48} className="profile-empty-icon" />
                <p className="profile-empty-text">No prompts saved yet</p>
            </div>
        );
    }

    return (
        <div className="profile-course-grid">
            {/* Favorite Prompts */}
            {profile.favoritesPrompts?.map((prompt) => (
                <div key={prompt._id} className="profile-course-card" style={{ cursor: 'default' }}>
                    <div className="profile-course-card__body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>✨</span>
                            <h3 className="profile-course-card__title" style={{ margin: 0 }}>{prompt.name}</h3>
                        </div>
                        <div style={{
                            background: '#f3f4f6',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px dashed #d1d5db',
                            fontSize: '13px',
                            color: '#374151',
                            fontFamily: 'monospace',
                            marginBottom: '12px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {prompt.prompt}
                        </div>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            {prompt.description}
                        </p>
                    </div>
                </div>
            ))}

            {/* Custom Prompts */}
            {profile?.customItems?.filter(i => i.type === 'prompt').map((prompt, idx) => (
                <div key={`custom-${idx}`} className="profile-course-card" style={{ cursor: 'default' }}>
                    <div className="profile-course-card__body">
                        {prompt.image && (
                            <div style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={prompt.image} alt="" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>✨</span>
                            <h3 className="profile-course-card__title" style={{ margin: 0 }}>{prompt.title}</h3>
                        </div>
                        <div style={{
                            background: '#f3f4f6',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px dashed #d1d5db',
                            fontSize: '13px',
                            color: '#374151',
                            fontFamily: 'monospace',
                            marginBottom: '12px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {prompt.prompt}
                        </div>
                        {prompt.tags && prompt.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {prompt.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '12px' }}>#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfilePrompts;
