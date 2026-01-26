import React, { useState } from 'react';
import { Plus, X, Edit, Image, Link as LinkIcon, Zap, Activity, Box, Briefcase, Calendar, Camera, CheckCircle, Clock, Code, Cpu, Database, File, Globe, Heart, Home, Layers, Layout, Lock, Mail, Map, MessageCircle, Music, PenTool, Search, Settings, Shield, Smartphone, Star, Sun, Table, Terminal, Truck, User, Video, Wifi, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';

const ICON_LIST = [
    'Zap', 'Activity', 'Box', 'Briefcase', 'Calendar', 'Camera', 'CheckCircle', 'Clock', 'Code', 'Cpu',
    'Database', 'File', 'Globe', 'Heart', 'Home', 'Image', 'Layers', 'Layout', 'Link', 'Lock',
    'Mail', 'Map', 'MessageCircle', 'Music', 'PenTool', 'Search', 'Settings', 'Shield', 'Smartphone',
    'Star', 'Sun', 'Table', 'Terminal', 'Truck', 'User', 'Video', 'Wifi'
];

const CustomToolModal = ({
    isOpen,
    onClose,
    tempTool,
    setTempTool,
    onSave,
    handleImageUpload,
    uploading
}) => {
    if (!isOpen) return null;

    const [showIconSelector, setShowIconSelector] = useState(false);

    const SelectIcon = ({ iconName }) => {
        const Icon = Icons[iconName] || Icons.Box;
        return <Icon size={24} />;
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title flex items-center gap-2">
                        <Plus size={24} className="text-blue-500" /> Add Custom Tool
                    </h3>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto" style={{ padding: '0.5rem 0' }}>
                    {/* Logo Upload & Icon Selection Area */}
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-center">
                            <div className={`relative w-28 h-28 rounded-3xl overflow-hidden transition-all duration-500 ${uploading ? 'scale-95' : 'hover:scale-105'} ${tempTool.image || tempTool.icon ? 'shadow-xl' : 'border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'}`}>

                                {/* Loading Overlay */}
                                {uploading && (
                                    <div className="absolute inset-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                                        <div className="relative w-12 h-12">
                                            <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-500 mt-2 uppercase tracking-widest">Uploading</span>
                                    </div>
                                )}

                                {tempTool.image ? (
                                    <div className="relative w-full h-full group">
                                        <img src={tempTool.image} alt="Tool Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setTempTool({ ...tempTool, image: '' });
                                                }}
                                                className="bg-white/20 backdrop-blur-md hover:bg-red-500 text-white p-2 rounded-full transition-all hover:scale-110"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : tempTool.icon ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 group relative">
                                        <SelectIcon iconName={tempTool.icon} />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setTempTool({ ...tempTool, icon: '' });
                                            }}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md p-1 rounded-full text-blue-600 dark:text-blue-400 hover:bg-red-500 hover:text-white"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <div className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-sm">
                                            <Image size={24} />
                                        </div>
                                        <span className="text-[10px] font-medium">Logo or Icon</span>
                                    </div>
                                )}

                                {/* Hover Upload Trigger (Invisible) */}
                                {!tempTool.image && !tempTool.icon && !uploading && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full cursor-pointer z-20 opacity-0"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Choice Controls */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full max-w-[280px]">
                                <button
                                    onClick={() => setShowIconSelector(false)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${!showIconSelector ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                                >
                                    <Image size={14} /> Upload Image
                                </button>
                                <button
                                    onClick={() => setShowIconSelector(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${showIconSelector ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                                >
                                    <Zap size={14} /> Use Icon
                                </button>
                            </div>

                            {!tempTool.image && !tempTool.icon && !showIconSelector && (
                                <p className="text-[10px] text-gray-400 text-center animate-pulse">
                                    Click the box above to upload a square logo
                                </p>
                            )}
                        </div>

                        {/* Icon Selection Modal/Grid */}
                        {showIconSelector && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Library Icons</span>
                                    <button onClick={() => setShowIconSelector(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-6 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                    {ICON_LIST.map(icon => {
                                        const Icon = Icons[icon];
                                        return (
                                            <button
                                                key={icon}
                                                onClick={() => {
                                                    setTempTool({ ...tempTool, icon: icon, image: '' });
                                                    setShowIconSelector(false);
                                                }}
                                                className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${tempTool.icon === icon ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600'}`}
                                            >
                                                <Icon size={18} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Tool Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="input-premium"
                            value={tempTool.title}
                            onChange={(e) => setTempTool({ ...tempTool, title: e.target.value })}
                            placeholder="e.g. My SaaS Tool"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Category</label>
                        <div className="relative">
                            <input
                                list="category-suggestions"
                                type="text"
                                className="input-premium"
                                value={tempTool.category}
                                onChange={(e) => setTempTool({ ...tempTool, category: e.target.value })}
                                placeholder="Select or type custom category..."
                            />
                            <datalist id="category-suggestions">
                                <option value="Productivity" />
                                <option value="Design" />
                                <option value="Development" />
                                <option value="Marketing" />
                                <option value="Writing" />
                                <option value="Finance" />
                                <option value="Social Media" />
                                <option value="Other" />
                            </datalist>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Website URL</label>
                        <div className="relative" style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-premium pl-10"
                                value={tempTool.url}
                                onChange={(e) => setTempTool({ ...tempTool, url: e.target.value })}
                                placeholder="https://..."
                            />
                            <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
                                <LinkIcon size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Description</label>
                        <textarea
                            className="input-premium min-h-[100px]"
                            value={tempTool.description}
                            onChange={(e) => setTempTool({ ...tempTool, description: e.target.value })}
                            placeholder="Briefly describe what this tool does..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="btn btn-ghost px-6">Cancel</button>
                    <button onClick={onSave} className="btn btn-primary px-8">Save Tool</button>
                </div>
            </div>
        </div>
    );
};

export default CustomToolModal;
