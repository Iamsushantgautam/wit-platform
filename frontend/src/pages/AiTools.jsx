import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, ExternalLink, Wrench } from 'lucide-react';
import '../styles/Blocks/AiTools.css';

const AiTools = () => {
    const { API_URL } = useContext(AuthContext);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/tools`);
                // Filter to show only tools (exclude prompts)
                setTools(data.filter(t => t.type !== 'prompt'));
            } catch (error) {
                console.error('Error fetching tools', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTools();
    }, [API_URL]);

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="tools-page">
            {/* Ambient Background */}
            <div className="tools-ambient">
                <div className="tools-ambient-blob tools-ambient-blob--left" />
                <div className="tools-ambient-blob tools-ambient-blob--right" />
            </div>

            <div className="tools-container">
                {/* Hero Section */}
                <section className="tools-hero">
                    <h1 className="tools-hero-title">
                        AI Tools <span className="tools-hero-title-accent">Registry</span>
                    </h1>
                    <p className="tools-hero-subtitle">
                        Discover the world's most powerful AI tools to automate your workflow
                        and unlock new creative possibilities
                    </p>
                </section>

                {/* Search Section */}
                <div className="tools-search-wrapper">
                    <div className="tools-search-container">
                        <Search className="tools-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, category, or functionality..."
                            className="tools-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="tools-loading">
                        <div className="tools-loading-spinner" />
                        <p className="tools-loading-text">Loading AI tools...</p>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="tools-results-header">
                            <h2 className="tools-results-count">
                                Displaying {filteredTools.length} curated {filteredTools.length === 1 ? 'tool' : 'tools'}
                            </h2>
                        </div>

                        {/* Tools Grid */}
                        {filteredTools.length > 0 ? (
                            <div className="tools-grid">
                                {filteredTools.map((tool) => (
                                    <article key={tool._id} className="tool-card">
                                        <div className="tool-card-header">
                                            <div className="tool-card-logo">
                                                {tool.logo ? (
                                                    <img src={tool.logo} alt={tool.name} />
                                                ) : (
                                                    <Wrench className="tool-card-logo-icon" size={24} />
                                                )}
                                            </div>
                                            <div className="tool-card-info">
                                                <h3 className="tool-card-title">{tool.name}</h3>
                                                <span className="tool-card-category">
                                                    {tool.category || 'AI Tool'}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="tool-card-description">
                                            {tool.description}
                                        </p>

                                        <div className="tool-card-action">
                                            <a
                                                href={tool.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="tool-card-btn"
                                            >
                                                Visit Website
                                                <ExternalLink size={18} className="tool-card-btn-icon" />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="tools-empty">
                                <div className="tools-empty-icon">
                                    <Search size={40} />
                                </div>
                                <h3 className="tools-empty-title">No tools found</h3>
                                <p className="tools-empty-text">
                                    We couldn't find any tools matching{' '}
                                    <span className="tools-empty-highlight">"{searchTerm}"</span>.
                                    Try adjusting your search terms.
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="tools-empty-btn"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AiTools;
