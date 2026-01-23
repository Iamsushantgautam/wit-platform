import React, { useState, useMemo } from 'react';
import { ArrowRight, Ticket, Megaphone, Heart, Tag, Filter, X } from 'lucide-react';
import OfferCard from '../blocks/OfferCard';

const ProfileOffers = ({ profile }) => {
    const [filterType, setFilterType] = useState('all'); // all, codes, deals, favorites
    const [selectedTag, setSelectedTag] = useState(null);
    const [favorites, setFavorites] = useState(new Set()); // Local favorites state for public viewer

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set();
        (profile?.banners || []).forEach(banner => {
            if (Array.isArray(banner.tags)) {
                banner.tags.forEach(tag => tags.add(tag));
            } else if (typeof banner.tags === 'string') {
                banner.tags.split(',').forEach(t => tags.add(t.trim()));
            }
        });
        return Array.from(tags).filter(t => t);
    }, [profile?.banners]);

    const toggleFavorite = (offerTitle) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(offerTitle)) {
                next.delete(offerTitle);
            } else {
                next.add(offerTitle);
            }
            return next;
        });
    };

    // Filter Logic
    const getFilteredOffers = () => {
        let items = [];

        if (filterType === 'favorites') {
            // Use Global Offers favorited by Profile Owner
            items = (profile?.favoritesOffers || []).map(offer => ({
                ...offer,
                isGlobal: true // Validation flag
            }));
        } else {
            // Use Custom Banners
            items = (profile?.banners || []).filter(banner => banner.isVisible !== false);
        }

        return items.filter(banner => {
            // 2. Tag Filter
            if (selectedTag) {
                // Determine tags based on source structure
                // Global offers usually have single 'tag' string or 'tags' array? Model says 'tag' string.
                // Custom banners have 'tags' array or string.

                let bannerTags = [];
                if (banner.isGlobal) {
                    bannerTags = banner.tag ? [banner.tag] : [];
                } else {
                    bannerTags = Array.isArray(banner.tags)
                        ? banner.tags
                        : (typeof banner.tags === 'string' ? banner.tags.split(',').map(t => t.trim()) : []);
                }

                if (!bannerTags.includes(selectedTag)) return false;
            }

            // 3. Type Filter (Only applies to Banners mostly, but can apply to favorites if needed)
            if (filterType === 'favorites') return true;

            const hasCode = banner.promoCode && banner.promoCode.trim() !== '';
            if (filterType === 'codes') return hasCode;
            if (filterType === 'deals') return !hasCode;

            return true; // 'all'
        });
    };

    const filteredOffers = getFilteredOffers();

    return (
        <div className="w-full">
            {/* Hero Banner */}
            {profile?.heroOffer?.isVisible !== false && (
                <div
                    className="profile-hero-banner mb-10"
                    style={{ backgroundColor: profile?.heroOffer?.backgroundColor || '#1f2937' }}
                >
                    <div className="profile-hero-banner__content">
                        <span className="profile-hero-banner__badge">
                            {profile?.heroOffer?.badge || 'Limited Time Offer'}
                        </span>
                        <h1 className="profile-hero-banner__title" style={{ whiteSpace: 'pre-wrap' }}>
                            {profile?.heroOffer?.title || '5-in-1 AI Viral Offer Pack'}
                        </h1>
                        <p className="profile-hero-banner__subtitle">
                            {profile?.heroOffer?.subtitle || 'Get 20% Off This Weekend Only!'}
                        </p>
                        <a
                            href={profile?.heroOffer?.ctaLink || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="profile-hero-banner__cta"
                            style={{ display: 'inline-flex', textDecoration: 'none' }}
                        >
                            {profile?.heroOffer?.ctaText || 'GRAB OFFER'} <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            )}

            {/* Filter Controls */}
            <div className="mb-8 space-y-4">
                {/* Main Tabs */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filterType === 'all' ? 'bg-black text-white border-black dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        All Offers
                    </button>
                    <button
                        onClick={() => setFilterType('codes')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 transition-all ${filterType === 'codes' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <Ticket size={16} /> With Promo Code
                    </button>
                    <button
                        onClick={() => setFilterType('deals')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 transition-all ${filterType === 'deals' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <Megaphone size={16} /> Direct Deals
                    </button>
                    <button
                        onClick={() => setFilterType('favorites')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 transition-all ${filterType === 'favorites' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900' : 'bg-white text-gray-600 border-gray-200 hover:border-red-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <Heart size={16} fill={filterType === 'favorites' ? "currentColor" : "none"} /> Favorites
                    </button>
                </div>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center gap-1 text-gray-400 text-sm font-medium mr-1 bg-gray-100 px-2 py-1 rounded-full   ">
                            <h3 className="text-gray-600"><Filter size={16} /> Filters:</h3>
                        </div>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="flex-shrink-0 px-3 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
                            >
                                <X size={12} /> Clear
                            </button>
                        )}
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-bold border transition-colors ${selectedTag === tag ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                        <br />
                    </div>
                )}
            </div>

            {/* Offer Grid */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-6">
                {filteredOffers.map((banner, idx) => (
                    <OfferCard
                        key={idx}
                        offer={banner.isGlobal ? banner : {
                            title: banner.title,
                            image: banner.imageUrl,
                            link: banner.link,
                            code: banner.promoCode,
                            description: banner.caption,
                            discount: banner.tags && banner.tags.length > 0 ? banner.tags[0] : null
                        }}
                        // Public view: no toggle favorite action for visitors yet (unless signed in, but this component is generic)
                        // If we want to show it's a favorite OF THE OWNER, we can just pass isFavorite={true} if filterType is favorites
                        isFavorite={filterType === 'favorites'}
                        className="h-full"
                    />
                ))}
            </div>

            {filteredOffers.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="inline-flex p-3 bg-white rounded-full shadow-sm mb-3">
                        <Filter size={24} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No offers found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileOffers;
