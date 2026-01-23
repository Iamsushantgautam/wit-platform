import React, { useState } from 'react';
import { Plus, X, Edit, Image, Link as LinkIcon, Ticket, Tag, EyeOff, Eye, AlignLeft } from 'lucide-react';
import '../../styles/Offers.css';

const BannerModal = ({
    isOpen,
    onClose,
    tempBanner,
    setTempBanner,
    onSave,
    handleImageUpload,
    uploading,
    isEdit
}) => {
    const [showPromo, setShowPromo] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            {isEdit ? <Edit size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                            {isEdit ? 'Edit Banner' : 'Create New Banner'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Add details for your promotional banner</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* Toggle Visibility */}
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

                        {/* Upload/Preview Area */}
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full cursor-pointer z-10"
                                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
                                disabled={uploading}
                            />

                            {tempBanner.imageUrl ? (
                                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-inner">
                                    <img src={tempBanner.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                                            <Image size={18} /> Change Image
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                    {uploading ? (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16 mb-3">
                                                <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                                <Image size={24} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
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

                        {/* URL fallback */}
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
                        <div className="relative" style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-premium pl-10"
                                value={tempBanner.link}
                                onChange={(e) => setTempBanner({ ...tempBanner, link: e.target.value })}
                                placeholder="https://yourstore.com/offer"
                            />
                            <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                <LinkIcon size={18} />
                            </div>
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
                            <div className="relative" style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="input-premium pl-10"
                                    value={Array.isArray(tempBanner.tags) ? tempBanner.tags.join(', ') : tempBanner.tags}
                                    onChange={(e) => setTempBanner({ ...tempBanner, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                                    placeholder="sale, limited, new"
                                />
                                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                    <Tag size={18} />
                                </div>
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
                    <button onClick={onClose} className="btn btn-ghost px-6">Cancel</button>
                    <button onClick={onSave} className="btn btn-primary px-8">
                        {isEdit ? 'Save Changes' : 'Create Banner'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerModal;
