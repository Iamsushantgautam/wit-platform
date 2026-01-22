import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Palette, Plus, Trash2, Eye, EyeOff, GripVertical,
    Save, CheckCircle, Sparkles, Monitor, Tablet, Smartphone
} from 'lucide-react';
import '../styles/ProfileCustomizer.css';

const ProfileCustomizer = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Customization data
    const [theme, setTheme] = useState({
        primaryColor: '#2563eb',
        accentColor: '#8b5cf6',
        fontFamily: 'Inter',
        darkMode: false
    });
    const [sections, setSections] = useState([]);
    const [menuVisible, setMenuVisible] = useState(true);
    const [isDraft, setIsDraft] = useState(false);
    const [publishedAt, setPublishedAt] = useState(null);

    // UI state
    const [selectedSection, setSelectedSection] = useState(null);
    const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile
    const [templates, setTemplates] = useState([]);
    const [showTemplates, setShowTemplates] = useState(false);

    const fontOptions = ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 'Lato'];

    useEffect(() => {
        fetchCustomization();
        fetchTemplates();
    }, []);

    const fetchCustomization = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/profiles/customize`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTheme(data.theme);
            setSections(data.layout.sections.sort((a, b) => a.order - b.order));
            setMenuVisible(data.layout.menuVisible);
            setIsDraft(data.isDraft);
            setPublishedAt(data.publishedAt);
        } catch (error) {
            console.error('Error fetching customization:', error);
            setMessage({ type: 'error', text: 'Failed to load customization data' });
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/profiles/customize/templates`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const updateTheme = async (updates) => {
        const newTheme = { ...theme, ...updates };
        setTheme(newTheme);

        try {
            await axios.post(`${API_URL}/profiles/customize/theme`, newTheme, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    };

    const addSection = async (template) => {
        try {
            const { data } = await axios.post(
                `${API_URL}/profiles/customize/sections/add`,
                {
                    type: template.type,
                    title: template.name,
                    content: template.defaultContent
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSections(data.sections.sort((a, b) => a.order - b.order));
            setShowTemplates(false);
            setMessage({ type: 'success', text: `${template.name} added successfully!` });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error adding section:', error);
            setMessage({ type: 'error', text: 'Failed to add section' });
        }
    };

    const updateSection = async (sectionId, updates) => {
        try {
            const { data } = await axios.put(
                `${API_URL}/profiles/customize/sections/${sectionId}`,
                updates,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSections(data.sections.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    const deleteSection = async (sectionId) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;

        try {
            const { data } = await axios.delete(
                `${API_URL}/profiles/customize/sections/${sectionId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSections(data.sections.sort((a, b) => a.order - b.order));
            if (selectedSection?.id === sectionId) setSelectedSection(null);
            setMessage({ type: 'success', text: 'Section deleted successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const toggleSectionVisibility = async (section) => {
        await updateSection(section.id, { isVisible: !section.isVisible });
    };

    const publishProfile = async () => {
        setSaving(true);
        try {
            const { data } = await axios.post(
                `${API_URL}/profiles/customize/publish`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setIsDraft(false);
            setPublishedAt(data.publishedAt);
            setMessage({ type: 'success', text: 'Profile published successfully! 🎉' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error publishing profile:', error);
            setMessage({ type: 'error', text: 'Failed to publish profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="customizer-loading">
                <div className="spinner"></div>
                <p>Loading customization tools...</p>
            </div>
        );
    }

    return (
        <div className="profile-customizer">
            {message && (
                <div className={`customizer-message ${message.type}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Header */}
            <div className="customizer-header">
                <div>
                    <h2 className="customizer-title">
                        <Palette size={24} />
                        Customize Your Profile
                    </h2>
                    <p className="customizer-subtitle">
                        {isDraft ? '📝 Draft - Not published yet' : `✅ Published ${publishedAt ? new Date(publishedAt).toLocaleDateString() : ''}`}
                    </p>
                </div>
                <button
                    onClick={publishProfile}
                    disabled={saving}
                    className="btn btn-primary customizer-publish-btn"
                >
                    {saving ? 'Publishing...' : 'Publish Profile'}
                </button>
            </div>

            <div className="customizer-layout">
                {/* Left Panel - Theme & Sections */}
                <aside className="customizer-sidebar">
                    {/* Theme Editor */}
                    <div className="customizer-panel">
                        <h3 className="panel-title">🎨 Theme Settings</h3>

                        <div className="theme-control">
                            <label>Primary Color</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    value={theme.primaryColor}
                                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                                    className="color-input"
                                />
                                <input
                                    type="text"
                                    value={theme.primaryColor}
                                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                                    className="color-text-input"
                                />
                            </div>
                        </div>

                        <div className="theme-control">
                            <label>Accent Color</label>
                            <div className="color-input-wrapper">
                                <input
                                    type="color"
                                    value={theme.accentColor}
                                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                                    className="color-input"
                                />
                                <input
                                    type="text"
                                    value={theme.accentColor}
                                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                                    className="color-text-input"
                                />
                            </div>
                        </div>

                        <div className="theme-control">
                            <label>Font Family</label>
                            <select
                                value={theme.fontFamily}
                                onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                                className="font-select"
                            >
                                {fontOptions.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                        </div>

                        <div className="theme-control">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={theme.darkMode}
                                    onChange={(e) => updateTheme({ darkMode: e.target.checked })}
                                />
                                Dark Mode
                            </label>
                        </div>
                    </div>

                    {/* Section Manager */}
                    <div className="customizer-panel">
                        <div className="panel-header">
                            <h3 className="panel-title">📦 Sections</h3>
                            <button
                                onClick={() => setShowTemplates(!showTemplates)}
                                className="btn-small btn-outline"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>

                        {showTemplates && (
                            <div className="templates-list">
                                {templates.map(template => (
                                    <button
                                        key={template.type}
                                        onClick={() => addSection(template)}
                                        className="template-item"
                                    >
                                        <Sparkles size={16} />
                                        <div>
                                            <div className="template-name">{template.name}</div>
                                            <div className="template-desc">{template.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="sections-list">
                            {sections.map(section => (
                                <div
                                    key={section.id}
                                    className={`section-item ${selectedSection?.id === section.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSection(section)}
                                >
                                    <GripVertical size={16} className="section-drag" />
                                    <div className="section-info">
                                        <span className="section-title">{section.title}</span>
                                        <span className="section-type">{section.type}</span>
                                    </div>
                                    <div className="section-actions">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSectionVisibility(section);
                                            }}
                                            className="icon-btn"
                                            title={section.isVisible ? 'Hide' : 'Show'}
                                        >
                                            {section.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteSection(section.id);
                                            }}
                                            className="icon-btn icon-btn-danger"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center - Live Preview */}
                <main className="customizer-preview">
                    <div className="preview-toolbar">
                        <div className="device-toggle">
                            <button
                                className={previewDevice === 'desktop' ? 'active' : ''}
                                onClick={() => setPreviewDevice('desktop')}
                            >
                                <Monitor size={18} />
                            </button>
                            <button
                                className={previewDevice === 'tablet' ? 'active' : ''}
                                onClick={() => setPreviewDevice('tablet')}
                            >
                                <Tablet size={18} />
                            </button>
                            <button
                                className={previewDevice === 'mobile' ? 'active' : ''}
                                onClick={() => setPreviewDevice('mobile')}
                            >
                                <Smartphone size={18} />
                            </button>
                        </div>
                        <a
                            href={`/u/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-small btn-outline"
                        >
                            Open Live Page
                        </a>
                    </div>

                    <div className={`preview-frame preview-${previewDevice}`}>
                        <iframe
                            src={`/u/${user.username}?preview=true`}
                            title="Profile Preview"
                            className="preview-iframe"
                        />
                    </div>
                </main>

                {/* Right Panel - Section Editor */}
                {selectedSection && (
                    <aside className="customizer-editor">
                        <div className="editor-header">
                            <h3>Edit {selectedSection.title}</h3>
                            <button onClick={() => setSelectedSection(null)} className="icon-btn">
                                ×
                            </button>
                        </div>

                        <div className="editor-content">
                            <div className="form-group">
                                <label>Section Title</label>
                                <input
                                    type="text"
                                    value={selectedSection.title}
                                    onChange={(e) => {
                                        setSelectedSection({ ...selectedSection, title: e.target.value });
                                        updateSection(selectedSection.id, { title: e.target.value });
                                    }}
                                    className="input-premium"
                                />
                            </div>

                            {/* Dynamic content editor based on section type */}
                            {selectedSection.type === 'hero' && (
                                <>
                                    <div className="form-group">
                                        <label>Heading</label>
                                        <input
                                            type="text"
                                            value={selectedSection.content.heading || ''}
                                            onChange={(e) => {
                                                const newContent = { ...selectedSection.content, heading: e.target.value };
                                                setSelectedSection({ ...selectedSection, content: newContent });
                                                updateSection(selectedSection.id, { content: newContent });
                                            }}
                                            className="input-premium"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subheading</label>
                                        <textarea
                                            value={selectedSection.content.subheading || ''}
                                            onChange={(e) => {
                                                const newContent = { ...selectedSection.content, subheading: e.target.value };
                                                setSelectedSection({ ...selectedSection, content: newContent });
                                                updateSection(selectedSection.id, { content: newContent });
                                            }}
                                            className="input-premium"
                                            rows="3"
                                        />
                                    </div>
                                </>
                            )}

                            {selectedSection.type === 'about' && (
                                <div className="form-group">
                                    <label>Bio Text</label>
                                    <textarea
                                        value={selectedSection.content.text || ''}
                                        onChange={(e) => {
                                            const newContent = { ...selectedSection.content, text: e.target.value };
                                            setSelectedSection({ ...selectedSection, content: newContent });
                                            updateSection(selectedSection.id, { content: newContent });
                                        }}
                                        className="input-premium"
                                        rows="6"
                                    />
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default ProfileCustomizer;
