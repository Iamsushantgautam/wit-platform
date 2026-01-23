import React from 'react';
import { Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import '../../styles/Blocks/Updates.css';

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

const UpdateCard = ({ update, onEdit, onDelete, layout = 'vertical' }) => {
    return (
        <div className={`update-card ${layout === 'horizontal' ? 'horizontal' : ''}`}>
            {(update.image || update.thumbnail) && (
                <img
                    src={update.image || update.thumbnail}
                    alt={update.title}
                    className="update-card-image"
                />
            )}
            <div className="update-card-content">
                <div className="update-card-header">
                    <span className="update-card-emoji">{update.emoji}</span>
                    <h4 className="update-card-title">
                        {update.title}
                    </h4>
                    {(onEdit || onDelete) && (
                        <div className="update-card-actions">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(update)}
                                    className="update-card-action-btn btn-edit"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(update._id)}
                                    className="update-card-action-btn btn-delete"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <p className="update-card-text">
                    {update.text}
                </p>
                {update.link && (
                    <a
                        href={update.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="update-card-link"
                    >
                        <LinkIcon size={16} />
                        View Link
                    </a>
                )}
                <div className="update-card-date">
                    📅 {formatDate(update.createdAt)}
                </div>
            </div>
        </div>
    );
};

export default UpdateCard;
