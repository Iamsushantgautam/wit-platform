import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Copy, Check, Search, Share2, Bookmark } from 'lucide-react';
import { FaRobot } from 'react-icons/fa';
import '../styles/Prompts.css';

const PromptsLibrary = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [modalPrompt, setModalPrompt] = useState(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await axios.get(`${API_URL}/tools`);
                const promptItems = res.data.filter(t => t.type === 'prompt');
                setPrompts(promptItems);
            } catch (error) {
                console.error("Error fetching prompts", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchData = async () => {
            await fetchPrompts();
            if (user) {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const res = await axios.get(`${API_URL}/profiles/me`, config);
                    const favIds = (res.data.favoritesPrompts || []).map(p => p._id);
                    setFavorites(favIds);
                } catch (err) {
                    console.error('Error fetching favorites', err);
                }
            }
        };
        fetchData();
    }, [API_URL, user]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShare = (prompt) => {
        const shareData = {
            title: prompt.name || 'AI Prompt',
            text: prompt.prompt,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => console.error('Share failed', err));
        } else {
            navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            alert('Share text copied to clipboard');
        }
    };

    const toggleFavorite = async (prompt) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(
                `${API_URL}/profiles/favorites/prompt`,
                { toolId: prompt._id },
                config
            );
            const favIds = (res.data.favoritesPrompts || []).map(p => p._id);
            setFavorites(favIds);
        } catch (err) {
            console.error('Error toggling favorite', err);
            alert('Could not save to favourites');
        }
    };

    const filteredPrompts = prompts.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter || p.platform === filter;
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
        return matchesFilter && matchesSearch;
    });

    const uniqueCategories = ['All', ...new Set(prompts.map(p => p.category).filter(Boolean))];

    return (
        <div className="prompts-page">
            {/* Ambient background */}
            <div className="prompts-ambient">
                <div className="prompts-ambient-blob prompts-ambient-blob--left" />
                <div className="prompts-ambient-blob prompts-ambient-blob--right" />
            </div>

            <div className="prompts-inner">
                {/* Header */}
                <header className="prompts-header">
                    <h1 className="prompts-title">Prompts Library</h1>
                    <p className="prompts-subtitle">
                        Curated AI image prompts with rich visuals. Click any card to copy the exact prompt
                        and use it in your favourite model.
                    </p>
                </header>

                {/* Filters & search */}
                <section className="prompts-toolbar">
                    <div className="search-wrapper-premium w-full md:w-96">
                        <Search className="search-icon-premium" size={18} />
                        <input
                            type="text"
                            placeholder="Search prompts, tags, vibes..."
                            className="search-input-premium !bg-white/5 !border-white/20 !text-white placeholder-gray-500 focus:!border-purple-500/60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="prompts-filters">
                        {uniqueCategories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFilter(cat)}
                                className={
                                    'prompts-filter-pill' +
                                    (filter === cat ? ' prompts-filter-pill--active' : '')
                                }
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Grid */}
                {loading ? (
                    <div className="prompts-loading">
                        <div className="prompts-loading-spinner" />
                        <p className="prompts-loading-text">Scanning the library...</p>
                    </div>
                ) : filteredPrompts.length > 0 ? (
                    <div className="prompts-grid">
                        {filteredPrompts.map(prompt => {
                            const isFav = favorites.includes(prompt._id);
                            const words = (prompt.prompt || '').trim().split(/\s+/);
                            const isLong = words.length > 25;
                            const previewText = isLong
                                ? words.slice(0, 25).join(' ') + ' ...'
                                : prompt.prompt;

                            return (
                                <article
                                    key={prompt._id}
                                    className="prompt-card"
                                >
                                    <div className="prompt-image-wrap">
                                        <img
                                            src={prompt.logo}
                                            alt={prompt.name}
                                            className="prompt-image"
                                        />
                                        <div className="prompt-overlay" />

                                        <div className="prompt-top-row">
                                            <span className="prompt-chip">
                                                {prompt.name || 'Untitled Prompt'}
                                            </span>
                                            <div className="prompt-top-row-actions">
                                                {prompt.platform && (
                                                    <span className="prompt-chip prompt-chip--platform">
                                                        <FaRobot size={10} />
                                                        {prompt.platform}
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    className="prompt-icon-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(prompt);
                                                    }}
                                                    title="Share"
                                                >
                                                    <Share2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`prompt-icon-btn ${isFav ? 'prompt-icon-btn--saved' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(prompt);
                                                    }}
                                                    title={isFav ? 'Saved to favourites' : 'Save to favourites'}
                                                >
                                                    <Bookmark size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="prompt-body">
                                            <p className="prompt-text">
                                                Prompt: {previewText}
                                                {isLong && (
                                                    <button
                                                        type="button"
                                                        style={{
                                                            marginLeft: '0.25rem',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'underline',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#a855f7',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModalPrompt(prompt);
                                                        }}
                                                    >
                                                        more
                                                    </button>
                                                )}
                                            </p>
                                            <div className="prompt-footer">
                                                <button
                                                    type="button"
                                                    className={
                                                        'prompt-copy-btn' +
                                                        (copiedId === prompt._id
                                                            ? ' prompt-copy-btn--success'
                                                            : '')
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopy(prompt.prompt, prompt._id);
                                                    }}
                                                >
                                                    {copiedId === prompt._id ? (
                                                        <>
                                                            <Check size={14} />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={14} />
                                                            Copy Prompt
                                                        </>
                                                    )}
                                                </button>
                                                {prompt.category && (
                                                    <span className="prompt-meta-tag">
                                                        {prompt.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                ) : (
                    <div className="prompts-empty">
                        <h2 className="prompts-empty-title">No prompts found</h2>
                        <p className="prompts-empty-text">
                            We couldn&apos;t find any prompts matching
                            {' '}
                            <span className="text-purple-400 font-semibold">"{search}"</span>.
                            Try a different keyword or reset your filters.
                        </p>
                        <button
                            type="button"
                            onClick={() => { setSearch(''); setFilter('All'); }}
                            className="btn-primary"
                        >
                            Reset search
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for full prompt */}
            {modalPrompt && (
                <div
                    className="prompt-modal-backdrop"
                    onClick={() => setModalPrompt(null)}
                >
                    <div
                        className="prompt-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalPrompt.logo && (
                            <img
                                src={modalPrompt.logo}
                                alt={modalPrompt.name}
                                className="prompt-modal-image"
                            />
                        )}
                        <div className="prompt-modal-body">
                            <h3 className="prompt-modal-title">
                                {modalPrompt.name || 'Prompt'}
                            </h3>
                            <p className="prompt-modal-text">
                                {modalPrompt.prompt}
                            </p>
                            <div className="prompt-modal-footer">
                                <button
                                    type="button"
                                    className="prompt-modal-close"
                                    onClick={() => setModalPrompt(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptsLibrary;