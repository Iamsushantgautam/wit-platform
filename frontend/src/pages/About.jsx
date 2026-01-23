import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield, Target, Heart, Globe } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6">
                        <Star size={16} />
                        <span>Our Story</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                        Empowering <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Creators</span> & <span className="text-slate-900 dark:text-white">Innovators</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        WitHub is the ultimate platform to showcase your identity, manage your AI toolkit, and connect with a thriving community of builders.
                    </p>
                </div>

                {/* Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl w-fit mb-6">
                            <Target size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            We believe that every creator deserves a professional, customizable, and powerful space to represent themselves online.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            In the age of AI, managing your tools and resources is just as important as showcasing your work. WitHub bridges the gap between personal branding and resource management.
                        </p>
                        <Link to="/register" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group">
                            Join Our Mission <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-rows-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Premium Quality</h3>
                                <p className="text-slate-500 text-sm">Built for specific needs</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-2xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Community First</h3>
                                <p className="text-slate-500 text-sm">Growing together</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center gap-6">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure & Private</h3>
                                <p className="text-slate-500 text-sm">Your data, your control</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center shadow-lg transform hover:-translate-y-1 transition-transform">
                        <div className="text-5xl font-black mb-2 tracking-tight">10k+</div>
                        <div className="font-medium text-blue-100 uppercase tracking-widest text-sm">Active Users</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center shadow-lg transform hover:-translate-y-1 transition-transform">
                        <div className="text-5xl font-black mb-2 tracking-tight">500+</div>
                        <div className="font-medium text-purple-100 uppercase tracking-widest text-sm">AI Tools Listed</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white text-center shadow-lg transform hover:-translate-y-1 transition-transform">
                        <div className="text-5xl font-black mb-2 tracking-tight">1M+</div>
                        <div className="font-medium text-emerald-100 uppercase tracking-widest text-sm">Profile Views</div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center py-12">
                    <p className="text-slate-500 italic mb-8">"The only way to predict the future is to create it."</p>
                    <div className="flex justify-center gap-6 text-slate-400">
                        <Globe size={24} className="hover:text-blue-500 transition-colors cursor-pointer" />
                        <Target size={24} className="hover:text-purple-500 transition-colors cursor-pointer" />
                        <Heart size={24} className="hover:text-pink-500 transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
