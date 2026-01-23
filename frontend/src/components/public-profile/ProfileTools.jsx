import React from 'react';
import { Layout } from 'lucide-react';
import ToolCard from '../blocks/ToolCard';

const ProfileTools = ({ profile }) => {
    const hasTools = profile?.activeTools?.some(t => t.type !== 'prompt') || profile?.customItems?.some(i => !i.type || i.type === 'tool');

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
            {profile.activeTools?.filter(tool => tool.type !== 'prompt').map((tool) => (
                <ToolCard
                    key={tool._id}
                    tool={tool}
                    type="public"
                />
            ))}

            {/* Custom Tools */}
            {profile?.customItems?.filter(i => (!i.type || i.type === 'tool') && i.visibility !== 'private').map((tool, idx) => (
                <ToolCard
                    key={`custom-${idx}`}
                    tool={tool}
                    type="public"
                />
            ))}
        </div>
    );
};

export default ProfileTools;
