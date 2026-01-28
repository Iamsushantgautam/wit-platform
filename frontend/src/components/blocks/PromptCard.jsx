import React, { useState } from 'react';
import { Megaphone, Edit, Trash2, Check, Copy, CheckCircle, Heart, Share2, Bookmark, X, Lock } from 'lucide-react';
import '../../styles/Prompts.css';

const PromptCard = ({
    prompt,
    type = 'library',
    isSelected,
    isFav,
    onToggle,
    onEdit,
    onRemove,
    onFavorite,
    onCopy,
    copiedId,
    onClick,
    onShare,
    onUnlock
}) => {
    const handleWrapperClick = (e) => {
        // If clicking on buttons or their children, don't toggle
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        if (onUnlock && prompt.isLocked) {
            // Don't open if locked, maybe trigger unlock
            return;
        }
        if (onToggle) {
            onToggle();
        } else if (onClick) {
            onClick();
        } else {
            // Default behavior: Open full prompt modal
            if (!prompt.isLocked) setShowFullPrompt(true);
        }
    };

    const [showFullPrompt, setShowFullPrompt] = useState(false);
    const promptText = prompt.prompt || prompt.description || '';
    const words = promptText.split(/\s+/);
    const isLong = words.length > 20;
    const shortText = isLong ? words.slice(0, 20).join(' ') + '...' : promptText;

    const isLocked = prompt.isLocked;

    return (
        <article
            className={`prompt-card relative group ${isSelected ? 'ring-4 ring-purple-500 border-transparent' : ''}`}
            onClick={handleWrapperClick}
            style={onToggle || onClick ? { cursor: 'pointer' } : {}}
        >
            <div className="prompt-image-wrap">
                {prompt.image || prompt.logo ? (
                    <img
                        src={prompt.image || prompt.logo}
                        alt={prompt.title || prompt.name}
                        className={`prompt-image ${isLocked ? 'grayscale blur-[2px]' : ''}`}
                    />
                ) : (
                    <div className="prompt-image bg-slate-800 flex items-center justify-center">
                        <Megaphone className="text-slate-600" size={48} />
                    </div>
                )}
                <div className="prompt-overlay" />

                {isLocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                        <Lock size={32} className="text-amber-400 mb-2 drop-shadow-lg" />
                    </div>
                )}

                <div className="prompt-top-row">
                    <span className="prompt-chip" title={prompt.title || prompt.name}>
                        {prompt.title || prompt.name}
                    </span>
                    <div className="prompt-top-row-actions">
                        <span className="prompt-chip prompt-chip--platform" style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)' }}>
                            {prompt.category || prompt.platform || 'AI'}
                        </span>

                        {prompt.price > 0 && (
                            <span className="prompt-chip font-bold flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/50">
                                {prompt.price} <span className="text-[9px] uppercase">Coins</span>
                            </span>
                        )}

                        {/* Share Button */}
                        {onShare && !isLocked && (
                            <button
                                className="prompt-icon-btn hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShare(prompt);
                                }}
                                title="Share"
                            >
                                <Share2 size={14} />
                            </button>
                        )}

                        {/* Favorite Button */}
                        {onFavorite && (
                            <button
                                className={`prompt-icon-btn hover:bg-white/20 ${isFav ? 'bg-green-500 text-green-900' : 'text-white'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavorite(e, prompt._id);
                                }}
                                title={isFav ? "Remove from favorites" : "Add to favorites"}
                                style={isFav ? { background: '#22c55e', color: '#022c22' } : {}}
                            >
                                <Bookmark size={14} className={isFav ? "fill-current" : ""} />
                            </button>
                        )}

                        {/* Edit/Remove Actions (Custom) */}
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="prompt-icon-btn hover:bg-blue-500/20 hover:text-blue-400"
                                title="Edit Prompt"
                            >
                                <Edit size={14} />
                            </button>
                        )}
                        {onRemove && (
                            <button
                                onClick={onRemove}
                                className="prompt-icon-btn hover:bg-red-500/20 hover:text-red-400"
                                title="Remove Prompt"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Selection Badge */}
                {isSelected && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full p-4 shadow-xl z-20">
                        <CheckCircle size={32} fill="white" className="text-purple-600" />
                    </div>
                )}

                <div className="prompt-body">
                    <p className="prompt-text">
                        <span className="font-bold text-slate-400 mr-2">Prompt:</span>
                        {isLocked ? (
                            <span className="italic opacity-50">Premium Content Locked</span>
                        ) : isLong ? (
                            <>
                                {shortText}
                                <button
                                    className="text-blue-400 hover:text-blue-300 ml-1 font-medium bg-transparent border-none cursor-pointer hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFullPrompt(true);
                                    }}
                                >
                                    .
                                </button>
                            </>
                        ) : (
                            promptText
                        )}
                    </p>
                    <div className="prompt-footer relative">
                        {isLocked ? (
                            <button
                                type="button"
                                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 transition-all uppercase tracking-wide"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onUnlock) onUnlock(prompt);
                                }}
                            >
                                <Lock size={14} /> Unlock ({prompt.price})
                            </button>
                        ) : onCopy ? (
                            <button
                                type="button"
                                className={`prompt-copy-btn ${copiedId === prompt ? 'prompt-copy-btn--success' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCopy(prompt.prompt || prompt.description, prompt);
                                }}
                            >
                                {copiedId === prompt ? (
                                    <><Check size={14} /> Copied</>
                                ) : (
                                    <><Copy size={14} /> Copy Prompt</>
                                )}
                            </button>
                        ) : (
                            // Placeholder
                            <div className="h-9 w-full"></div>
                        )}
                        <span className="absolute right-0 bottom-0 text-[10px] font-bold text-white/30 uppercase tracking-widest pointer-events-none translate-y-full pt-2">
                            Withub
                        </span>
                    </div>
                </div>
            </div>


        </article>
    );
};

export default PromptCard;
