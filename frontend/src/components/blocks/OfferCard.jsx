import React from 'react';
import { Ticket, Edit, Trash2, Image, EyeOff, ChevronRight } from 'lucide-react';
import '../../styles/Offers.css';

const OfferCard = ({ banner, onEdit, onDelete }) => {
    return (
        <div className={`relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-none transition-all duration-300 flex flex-col overflow-hidden group ${!banner.isVisible ? 'opacity-70 grayscale-[0.5]' : ''}`}>

            {/* Image Area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                        <Image size={48} />
                    </div>
                )}

                {/* Admin Overlay */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 ${!banner.isVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform shadow-xl"
                        title="Edit Banner"
                    >
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-xl"
                        title="Delete Banner"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Badges */}
                {banner.promoCode && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-gray-900 dark:text-white text-xs font-bold font-mono px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <Ticket size={12} className="text-blue-500" />
                            {banner.promoCode}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                    <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2 leading-tight">
                        {banner.title || 'Untitled Offer'}
                    </h4>
                    {banner.caption && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 hidden group-hover:block transition-all animate-in fade-in">
                            {banner.caption}
                        </p>
                    )}
                </div>

                <div className="flex justify-end mt-4 items-center">
                    <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1 group/btn hover:gap-2 transition-all">
                        View <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
