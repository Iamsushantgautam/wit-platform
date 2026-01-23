import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Gift, Zap, ExternalLink } from 'lucide-react';
import '../../styles/Offers.css';

const OfferCard = ({ offer, index = 0, className = '' }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const hasCode = offer.code && offer.code.trim() !== '';

    const toggleReveal = () => setIsRevealed(!isRevealed);
    const animStyle = { animationDelay: `${(index % 8) * 100}ms` }; // Modulo for clean animation on pagination

    // --- VARIANT: DEAL (No Code - Reference Style) ---
    if (!hasCode) {
        return (
            <div className={`deal-card animate-fade-up ${className}`} style={animStyle}>
                <div className="deal-image-area">
                    {offer.image ? (
                        <img src={offer.image} alt={offer.title} className="deal-image" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300">
                            <Zap size={32} />
                        </div>
                    )}
                    {offer.discount && (
                        <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                            {offer.discount}
                        </div>
                    )}
                </div>
                <div className="deal-content">
                    <h3 className="deal-title">{offer.title}</h3>
                    <p className="deal-desc">{offer.description}</p>

                    <div className="deal-footer">
                        <a
                            href={offer.link || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="deal-link-btn"
                        >
                            Get Deal <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // --- VARIANT: COUPON (With Code) ---
    return (
        <div className={`offer-card animate-fade-up ${className}`} style={animStyle}>
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

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{offer.description}</p>

                {/* Promo Code Reveal */}
                <div className="promo-reveal-container">
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
