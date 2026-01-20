import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Copy, Check, Filter, Search, Zap, SlidersHorizontal } from 'lucide-react';
import { FaRobot, FaMagic } from 'react-icons/fa';

const PromptsLibrary = () => {
    const { API_URL } = useContext(AuthContext);
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                // Fetch tools where type is 'prompt'
                // Assuming the public tools endpoint returns all tools, we filter here or backend
                const res = await axios.get(`${API_URL}/tools`);
                const promptItems = res.data.filter(t => t.type === 'prompt');
                setPrompts(promptItems);
            } catch (error) {
                console.error("Error fetching prompts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrompts();
    }, [API_URL]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredPrompts = prompts.filter(p => {
        const matchesFilter = filter === 'All' || p.category === filter || p.platform === filter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
        return matchesFilter && matchesSearch;
    });

    const uniqueCategories = ['All', ...new Set(prompts.map(p => p.category))];
    const uniquePlatforms = [...new Set(prompts.map(p => p.platform).filter(Boolean))];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white pb-20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 tracking-tight">
                        Prompt Library
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Discover curated AI prompts to supercharge your creativity. Copy with one click and use in your favorite AI models.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6 sticky top-20 z-40 bg-black/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="search-wrapper-premium w-full md:w-96">
                        <Search className="search-icon-premium" size={20} />
                        <input
                            type="text"
                            placeholder="Search prompts, tags, vibes..."
                            className="search-input-premium !bg-white/5 !border-white/10 !text-white placeholder-gray-500 focus:!border-purple-500/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {uniqueCategories.slice(0, 5).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${filter === cat
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                        <p className="text-gray-400 animate-pulse">Scanning the library...</p>
                    </div>
                ) : (
                    <>
                        {filteredPrompts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {/* Card style started here */}
                                {filteredPrompts.map(prompt => (
                                    <div
                                        key={prompt._id}
                                        className="relative rounded-2xl overflow-hidden group"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/5] w-full relative rounded-2xl overflow-hidden group">
                                            <img
                                                src={prompt.logo}
                                                alt={prompt.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative rounded-2xl overflow-hidden group"
                                            />

                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                                            {/* Title badge */}
                                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                                {prompt.name}
                                            </div>

                                            {/* Model badge */}
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <FaRobot size={12} /> {prompt.platform || 'AI'}
                                            </div>

                                            {/* Bottom content */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4">
                                                    {prompt.description}
                                                </p>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopy(prompt.prompt, prompt._id);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white py-2.5 rounded-xl font-semibold transition-all active:scale-95"
                                                >
                                                    {copiedId === prompt._id ? (
                                                        <>
                                                            <Check size={18} className="text-green-400" />
                                                            Copied
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={18} />
                                                            Copy Prompt
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                <Search size={48} className="mx-auto text-gray-600 mb-6" />
                                <h3 className="text-3xl font-bold text-white mb-4">Shade not found</h3>
                                <p className="text-gray-400 max-w-sm mx-auto text-lg">
                                    Our scanners couldn't find any prompts matching <span className="text-purple-400 font-bold italic">"{search}"</span>.
                                </p>
                                <button
                                    onClick={() => { setSearch(''); setFilter('All'); }}
                                    className="mt-10 text-purple-400 font-bold hover:text-purple-300 underline underline-offset-8"
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PromptsLibrary;
