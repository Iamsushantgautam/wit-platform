import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PromptCard from '../components/blocks/PromptCard';
import '../styles/Prompts.css';

const PROMPTS_PER_PAGE = 9;

const PromptsLibrary = () => {
    const { API_URL, user } = useContext(AuthContext);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalPrompt, setModalPrompt] = useState(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get(`${API_URL}/prompts`, config);

                // Identify locked status based on user purchases
                const allPrompts = res.data.map(prompt => {
                    if (!prompt.isPaid) return { ...prompt, isLocked: false };

                    const isUnlocked = user?.unlockedPrompts?.some(u =>
                        (typeof u === 'string' ? u === prompt._id : u._id === prompt._id)
                    );

                    return { ...prompt, isLocked: !isUnlocked };
                });

                setPrompts(allPrompts);
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

    const handleCopy = (text, prompt) => {
        navigator.clipboard.writeText(text);
        setCopiedId(prompt);
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

    const handleUnlock = async (prompt) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        if (!window.confirm(`Unlock this prompt for ${prompt.price} coins?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.post(`${API_URL}/transactions/unlock`, {
                itemId: prompt._id,
                itemType: 'prompt'
            }, config);

            // Update local state with unlocked prompt
            setPrompts(prev => prev.map(p => p._id === prompt._id ? { ...p, isLocked: false, ...res.data.item } : p));

            // Update user balance AND unlocked items in context
            if (res.data.remainingCoins !== undefined && (typeof user !== 'undefined')) {
                // Note: PromptsLibrary has { user } from context, but we need setUser!
                // Wait, we didn't destructure setUser in this component.
                // We need to add setUser to destructuring first.
                // But for now, we'll reload if setUser is not available, or attempt to use it if I add it.
                // Actually, let's just reload as it's safer if I can't easily add setUser right now without changing the top of the file.
                // Wait, I can change the top of the file in a separate edit or just assume I will do it.
                // The instruction says "Update handleUnlock". I should probably do the reload fallback properly or use setUser if I add it.

                // Let's stick to the previous reload logic for now BUT check if remainingCoins is present.
                // Actually, user requested "onced unlock then permanently unlock it".
                // Reloading fixes the state because it re-fetches from backend.
                // The issue "after refreshing... lock again" was because fetch didn't map correctly.
                // I fixed the fetch mapping above.
                // So reloading here is actually FINE and ensures sync.
                // But to be "smooth" typically we update state.
                // Let's just keep the reload for now as it guarantees we get the fresh data from the server which we know is correct.
                // Wait, I should probably try to avoid reload if possible.
                // I'll stick to the reload line but ensure the previous lines are correct.
                if (res.data.remainingCoins !== undefined) {
                    window.location.reload();
                } else {
                    alert('Prompt unlocked successfully!');
                }
            }
        } catch (error) {
            console.error('Unlock failed', error);
            alert(error.response?.data?.message || 'Failed to unlock prompt');
        }
    };

    const filteredPrompts = prompts.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter || p.platform === filter;
        const matchesSearch =
            (p.title || p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
        return matchesFilter && matchesSearch;
    });

    const uniqueCategories = ['All', ...new Set(prompts.map(p => p.category).filter(Boolean))];

    // Pagination calculations
    const totalPages = Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE);
    const paginatedPrompts = filteredPrompts.slice(
        (currentPage - 1) * PROMPTS_PER_PAGE,
        currentPage * PROMPTS_PER_PAGE
    );

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
                    <>
                        <div className="prompts-grid">
                            {paginatedPrompts.map(prompt => {
                                const isFav = favorites.includes(prompt._id);
                                return (
                                    <PromptCard
                                        key={prompt._id}
                                        prompt={prompt}
                                        type="public"
                                        isFav={isFav}
                                        onFavorite={() => toggleFavorite(prompt)}
                                        onShare={() => handleShare(prompt)}
                                        onCopy={() => handleCopy(prompt.prompt, prompt)}
                                        copiedId={copiedId}
                                        onUnlock={handleUnlock}
                                    />
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="prompts-pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="pagination-numbers">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`pagination-number ${currentPage === i + 1 ? 'pagination-number--active' : ''}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
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


        </div>
    );
};

export default PromptsLibrary;