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
                setTools(data);
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
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20">
            <div className="bg-primary pt-20 pb-16 text-center text-white relative overflow-hidden">
                <div className="container relative z-10">
                    <h1 className="text-4xl font-bold mb-4">Discover AI Tools</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                        Explore the best AI tools curated by our community to supercharge your workflow.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for tools..."
                            className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    </div>
                </div>
            </div>

            <div className="container mt-12">
                {loading ? (
                    <div className="text-center py-20 text-secondary">Loading tools...</div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="section-title-sm">All Tools ({filteredTools.length})</h2>
                        </div>

                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTools.map((tool) => (
                                    <div key={tool._id} className="tool-card group bg-white dark:bg-dark-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                                                    {tool.logo ? (
                                                        <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Wrench className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-primary-text group-hover:text-primary transition">{tool.name}</h3>
                                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">{tool.category || 'AI Tool'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-secondary text-sm mb-6 line-clamp-2 h-10">
                                            {tool.description}
                                        </p>

                                        {tool.prompt && (
                                            <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tool.promptDescription || 'Prompt'}</span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(tool.prompt);
                                                            alert('Prompt copied!');
                                                        }}
                                                        className="text-xs flex items-center gap-1 text-primary hover:underline hover:cursor-pointer"
                                                    >
                                                        <Copy size={12} /> Copy
                                                    </button>
                                                </div>
                                                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 h-16 overflow-y-auto whitespace-pre-wrap">
                                                    {tool.prompt}
                                                </p>
                                            </div>
                                        )}

                                        <a href={tool.url} target="_blank" rel="noreferrer" className="w-full btn btn-outline flex justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                            Visit Website <ExternalLink size={16} className="ml-2" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-secondary rounded-xl">
                                <p className="text-secondary text-lg">No tools found matching your search.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AiTools;
