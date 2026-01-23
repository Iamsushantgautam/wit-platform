import React from 'react';
import {
    Map, Clock, CheckCircle, Zap, Star, Rocket,
    Construction, ArrowRight, Layout, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Roadmap = () => {
    const roadmapItems = [
        {
            status: 'progress',
            items: [
                {
                    title: 'Advanced Analytics Dashboard',
                    description: 'Deep dive into your profile views, link clicks, and audience demographics.',
                    tag: 'Analytics',
                    date: 'Q3 2026'
                },
                {
                    title: 'Custom Domain Support',
                    description: 'Connect your own domain (e.g., yourname.com) directly to your profile.',
                    tag: 'Pro Feature',
                    date: 'Q3 2026'
                }
            ]
        },
        {
            status: 'upcoming',
            items: [
                {
                    title: 'Team Collaboration',
                    description: 'Invite members to manage organization profiles and shared resources.',
                    tag: 'Teams',
                    date: 'Q4 2026'
                },
                {
                    title: 'Public API Access',
                    description: 'Programmatically manage your tools, prompts, and profile data.',
                    tag: 'Developer',
                    date: 'Q4 2026'
                },
                {
                    title: 'Mobile Application',
                    description: 'Native iOS and Android apps for managing your digital presence on the go.',
                    tag: 'Mobile',
                    date: '2027'
                }
            ]
        },
        {
            status: 'completed',
            items: [
                {
                    title: 'Admin Dashboard 2.0',
                    description: 'Complete overhaul of the administration panel with enhanced controls and metrics.',
                    tag: 'Core',
                    date: 'Released'
                },
                {
                    title: 'Prompt Library v1',
                    description: 'Share and discover AI prompts with our new community library features.',
                    tag: 'Community',
                    date: 'Released'
                },
                {
                    title: 'Profile Themes (Dark Mode)',
                    description: 'Enhanced visual customization with system-wide dark mode support.',
                    tag: 'Design',
                    date: 'Released'
                }
            ]
        }
    ];

    const StatusSection = ({ title, icon: Icon, color, items, bgClass, borderClass }) => (
        <div className="mb-12 last:mb-0">
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-2xl ${bgClass} border ${borderClass}`}>
                <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 ${color}`}>
                    <Icon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-4 md:pl-0">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Status Line for mobile timeline effect */}
                        <div className={`absolute left-0 top-8 w-1 h-8 rounded-r-lg ${color.replace('text-', 'bg-')} md:hidden`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${bgClass} ${color} border ${borderClass}`}>
                                {item.tag}
                            </span>
                            <span className="text-sm font-medium text-slate-400 font-mono">
                                {item.date}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-4">
                        <Map size={16} />
                        <span>Public Roadmap</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        What's Next for <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Withub</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        We're building the future of digital identity for AI creators.
                        Explore our development timeline and see what features are shipping soon.
                    </p>
                </div>

                {/* Timeline Sections */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <StatusSection
                        title="In Progress"
                        icon={Construction} // Or Zap
                        color="text-amber-500"
                        bgClass="bg-amber-50 dark:bg-amber-900/10"
                        borderClass="border-amber-100 dark:border-amber-900/30"
                        items={roadmapItems[0].items}
                    />

                    <StatusSection
                        title="Coming Soon"
                        icon={Rocket}
                        color="text-blue-500"
                        bgClass="bg-blue-50 dark:bg-blue-900/10"
                        borderClass="border-blue-100 dark:border-blue-900/30"
                        items={roadmapItems[1].items}
                    />

                    <StatusSection
                        title="Recently Released"
                        icon={CheckCircle}
                        color="text-emerald-500"
                        bgClass="bg-emerald-50 dark:bg-emerald-900/10"
                        borderClass="border-emerald-100 dark:border-emerald-900/30"
                        items={roadmapItems[2].items}
                    />
                </div>

                {/* CTA */}
                <div className="mt-20 text-center bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Have a feature request?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto mb-8">
                            We build for the community. If you have an idea that would make your Withub profile better, we want to hear it.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
                                <Zap size={18} />
                                Suggest Feature
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded-xl transition-all">
                                Join now
                            </Link>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
