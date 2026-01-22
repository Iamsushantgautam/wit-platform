import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Menu } from 'lucide-react';

const CustomPagesTab = ({ pages, menu, addOrUpdatePage, deletePage, startEditPage, cancelEditPage, editingPage, pageForm, setPageForm, updateMenu, saving }) => {
    const [showMenuEditor, setShowMenuEditor] = useState(false);
    const [menuItems, setMenuItems] = useState(menu || []);

    const defaultMenuItems = [
        { label: 'Profile', target: 'profile', icon: 'User', isVisible: true, order: 0 },
        { label: 'Offers', target: 'offers', icon: 'Gift', isVisible: true, order: 1 },
        { label: 'Links', target: 'links', icon: 'Link', isVisible: true, order: 2 },
        { label: 'Updates', target: 'updates', icon: 'Bell', isVisible: true, order: 3 }
    ];

    const handleMenuSave = () => {
        updateMenu(menuItems);
        setShowMenuEditor(false);
    };

    const addMenuItem = () => {
        setMenuItems([...menuItems, { label: '', target: '', icon: 'Menu', isVisible: true, order: menuItems.length }]);
    };

    const removeMenuItem = (index) => {
        setMenuItems(menuItems.filter((_, i) => i !== index));
    };

    const updateMenuItem = (index, field, value) => {
        const updated = [...menuItems];
        updated[index][field] = value;
        setMenuItems(updated);
    };

    return (
        <div>
            <h2 className="dashboard-section-title">
                <FileText size={26} />
                Custom Pages & Menu
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create custom pages and manage your profile menu items
            </p>

            {/* Menu Editor Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Menu size={20} />
                        Menu Configuration
                    </h3>
                    <button
                        onClick={() => setShowMenuEditor(!showMenuEditor)}
                        className="btn btn-outline px-4 py-2"
                    >
                        {showMenuEditor ? 'Cancel' : 'Edit Menu'}
                    </button>
                </div>

                {showMenuEditor && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage menu items that appear on your public profile
                        </p>

                        {menuItems.map((item, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                                    placeholder="Label"
                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                                />
                                <input
                                    type="text"
                                    value={item.target}
                                    onChange={(e) => updateMenuItem(index, 'target', e.target.value)}
                                    placeholder="Target (page/offers/links/updates)"
                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                                />
                                <button
                                    onClick={() => updateMenuItem(index, 'isVisible', !item.isVisible)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                    onClick={() => removeMenuItem(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        <div className="flex gap-3">
                            <button onClick={addMenuItem} className="btn btn-outline px-4 py-2">
                                <Plus size={18} /> Add Menu Item
                            </button>
                            <button onClick={handleMenuSave} className="btn btn-primary px-6 py-2">
                                Save Menu
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Page Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                    {editingPage ? 'Edit Page' : 'Create New Page'}
                </h3>

                <form onSubmit={addOrUpdatePage} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Page Title *
                        </label>
                        <input
                            type="text"
                            value={pageForm.title}
                            onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                            placeholder="e.g., About Me, Portfolio, Blog"
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Will be converted to URL: /u/yourname/{pageForm.title.toLowerCase().replace(/\s+/g, '-')}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Page Content *
                        </label>
                        <textarea
                            value={pageForm.content}
                            onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                            placeholder="Write your page content here..."
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                            rows="8"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary px-6 py-2.5"
                        >
                            {saving ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
                        </button>
                        {editingPage && (
                            <button
                                type="button"
                                onClick={cancelEditPage}
                                className="btn btn-outline px-6 py-2.5"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Pages List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Custom Pages ({pages.length})</h3>

                {pages.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700">
                        <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No custom pages yet. Create your first page!</p>
                    </div>
                ) : (
                    pages.map((page) => (
                        <div
                            key={page._id}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                                        {page.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        URL: /u/yourname/{page.slug}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                        {page.content}
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => startEditPage(page)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => deletePage(page._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomPagesTab;
