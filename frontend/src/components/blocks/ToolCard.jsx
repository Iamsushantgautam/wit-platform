import React from 'react';
import { Layout, CheckCircle, Trash2, ExternalLink, Wrench, Edit } from 'lucide-react';
import '../../styles/Blocks/AiTools.css';

const ToolCard = ({ tool, type = 'library', isSelected, onToggle, onRemove, onEdit }) => {

    // Custom or Public View (Detailed Card)
    if (type === 'custom' || type === 'public') {
        return (
            <article className="tool-card relative group">
                <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="bg-blue-100 text-blue-500 p-1.5 rounded-full hover:bg-blue-200"
                            title="Edit Tool"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-200"
                            title="Remove Tool"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>

                <div className="tool-card-header">
                    <div className="tool-card-logo">
                        {tool.image || tool.logo ? (
                            <img src={tool.image || tool.logo} alt={tool.title || tool.name} />
                        ) : (
                            <Wrench className="tool-card-logo-icon" size={24} />
                        )}
                    </div>
                    <div className="tool-card-info">
                        <h3 className="tool-card-title">{tool.title || tool.name}</h3>
                        <span className="tool-card-category">
                            {tool.category || 'Tool'}
                        </span>
                    </div>
                </div>
                <p className="tool-card-description line-clamp-3">
                    {tool.description}
                </p>
                <div className="tool-card-action">
                    <a
                        href={tool.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="tool-card-btn"
                    >
                        Visit Website
                        <ExternalLink size={18} className="tool-card-btn-icon" />
                    </a>
                </div>
            </article>
        );
    }

    // Library Type (Selection Grid)
    return (
        <div
            onClick={onToggle}
            className={`tool-card ${isSelected ? 'selected' : ''}`}
            style={{ cursor: 'pointer', padding: '1.5rem' }}
        >
            <div className="tool-card-header" style={{ marginBottom: '1rem' }}>
                <div className="tool-card-logo" style={{ width: '3rem', height: '3rem' }}>
                    {tool.logo || tool.image ? (
                        <img src={tool.logo || tool.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <Layout size={24} />
                    )}
                </div>
                <div className="tool-card-info">
                    <h4 className="tool-card-title" style={{ fontSize: '1rem' }}>{tool.name || tool.title}</h4>
                    <span className="tool-card-category" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6rem' }}>{tool.category}</span>
                </div>
            </div>
            <p className="tool-card-description line-clamp-3" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                {tool.description}
            </p><br />

            <div className="tool-card-action">
                <a
                    href={tool.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="tool-card-btn"
                >
                    Visit Website
                    <ExternalLink size={18} className="tool-card-btn-icon" />
                </a>
            </div>

            {isSelected && (
                <div className="tool-check-badge">
                    <CheckCircle size={16} fill="currentColor" />
                </div>
            )}
        </div>
    );
};

export default ToolCard;
