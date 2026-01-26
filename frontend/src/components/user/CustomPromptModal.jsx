import React from 'react';
import { Plus, X, Edit, Image } from 'lucide-react';

const CustomPromptModal = ({
    isOpen,
    onClose,
    tempPrompt,
    setTempPrompt,
    onSave,
    handleImageUpload,
    uploading
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 50 }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title flex items-center gap-2">
                        <Plus size={24} className="text-purple-500" /> Add Custom Prompt
                    </h3>
                    <button onClick={onClose} className="btn-close">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto" style={{ padding: '0.5rem 0' }}>
                    {/* Image Upload Area */}
                    <div className="flex flex-col gap-4">
                        <div className={`relative w-full h-56 rounded-[2rem] overflow-hidden transition-all duration-500 ${uploading ? 'scale-[0.98]' : 'hover:scale-[1.01]'} ${tempPrompt.image ? 'shadow-2xl' : 'border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'}`}>

                            {/* Loading Overlay */}
                            {uploading && (
                                <div className="absolute inset-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse">
                                    <div className="relative w-14 h-14">
                                        <div className="absolute inset-0 border-4 border-purple-100 dark:border-purple-900/30 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <span className="text-xs font-black text-purple-600 mt-3 uppercase tracking-widest">Uploading Library Asset</span>
                                </div>
                            )}

                            {tempPrompt.image ? (
                                <div className="relative w-full h-full group">
                                    <img src={tempPrompt.image} alt="Prompt Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setTempPrompt({ ...tempPrompt, image: '' });
                                                }}
                                                className="bg-white/20 backdrop-blur-md hover:bg-red-500 text-white p-3 rounded-2xl transition-all hover:scale-110 flex items-center gap-2 font-bold text-sm"
                                            >
                                                <X size={18} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                    <div className="p-4 bg-white dark:bg-gray-700 rounded-3xl shadow-sm">
                                        <Image size={32} className="text-purple-500" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-sm font-bold block text-gray-700 dark:text-gray-300">Prompt Preview Image</span>
                                        <span className="text-[10px] uppercase tracking-wider">Recommended: 16:9 Aspect Ratio</span>
                                    </div>
                                </div>
                            )}

                            {/* Hover Upload Trigger (Invisible) */}
                            {!tempPrompt.image && !uploading && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full cursor-pointer z-20 opacity-0"
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Prompt Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="input-premium"
                            value={tempPrompt.title}
                            onChange={(e) => setTempPrompt({ ...tempPrompt, title: e.target.value })}
                            placeholder="e.g. Cyberpunk Cityscape"
                        />
                    </div>



                    <div className="flex gap-4">
                        <div className="form-group flex-1">
                            <label className="label-premium">Category</label>
                            <select
                                className="input-premium"
                                value={tempPrompt.category}
                                onChange={(e) => setTempPrompt({ ...tempPrompt, category: e.target.value })}
                            >
                                <option value="General">General</option>
                                <option value="Photography">Photography</option>
                                <option value="Art">Art</option>
                                <option value="Gimini">Gimini</option>
                                <option value="ChatGPT">ChatGPT</option>
                                <option value="Midjourney">Midjourney</option>
                            </select>
                        </div>
                        <div className="form-group flex-1">
                            <label className="label-premium">Visibility</label>
                            <select
                                className="input-premium"
                                value={tempPrompt.visibility || 'public'}
                                onChange={(e) => setTempPrompt({ ...tempPrompt, visibility: e.target.value })}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Tags</label>
                        <input
                            type="text"
                            className="input-premium"
                            value={tempPrompt.tags}
                            onChange={(e) => setTempPrompt({ ...tempPrompt, tags: e.target.value })}
                            placeholder="e.g. ai, future, city (comma separated)"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-premium">Prompt Content <span className="text-red-500">*</span></label>
                        <textarea
                            className="input-premium min-h-[150px] font-mono text-sm"
                            value={tempPrompt.prompt}
                            onChange={(e) => setTempPrompt({ ...tempPrompt, prompt: e.target.value })}
                            placeholder="Enter the full prompt text here..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="btn btn-ghost px-6">Cancel</button>
                    <button onClick={onSave} disabled={uploading} className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed">
                        {uploading ? 'Uploading...' : 'Save Prompt'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPromptModal;
