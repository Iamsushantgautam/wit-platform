import React from 'react';
import {
    Megaphone, Star, Link as LinkIcon, Plus, Image, EyeOff,
    Tag, Ticket, AlignLeft, Edit, Trash2, Save
} from 'lucide-react';

const UserOffers = ({
    profileData,
    setProfileData,
    openAddBannerModal,
    openEditBannerModal,
    removeBanner,
    saveProfile,
    saving
}) => {
    return (
        <div className="offers-section">
            <h2 className="dashboard-section-title">
                <Megaphone className="text-accent" />
                <span>Offers & Banners</span>
            </h2>

            {/* Hero Offer Editor */}
            <div className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Star className="text-yellow-500 fill-yellow-500" size={20} />
                        Hero Offer Banner
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
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
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {profileData.heroOffer?.isVisible !== false ? 'Visible' : 'Hidden'}
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="label-premium">Banner Title</label>
                        <input
                            type="text"
                            className="input-premium font-bold"
                            value={profileData.heroOffer?.title || ''}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                heroOffer: { ...profileData.heroOffer, title: e.target.value }
                            })}
                            placeholder="e.g. 5-in-1 AI Viral Offer Pack"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-premium">Badge Text</label>
                        <input
                            type="text"
                            className="input-premium"
                            value={profileData.heroOffer?.badge || ''}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                heroOffer: { ...profileData.heroOffer, badge: e.target.value }
                            })}
                            placeholder="e.g. Limited Time Offer"
                        />
                    </div>
                    <div className="form-group md:col-span-2">
                        <label className="label-premium">Subtitle / Description</label>
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
                    <div className="form-group">
                        <label className="label-premium">Button Text</label>
                        <input
                            type="text"
                            className="input-premium"
                            value={profileData.heroOffer?.ctaText || ''}
                            onChange={(e) => setProfileData({
                                ...profileData,
                                heroOffer: { ...profileData.heroOffer, ctaText: e.target.value }
                            })}
                            placeholder="GRAB OFFER"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-premium">Button Link</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="input-premium pl-9"
                                value={profileData.heroOffer?.ctaLink || ''}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, ctaLink: e.target.value }
                                })}
                                placeholder="https://..."
                            />
                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="label-premium">Background Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                className="h-10 w-20 rounded cursor-pointer border-0 p-0"
                                value={profileData.heroOffer?.backgroundColor || '#1f2937'}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    heroOffer: { ...profileData.heroOffer, backgroundColor: e.target.value }
                                })}
                            />
                            <span className="text-sm text-gray-500 font-mono">
                                {profileData.heroOffer?.backgroundColor || '#1f2937'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Additional Banners</h3>
                <button type="button" onClick={openAddBannerModal} className="btn btn-outline flex items-center gap-2 py-2 px-4 rounded-xl">
                    <Plus size={18} /> Add Banner
                </button>
            </div>

            <div className="space-y-4">
                {(profileData.banners || []).map((banner, index) => (
                    <div key={index} className={`bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 group transition-all hover:shadow-md ${!banner.isVisible ? 'opacity-60' : ''}`}>
                        {/* Thumbnail */}
                        <div className="w-24 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700 relative">
                            {banner.imageUrl ? (
                                <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Image size={20} />
                                </div>
                            )}
                            {!banner.isVisible && (
                                <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center">
                                    <EyeOff size={16} className="text-gray-500" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{banner.title || 'Untitled Banner'}</h4>
                                {!banner.isVisible && <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-px rounded">Hidden</span>}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                {banner.tags && banner.tags.length > 0 && (
                                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                                        <Tag size={10} /> {banner.tags.length} tags
                                    </span>
                                )}
                                {banner.promoCode && (
                                    <span className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded text-xs border border-green-100 dark:border-green-900">
                                        <Ticket size={10} /> {banner.promoCode}
                                    </span>
                                )}
                                {banner.caption && (
                                    <span className="flex items-center gap-1 text-xs truncate max-w-[200px]" title={banner.caption}>
                                        <AlignLeft size={10} /> {banner.caption}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditBannerModal(index)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition" title="Edit">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => removeBanner(index)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {(!profileData.banners || profileData.banners.length === 0) && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                            <Megaphone size={24} className="text-gray-400" />
                        </div>
                        <p>No additional banners added yet.</p>
                        <button onClick={openAddBannerModal} className="text-blue-600 font-semibold hover:underline text-sm">Create your first banner</button>
                    </div>
                )}
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn btn-primary mt-10 px-8 py-3 w-full md:w-auto text-lg">
                <Save size={20} />
                {saving ? 'Saving...' : 'Save Offers'}
            </button>
        </div>
    );
};

export default UserOffers;
