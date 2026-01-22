import React from 'react';
import { ExternalLink, ChevronRight } from 'lucide-react';

const ProfileLinks = ({ importantLinks }) => {
    if (!importantLinks || importantLinks.length === 0) {
        return null;
    }

    return (
        <div className="profile-links-section">
            {importantLinks.map((link, idx) => (
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="profile-link-item"
                >
                    <div className="profile-link-item__content">
                        <div className="profile-link-item__icon">
                            <ExternalLink size={20} />
                        </div>
                        <div className="profile-link-item__text">
                            <div className="profile-link-item__title">{link.title}</div>
                            <div className="profile-link-item__url">{link.url}</div>
                        </div>
                    </div>
                    <ChevronRight className="profile-link-item__arrow" size={20} />
                </a>
            ))}
        </div>
    );
};

export default ProfileLinks;
