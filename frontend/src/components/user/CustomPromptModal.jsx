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
                    {/* Image Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-full h-48 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full cursor-pointer z-20"
                                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20 }}
                                disabled={uploading}
                            />
                            {tempPrompt.image ? (
                                <div className="relative w-full h-full">
                                    <img src={tempPrompt.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <Edit size={24} className="text-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center gap-1 pointer-events-none">
                                    {uploading ? <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div> : <Image size={40} />}
                                    <span className="text-sm">Upload Prompt Preview Image</span>
                                </div>
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

                    <div className="form-group">
                        <label className="label-premium">Category</label>
                        <select
                            className="input-premium"
                            value={tempPrompt.category}
                            onChange={(e) => setTempPrompt({ ...tempPrompt, category: e.target.value })}
                        >
                            <option value="General">General</option>
                            <option value="Photography">Photography</option>
                            <option value="Art">Art</option>
                            <option value="Coding">Coding</option>
                            <option value="Writing">Writing</option>
                            <option value="Business">Business</option>
                        </select>
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
