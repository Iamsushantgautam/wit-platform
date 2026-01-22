import React from 'react';
import { ExternalLink, Layout } from 'lucide-react';

const ProfileTools = ({ profile }) => {
    const hasTools = profile?.activeTools?.length > 0 || profile?.customItems?.some(i => !i.type || i.type === 'tool');

    if (!hasTools) {
        return (
            <div className="profile-empty-state">
                <Layout size={48} className="profile-empty-icon" />
                <p className="profile-empty-text">No tools added yet</p>
            </div>
        );
    }

    return (
        <div className="profile-course-grid">
            {/* Global Tools */}
            {profile.activeTools?.map((tool) => (
                <a
                    key={tool._id}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-course-card"
                >
                    <div className="profile-course-card__image-wrapper" style={{ aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
                        <img
                            src={tool.logo}
                            alt={tool.name}
                            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="profile-course-card__body">
                        <h3 className="profile-course-card__title">{tool.name}</h3>
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.5',
                            marginBottom: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {tool.description}
                        </p>
                        <div className="profile-course-card__link">
                            Visit Tool <ExternalLink size={14} />
                        </div>
                    </div>
                </a>
            ))}

            {/* Custom Tools */}
            {profile?.customItems?.filter(i => !i.type || i.type === 'tool').map((tool, idx) => (
                <a
                    key={`custom-${idx}`}
                    href={tool.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-course-card"
                >
                    <div className="profile-course-card__image-wrapper" style={{ aspectRatio: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
                        {tool.image ? (
                            <img
                                src={tool.image}
                                alt={tool.title}
                                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                            />
                        ) : (
                            <Layout size={40} className="text-gray-400" />
                        )}
                    </div>
                    <div className="profile-course-card__body">
                        <h3 className="profile-course-card__title">{tool.title}</h3>
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.5',
                            marginBottom: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {tool.description}
                        </p>
                        <div className="profile-course-card__link">
                            Visit Tool <ExternalLink size={14} />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default ProfileTools;
