import React from 'react';
import { Plus, X, Edit, Image, Link as LinkIcon } from 'lucide-react';

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
                    {/* Logo Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full cursor-pointer z-20"
                                style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20 }}
                                disabled={uploading}
                            />
                            {tempTool.image ? (
                                <div className="relative w-full h-full">
                                    <img src={tempTool.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <Edit size={16} className="text-white" />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center gap-1 pointer-events-none">
                                    {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div> : <Image size={32} />}
                                    <span className="text-[10px]">Logo</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Upload tool logo (Square recommended)</p>
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
                        <select
                            className="input-premium"
                            value={tempTool.category}
                            onChange={(e) => setTempTool({ ...tempTool, category: e.target.value })}
                        >
                            <option value="Productivity">Productivity</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Writing">Writing</option>
                            <option value="Other">Other</option>
                        </select>
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
