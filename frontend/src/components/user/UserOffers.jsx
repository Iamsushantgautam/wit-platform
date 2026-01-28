import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
    Megaphone, Star, Link as LinkIcon, Plus, Image, EyeOff, Eye,
    Tag, Ticket, AlignLeft, Edit, Save, X, Heart, Globe
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import OfferCard from '../blocks/OfferCard';

const UserOffers = ({
    profileData,
    setProfileData,
    saveProfile,
    saving
}) => {
    const { API_URL, user, setUser } = useContext(AuthContext);

    // Global Offers State
    const [globalOffers, setGlobalOffers] = useState([]);
    const [loadingGlobal, setLoadingGlobal] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showPromo, setShowPromo] = useState(false);

    // Temp Banner State
    const [tempBanner, setTempBanner] = useState({
        title: '',
        imageUrl: '',
        link: '',
        promoCode: '',
        tags: [],
        caption: '',
        isVisible: true
    });

    useEffect(() => {
        const fetchGlobalOffers = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get(`${API_URL}/offers`, config);

                // Identify unlocked status correctly
                const allOffers = res.data.map(offer => {
                    const isUnlocked = user?.unlockedOffers?.some(u =>
                        (typeof u === 'string' ? u === offer._id : u._id === offer._id)
                    );
                    return { ...offer, isLocked: !offer.isPaid ? false : !isUnlocked };
                });

                setGlobalOffers(allOffers);
            } catch (error) {
                console.error("Failed to fetch global offers", error);
            } finally {
                setLoadingGlobal(false);
            }
        };
        fetchGlobalOffers();
    }, [API_URL, user]); // Added user to dependency

    // Categorize User Banners
    // Keeping these for legacy reference but we will map them dynamically now
    const promoBanners = (profileData.banners || []).filter(b => b.promoCode && b.promoCode.trim() !== '');
    const dealBanners = (profileData.banners || []).filter(b => !b.promoCode || b.promoCode.trim() === '');

    // Handlers
    const handleOpenAdd = () => {
        setTempBanner({
            title: '',
            imageUrl: '',
            link: '',
            promoCode: '',
            tags: [],
            caption: '',
            isVisible: true
        });
        setEditingIndex(null);
        setShowPromo(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (originalIndex) => {
        // Need to find the actual index in profileData.banners
        setTempBanner({ ...profileData.banners[originalIndex] });
        setEditingIndex(originalIndex);
        setShowPromo(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
        setUploading(false);
    };

    const removeBanner = async (originalIndex) => {
        const newBanners = profileData.banners.filter((_, i) => i !== originalIndex);
        const updatedProfile = { ...profileData, banners: newBanners };

        setProfileData(updatedProfile);

        // Auto-save
        try {
            await axios.post(`${API_URL}/profiles`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (err) {
            console.error("Failed to auto-save deletion", err);
        }
    };

    const handleSaveBanner = async () => {
        if (!tempBanner.title) {
            alert("Title is required");
            return;
        }

        let newBanners = [...(profileData.banners || [])];
        if (editingIndex !== null) {
            newBanners[editingIndex] = tempBanner;
        } else {
            newBanners.push(tempBanner);
        }

        const updatedProfile = { ...profileData, banners: newBanners };
        setProfileData(updatedProfile);

        handleCloseModal();

        // Auto-save
        try {
            await axios.post(`${API_URL}/profiles`, updatedProfile, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (err) {
            console.error("Failed to auto-save banner", err);
            alert("Saved locally, but failed to sync to server.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data: imageUrl } = await axios.post(`${API_URL}/upload?context=banner`, formData, config);
            setTempBanner(prev => ({ ...prev, imageUrl }));
        } catch (error) {
            console.error(error);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const toggleFavorite = async (offer) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            // Note: offer is the object, we need its ID.
            // For user banners (local), they might not have an _id if strictly local, but here we likely mean Global Offers which do have _id.
            if (offer._id) {
                const { data } = await axios.post(`${API_URL}/profiles/favorites/offer`, { offerId: offer._id }, config);
                setProfileData(data);
            }
        } catch (error) {
            console.error("Error toggling favorite", error);
        }
    };

    const getRealIndex = (banner) => {
        return (profileData.banners || []).findIndex(b => b === banner);
    };

    const renderAddButton = () => (
        <button
            onClick={handleOpenAdd}
            className="group relative flex flex-col items-center justify-center min-h-[320px] rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-300"
        >
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 text-blue-500">
                <Plus size={32} />
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Add New Offer</span>
        </button>
    );

    const isGlobalFavorite = (offerId) => {
        return profileData.favoritesOffers?.some(fav => fav._id === offerId || fav === offerId);
    };

    const handleUnlock = async (offer) => {
        if (!user) {
            alert('Please login first');
            return;
        }

        if (!window.confirm(`Unlock this offer for ${offer.price} coins?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token') || user.token}` } };
            const res = await axios.post(`${API_URL}/transactions/unlock`, {
                itemId: offer._id,
                itemType: 'offer'
            }, config);

            // Update global offers state
            setGlobalOffers(prev => prev.map(o => o._id === offer._id ? { ...o, isLocked: false, ...res.data.item } : o));

            // Update user balance in UI
            if (res.data.remainingCoins !== undefined && setUser) {
                setUser(prev => ({
                    ...prev,
                    coins: res.data.remainingCoins,
                    // Add the new unlocked item object to the list so checking logic works
                    unlockedOffers: [...(prev.unlockedOffers || []), res.data.item]
                }));
            }
            alert('Offer unlocked successfully!');
        } catch (error) {
            console.error('Unlock failed', error);
            alert(error.response?.data?.message || 'Failed to unlock offer');
        }
    };

    return (
        <div className="offers-section">
            <h2 className="dashboard-section-title">
                <Megaphone className="text-accent" />
                <span>Offers & Banners</span>
            </h2>

            {/* Hero Offer Editor - Encapsulated in its own block logic */}
            <div className="mb-12 relative group">
                <div className="hero-glow-bg"></div>
                <div className="hero-editor-card">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="hero-header">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="hero-icon-box">
                                    <Star size={24} className="animate-spin-slow" style={{ animationDuration: '4s' }} />
                                </span>
                                Hero Offer Banner
                            </h3>
                            <p className="text-gray-500 mt-2 font-medium">The main featured offer at the top of your profile</p>
                        </div>

                        <label className="hero-toggle-label">
                            <input
                                type="checkbox"
                                className="toggle-checkbox"
                                checked={profileData.heroOffer?.isVisible !== false}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, isVisible: e.target.checked }
                                })}
                            />
                            <div className="toggle-slider"></div>
                            <span className="ml-3 text-sm font-bold text-gray-700 dark:text-gray-200 w-16 text-center">
                                {profileData.heroOffer?.isVisible !== false ? 'Active' : 'Hidden'}
                            </span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="form-group space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Banner Title</label>
                            <input
                                type="text"
                                className="input-premium font-bold text-lg border-2 focus:border-orange-400"
                                value={profileData.heroOffer?.title || ''}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, title: e.target.value }
                                })}
                                placeholder="e.g. 5-in-1 AI Viral Offer Pack"
                            />
                        </div>
                        <div className="form-group space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Badge Text</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-premium pl-10"
                                    value={profileData.heroOffer?.badge || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        heroOffer: { ...profileData.heroOffer, badge: e.target.value }
                                    })}
                                    placeholder="e.g. Limited Time Offer"
                                />
                                <Star size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                            </div>
                        </div>
                        <div className="form-group md:col-span-2 space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Subtitle / Description</label>
                            <input
                                type="text"
                                className="input-premium"
                                value={profileData.heroOffer?.subtitle || ''}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, subtitle: e.target.value }
                                })}
                                placeholder="Get 20% Off This Weekend Only!"
                            />
                        </div>
                        <div className="form-group space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Button Text</label>
                            <input
                                type="text"
                                className="input-premium font-bold text-blue-600"
                                value={profileData.heroOffer?.ctaText || ''}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, ctaText: e.target.value }
                                })}
                                placeholder="GRAB OFFER"
                            />
                        </div>
                        <div className="form-group space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Button Link</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-premium pl-10 text-blue-500 underline decoration-blue-300"
                                    value={profileData.heroOffer?.ctaLink || ''}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        heroOffer: { ...profileData.heroOffer, ctaLink: e.target.value }
                                    })}
                                    placeholder="https://..."
                                />
                                <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="form-group space-y-2">
                            <label className="label-premium text-sm uppercase tracking-wider text-gray-500">Background Color</label>
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                                <input
                                    type="color"
                                    className="h-12 w-20 rounded-lg cursor-pointer border-0 p-1 bg-white dark:bg-gray-600 shadow-sm"
                                    value={profileData.heroOffer?.backgroundColor || '#1f2937'}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        heroOffer: { ...profileData.heroOffer, backgroundColor: e.target.value }
                                    })}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Color Hex</span>
                                    <span className="text-base font-mono font-bold text-gray-800 dark:text-gray-200">
                                        {profileData.heroOffer?.backgroundColor || '#1f2937'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- OFFERS TABS & CONTENT --- */}
            <div className="offers-tabs-container">
                <div className="offers-tabs-wrapper">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`offer-tab-btn ${activeTab === 'all'
                            ? 'active'
                            : ''
                            }`}
                    >
                        All Offers
                    </button>
                    <button
                        onClick={() => setActiveTab('codes')}
                        className={`offer-tab-btn ${activeTab === 'codes'
                            ? 'active'
                            : ''
                            }`}
                    >
                        <Ticket size={16} /> With Promo Code
                    </button>
                    <button
                        onClick={() => setActiveTab('deals')}
                        className={`offer-tab-btn ${activeTab === 'deals'
                            ? 'active'
                            : ''
                            }`}
                    >
                        <Megaphone size={16} /> Direct Deals
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`offer-tab-btn ${activeTab === 'favorites'
                            ? 'active'
                            : ''
                            }`}
                    >
                        <Heart size={16} className={activeTab === 'favorites' ? "fill-current" : ""} /> Favorites
                    </button>

                    {/* Add Button - Always visible regardless of tab to encourage creation */}
                    <button
                        onClick={handleOpenAdd}
                        className="add-custom-offer-btn"
                    >
                        <Plus size={18} /> Add Custom
                    </button>
                </div>

                {/* Offer Content Area - Sections Layout */}
                <div className="offers-content-stack">
                    {/* Logic to prepare data */}
                    {(() => {
                        const canViewGlobal = user?.plan === 'premium' || user?.role === 'master_admin';

                        // Helper to Normalize Custom Offers
                        const normalizeCustom = (b, idx) => ({
                            ...b,
                            currentRealIndex: idx,
                            _source: 'custom',
                            _id: `custom-${idx}`,
                            title: b.title,
                            image: b.imageUrl,
                            link: b.link,
                            code: b.promoCode,
                            description: b.caption,
                            discount: b.tags && b.tags.length > 0 ? b.tags[0] : null
                        });

                        // 1. Promo Codes (Custom)
                        const customCodes = (profileData.banners || [])
                            .map((b, i) => ({ banner: b, idx: i }))
                            .filter(({ banner }) => banner.promoCode && banner.promoCode.trim().length > 0)
                            .map(({ banner, idx }) => normalizeCustom(banner, idx));

                        // 2. Direct Deals (Custom)
                        const customDeals = (profileData.banners || [])
                            .map((b, i) => ({ banner: b, idx: i }))
                            .filter(({ banner }) => !banner.promoCode || banner.promoCode.trim().length === 0)
                            .map(({ banner, idx }) => normalizeCustom(banner, idx));

                        // 3. Favorites (Global)
                        const filteredFavorites = globalOffers
                            .filter(g => isGlobalFavorite(g._id))
                            .map(g => ({
                                ...g,
                                _source: 'global',
                                code: g.code,
                                promoCode: g.code,
                                description: g.description,
                                imageUrl: g.image,
                                discount: g.discount
                            }));

                        // 4. Global Offers (Available to Premium)
                        const allGlobal = canViewGlobal ? globalOffers.map(g => ({
                            ...g,
                            _source: 'global',
                            code: g.code,
                            promoCode: g.code,
                            description: g.description,
                            imageUrl: g.image,
                            discount: g.discount
                        })) : [];


                        // Section Renderer
                        const renderSection = (title, items, icon, showAdd = false) => {
                            if (items.length === 0 && !showAdd) return null;

                            return (
                                <div className="offer-carousel-section">
                                    <div className="offer-section-header">
                                        <div className="offer-section-icon">
                                            {icon}
                                        </div>
                                        <h3 className="offer-section-title">{title}</h3>
                                        <span className="offer-section-count">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
                                    </div>

                                    {/* Carousel Container */}
                                    <div className="relative group/carousel">
                                        <div className="offers-carousel-wrapper">
                                            {/* Add Button Check */}

                                            {items.map((item, idx) => (
                                                <div key={`${item._source}-${idx}`} className="offer-slide">
                                                    <OfferCard
                                                        offer={{
                                                            title: item.title,
                                                            image: item.imageUrl || item.image,
                                                            link: item.link,
                                                            code: item.code || item.promoCode,
                                                            description: item.description || item.caption,
                                                            discount: item.discount,
                                                            isLocked: item.isLocked,
                                                            price: item.price
                                                        }}
                                                        className="h-full w-full"
                                                        showFullDetails={item._source === 'global' || true}
                                                        onEdit={item._source === 'custom' ? () => handleOpenEdit(item.currentRealIndex) : undefined}
                                                        onDelete={item._source === 'custom' ? () => removeBanner(item.currentRealIndex) : undefined}
                                                        onToggleFavorite={() => toggleFavorite(item)}
                                                        isFavorite={isGlobalFavorite(item._id)}
                                                        onUnlock={item._source === 'global' ? handleUnlock : undefined}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        };

                        // Logic to Display Sections based on Tab
                        return (
                            <>
                                {/* Tab: All or Codes -> Show Codes Section */}
                                {(activeTab === 'all' || activeTab === 'codes') &&
                                    renderSection("My Promo Codes", customCodes, <Ticket size={24} />, true)
                                }

                                {/* Tab: All or Deals -> Show Deals Section */}
                                {(activeTab === 'all' || activeTab === 'deals') &&
                                    renderSection("My Direct Deals", customDeals, <Megaphone size={24} />, activeTab === 'deals') // Show add button in deals tab too if empty? Or just rely on Codes section having it in All view. Let's show it in Deals tab if active.
                                }

                                {/* Tab: Favorites -> Show Favorites Section */}
                                {activeTab === 'favorites' &&
                                    renderSection("My Favorites", filteredFavorites, <Heart size={24} />)
                                }

                                {/* Tab: All -> Show Global Offers (if Premium) */}
                                {(activeTab === 'all') && canViewGlobal &&
                                    renderSection("Explore Global Offers", allGlobal.filter(g => !g.isLocked), <Globe size={24} />)
                                }

                                {/* Empty State Fallback for Tabs */}
                                {((activeTab === 'codes' && customCodes.length === 0) ||
                                    (activeTab === 'deals' && customDeals.length === 0) ||
                                    (activeTab === 'favorites' && filteredFavorites.length === 0)) && (
                                        <div className="offers-empty-state">
                                            <div className="offers-empty-icon">
                                                <Globe size={24} />
                                            </div>
                                            <h3 className="offers-empty-title">No offers found</h3>
                                            <p className="offers-empty-text">Try adding a new offer to this section.</p>
                                        </div>
                                    )}
                            </>
                        );
                    })()}
                </div>

                {/* Premium Banner for restricted users in Filtered Tabs? */}
                {user?.plan !== 'premium' && user?.role !== 'master_admin' && (activeTab === 'favorites' || activeTab === 'all') && (
                    <div className="premium-upgrade-banner">
                        <p className="premium-banner-text-sm">Want access to our Global Offers Library?</p>
                        <p className="premium-banner-title">Upgrade to Premium to unlock hundreds of ready-to-use offers</p>
                        <a href="/membership" className="premium-upgrade-btn">View Plans</a>
                    </div>
                )}
            </div>

            <div className="sticky bottom-4 z-20 mt-8 flex justify-end">
                <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="btn btn-primary px-8 py-3 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 border-none"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            {/* INTERNAL MODAL */}
            {isModalOpen && (
                <div className="offer-modal-overlay">
                    <div className="offer-modal-content">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    {editingIndex !== null ? <Edit size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                                    {editingIndex !== null ? 'Edit Banner' : 'Create New Banner'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Add details for your promotional banner</p>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                            {/* Visibility Toggle */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                <span className="font-medium text-gray-900 dark:text-white">Banner Visibility</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="toggle-checkbox"
                                        checked={tempBanner.isVisible}
                                        onChange={(e) => setTempBanner({ ...tempBanner, isVisible: e.target.checked })}
                                    />
                                    <div className="toggle-slider"></div>
                                </label>
                            </div>

                            {/* Title */}
                            <div className="form-group">
                                <label className="label-premium">Banner Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={tempBanner.title}
                                    onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                                    placeholder="e.g. Summer Sale 2024"
                                />
                            </div>

                            {/* Banner Image Selection */}
                            <div className="form-group">
                                <label className="label-premium mb-3 block">Banner Image</label>
                                <div className="upload-zone group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full cursor-pointer z-20 opacity-0"
                                        disabled={uploading}
                                    />

                                    {tempBanner.imageUrl ? (
                                        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-inner">
                                            <img src={tempBanner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                                                    <Image size={18} /> Change Image
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-40 flex flex-col items-center justify-center text-gray-400 relative">
                                            {uploading ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-16 h-16 mb-3">
                                                        <div className="upload-pulse-ring"></div>
                                                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                                        <Image size={24} className="absolute inset-0 m-auto text-blue-500" />
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-500 animate-pulse">Uploading Image...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform">
                                                        <Image size={28} />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                                        Click to upload banner image
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max 2MB)</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-gray-500 hover:text-blue-600 font-medium list-none flex items-center gap-1 w-max">
                                            <LinkIcon size={12} /> Or paste direct image URL
                                        </summary>
                                        <div className="mt-2 animate-in slide-in-from-top-1">
                                            <input
                                                type="text"
                                                className="input-premium pl-3 text-xs py-2 h-9"
                                                value={tempBanner.imageUrl}
                                                onChange={(e) => setTempBanner({ ...tempBanner, imageUrl: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </details>
                                </div>
                            </div>

                            {/* Link */}
                            <div className="form-group">
                                <label className="label-premium">Destination Link</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="input-premium pl-10"
                                        value={tempBanner.link}
                                        onChange={(e) => setTempBanner({ ...tempBanner, link: e.target.value })}
                                        placeholder="https://yourstore.com/offer"
                                    />
                                    <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Promo Code */}
                                <div className="form-group">
                                    <label className="label-premium">Promo Code</label>
                                    <div className="relative group">
                                        <input
                                            type={showPromo ? "text" : "password"}
                                            className="input-premium pl-10 pr-10 font-mono tracking-wider transition-all duration-300 ease-in-out"
                                            value={tempBanner.promoCode}
                                            onChange={(e) => setTempBanner({ ...tempBanner, promoCode: e.target.value })}
                                            placeholder="SAVE20"
                                        />
                                        <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                            <Ticket size={18} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPromo(!showPromo)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                                        >
                                            {showPromo ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="form-group">
                                    <label className="label-premium">Tags (comma separated)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="input-premium pl-10"
                                            value={Array.isArray(tempBanner.tags) ? tempBanner.tags.join(', ') : tempBanner.tags}
                                            onChange={(e) => setTempBanner({ ...tempBanner, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                            placeholder="sale, limited, new"
                                        />
                                        <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="form-group">
                                <label className="label-premium">Caption / Description</label>
                                <textarea
                                    rows="3"
                                    className="input-premium min-h-[80px]"
                                    value={tempBanner.caption}
                                    onChange={(e) => setTempBanner({ ...tempBanner, caption: e.target.value })}
                                    placeholder="Add a short description or terms for this offer..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-gray-900 sticky bottom-0 z-10">
                            <button onClick={handleCloseModal} className="btn btn-ghost px-6 bg-gray-100/50 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleSaveBanner} className="btn btn-primary px-8 shadow-lg shadow-blue-500/20">
                                {editingIndex !== null ? 'Save Changes' : 'Create Banner'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOffers;
