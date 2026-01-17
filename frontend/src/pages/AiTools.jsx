import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Search, ExternalLink, Wrench, Copy } from 'lucide-react';

const AiTools = () => {
    const { API_URL } = useContext(AuthContext);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/tools`);
                // Filter out prompts if this page is only for tools, 
                // but usually public view shows tools. 
                // Let's keep it as is or filter by type if needed.
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
        <div className="min-h-screen pb-20 bg-slate-50 dark:bg-black selection:bg-blue-500 selection:text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
            </div>

            <div className="relative z-10 pt-24 pb-16">
                <div className="container max-w-6xl">
                    <div className="text-center mb-16 animate-fade-up">
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                            AI Tools <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Registry</span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Discover the world's most powerful AI tools to automate your workflow and unlock new creative possibilities.
                        </p>
                    </div>

                    <div className="mb-12 flex justify-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        <div className="search-wrapper-premium w-full max-w-2xl shadow-xl shadow-blue-500/5">
                            <Search className="search-icon-premium" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, category, or functionality..."
                                className="search-input-premium !py-4 !text-lg !rounded-2xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-fade-up">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-slate-500 font-medium">Loading AI tools...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                    Displaying {filteredTools.length} curated tools
                                </h2>
                            </div>

                            {filteredTools.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredTools.map((tool) => (
                                        <div key={tool._id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col relative overflow-hidden">
                                            {/* Decoration */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -mr-6 -mt-6 group-hover:bg-blue-500/10 transition-colors"></div>

                                            <div className="flex items-start gap-4 mb-6 relative z-10">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                                                    {tool.logo ? (
                                                        <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Wrench className="text-blue-500" size={24} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-800">
                                                        {tool.category || 'AI Tool'}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                                                {tool.description}
                                            </p>

                                            <div className="mt-auto">
                                                <a
                                                    href={tool.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 font-bold py-3 px-4 rounded-xl text-slate-700 dark:text-slate-200 hover:text-white transition-all group/btn shadow-sm"
                                                >
                                                    Visit Website <ExternalLink size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                        We couldn't find any tools matching <span className="text-blue-600 font-bold italic">"{searchTerm}"</span>.
                                        Try adjusting your search terms.
                                    </p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-8 text-blue-600 font-bold hover:underline"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiTools;
