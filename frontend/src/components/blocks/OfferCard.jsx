import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Gift, Zap, ExternalLink, Edit, Trash2, Heart, Lock } from 'lucide-react';
import '../../styles/Offers.css';

const OfferCard = ({ offer, index = 0, className = '', onEdit, onDelete, onToggleFavorite, isFavorite = false, showFullDetails = false, onUnlock }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    // Guard clause
    if (!offer) return null;

    const hasCode = offer.code && offer.code.trim() !== '';
    const isLocked = offer.isLocked;

    const toggleReveal = () => setIsRevealed(!isRevealed);
    const animStyle = { animationDelay: `${(index % 8) * 100}ms` };

    const renderControls = () => {
        return (
            <div className="absolute top-2 right-2 flex gap-2 z-20">
                {onToggleFavorite && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(); }}
                        className={`p-2 rounded-full shadow-md transition-all duration-200 ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-slate-400 hover:text-red-500'}`}
                        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
                        className="p-2 bg-white/90 text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                        title="Edit Offer"
                    >
                        <Edit size={16} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                        className="p-2 bg-white/90 text-red-600 rounded-full shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200"
                        title="Delete Offer"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        );
    };

    // --- VARIANT: DEAL (No Code) ---
    if (!hasCode) {
        return (
            <div className={`offer-card group relative animate-fade-up ${className}`} style={animStyle}>
                {renderControls()}
                <div className="offer-image-wrapper">
                    {offer.image ? (
                        <img src={offer.image} alt={offer.title} className="offer-image" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                            <Gift size={48} className="opacity-50" />
                        </div>
                    )}
                </div>

                <div className="offer-body">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="offer-title">{offer.title}</h3>
                        {offer.discount && (
                            <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                                {offer.discount}
                            </span>
                        )}
                    </div>

                    <p className={`text-sm text-slate-500 mb-4 ${showFullDetails ? '' : 'line-clamp-2'}`}>{offer.description}</p>


                    <div className="mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 w-full flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                            {offer.expires ? `Exp: ${offer.expires}` : 'Limited'}
                        </span>
                        {offer.link && (
                            <a
                                href={offer.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all "
                            >
                                Redeem <ArrowRight size={12} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- VARIANT: COUPON (With Code) ---
    return (
        <div className={`offer-card group relative animate-fade-up ${className}`} style={animStyle}>
            {renderControls()}
            <div className="offer-image-wrapper">
                {offer.image ? (
                    <img src={offer.image} alt={offer.title} className="offer-image" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <Gift size={48} className="opacity-50" />
                    </div>
                )}
            </div>

            <div className="offer-body">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="offer-title">{offer.title}</h3>
                    {offer.discount && (
                        <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                            {offer.discount}
                        </span>
                    )}
                </div>

                <p className={`text-sm text-slate-500 mb-4 ${showFullDetails ? '' : 'line-clamp-2'}`}>{offer.description}</p>

                {/* Promo Code Reveal */}
                <div className={`promo-reveal-container ${isLocked ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30' : ''}`}>
                    {isLocked ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Unlock clicked for:', offer);
                                if (onUnlock) {
                                    onUnlock(offer);
                                } else {
                                    console.error('onUnlock prop is missing');
                                    alert('Unlock function not available');
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 font-bold text-amber-600 dark:text-amber-500 py-1 hover:bg-amber-100/50 rounded transition-colors z-10 relative cursor-pointer"
                        >
                            <Lock size={16} /> Unlock Code ({offer.price ? `${offer.price} Coins` : 'Premium'})
                        </button>
                    ) : (
                        <>
                            <div className={`promo-code-display ${isRevealed ? 'animate-reveal text-slate-900 dark:text-white' : 'promo-blurred'}`}>
                                {isRevealed ? offer.code : '••••••••'}
                            </div>
                            <button
                                onClick={toggleReveal}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"
                                title={isRevealed ? "Hide Code" : "Reveal Code"}
                            >
                                {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 w-full flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                        {offer.expires ? `Exp: ${offer.expires}` : 'Limited'}
                    </span>
                    {offer.link && (
                        <a
                            href={offer.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all"
                        >
                            Redeem <ArrowRight size={12} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
