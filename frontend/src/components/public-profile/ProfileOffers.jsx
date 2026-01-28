import React, { useState, useMemo, useRef, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { ArrowRight, Ticket, Megaphone, Heart, Tag, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import OfferCard from '../blocks/OfferCard';

const ProfileOffers = ({ profile }) => {
    const { API_URL, user, setUser } = useContext(AuthContext);
    const [filterType, setFilterType] = useState('all'); // all, codes, deals, favorites
    const [selectedTag, setSelectedTag] = useState(null);
    const [favorites, setFavorites] = useState(new Set()); // Local favorites state for public viewer

    const showGlobalOffers = profile?.plan === 'premium' || profile?.role === 'master_admin';

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

        // Filter out locked items (User Request: "lock offers ... will not show")
        // We need to check if it's paid and not unlocked by the *viewer* (user)
        items = items.filter(offer => {
            if (!offer.isGlobal) return true; // Custom banners are never locked

            // Check if locked
            if (!offer.isPaid) return true; // Free items are visible

            const isUnlocked = user?.unlockedOffers?.some(u =>
                (typeof u === 'string' ? u === offer._id : u._id === offer._id)
            );

            return isUnlocked; // Only show if unlocked
        });

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
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -320 : 320;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleUnlock = async (offer) => {
        if (!user) {
            alert('Please login first to unlock offers');
            window.location.href = '/login';
            return;
        }

        if (!window.confirm(`Unlock this offer for ${offer.price} coins?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token || localStorage.getItem('token')}` } };

            const res = await axios.post(`${API_URL}/transactions/unlock`, {
                itemId: offer._id,
                itemType: 'offer'
            }, config);

            if (res.data.remainingCoins !== undefined && setUser) {
                setUser(prev => ({
                    ...prev,
                    coins: res.data.remainingCoins,
                    unlockedOffers: [...(prev.unlockedOffers || []), res.data.item]
                }));
                alert('Offer unlocked successfully!');
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Unlock failed', error);
            alert(error.response?.data?.message || 'Failed to unlock offer');
        }
    };

    return (
        <div className="w-full">
            {/* Hero Banner ... */}
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
            <div className="profile-filter-container">
                {/* Main Tabs */}
                <div className="profile-tabs-wrapper">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`profile-filter-btn ${filterType === 'all' ? 'active-all' : 'default'}`}
                    >
                        All Offers
                    </button>
                    <button
                        onClick={() => setFilterType('codes')}
                        className={`profile-filter-btn ${filterType === 'codes' ? 'active-codes' : 'default'}`}
                    >
                        <Ticket size={16} /> With Promo Code
                    </button>
                    <button
                        onClick={() => setFilterType('deals')}
                        className={`profile-filter-btn ${filterType === 'deals' ? 'active-deals' : 'default'}`}
                    >
                        <Megaphone size={16} /> Direct Deals
                    </button>
                    {showGlobalOffers && (
                        <button
                            onClick={() => setFilterType('favorites')}
                            className={`profile-filter-btn ${filterType === 'favorites' ? 'active-favorites' : 'default'}`}
                        >
                            <Heart size={16} fill={filterType === 'favorites' ? "currentColor" : "none"} /> Favorites
                        </button>
                    )}
                </div>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                    <div className="profile-tags-scroll">
                        <div className="tags-label-badge">
                            <Filter size={16} /> <span>Filters:</span>
                        </div>
                        {selectedTag && (
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="tag-pill bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
                            >
                                <X size={12} /> Clear
                            </button>
                        )}
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className={`tag-pill ${selectedTag === tag ? 'active' : 'default'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Offer Carousel */}
            <div className="relative group">
                {/* Scroll Controls (Desktop) */}
                {filteredOffers.length > 0 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex items-center justify-center cursor-pointer"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hidden md:flex items-center justify-center cursor-pointer"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                <div className="carousel-mask">
                    <div
                        ref={scrollContainerRef}
                        className="carousel-track"
                    >
                        {filteredOffers.map((banner, idx) => (
                            <div
                                key={idx}
                                className="carousel-card-wrapper"
                            >
                                <OfferCard
                                    index={idx}
                                    offer={banner.isGlobal ? banner : {
                                        title: banner.title,
                                        image: banner.imageUrl,
                                        link: banner.link,
                                        code: banner.promoCode,
                                        description: banner.caption,
                                        discount: banner.tags && banner.tags.length > 0 ? banner.tags[0] : null
                                    }}
                                    isFavorite={filterType === 'favorites'}
                                    className="h-full shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800"
                                    onUnlock={handleUnlock}
                                />
                            </div>
                        ))}
                    </div>
                </div>
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
