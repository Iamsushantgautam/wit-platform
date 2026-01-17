import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Globe } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-content text-center">
                    <h1 className="hero-title">
                        Showcase Your <span className="hero-highlight">Digital Identity</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create a stunning profile, manage your AI tools, and share your world with a single link. The all-in-one platform for modern professionals.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="btn btn-primary btn-lg shadow-lg">
                            Get Started Free <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-lg shadow-sm">
                            Login
                        </Link>
                    </div>
                </div>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Features Section */}
            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Why Choose WitHub?</h2>
                        <p className="section-subtitle">Everything you need to build your personal brand and manage your digital assets efficiently.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="card feature-card">
                            <div className="feature-icon icon-blue">
                                <Globe size={28} />
                            </div>
                            <h3 className="feature-title">Custom Public Profile</h3>
                            <p className="feature-desc">Claim your unique username and build a beautiful landing page for all your important links and content.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon icon-purple">
                                <Zap size={28} />
                            </div>
                            <h3 className="feature-title">AI Tools Management</h3>
                            <p className="feature-desc">Curate and showcase your favorite AI tools. Keep track of what you use and share recommendations.</p>
                        </div>
                        <div className="card feature-card">
                            <div className="feature-icon icon-green">
                                <Shield size={28} />
                            </div>
                            <h3 className="feature-title">Secure & Scalable</h3>
                            <p className="feature-desc">Built with enterprise-grade security. Your data is safe, and your profile is always online and fast.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            {/* About Section */}
            <section className="section bg-secondary">
                <div className="container flex flex-col md:flex-row items-center gap-12">
                    <div className="w-half">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Team" className="rounded-xl shadow-lg" />
                    </div>
                    <div className="w-half">
                        <h2 className="section-title mb-6">Empowering Digital Creators</h2>
                        <p className="section-desc mb-6">
                            At WitHub, we believe everyone deserves a professional digital presence without the hassle of coding or complex website builders. Our mission is to provide simple, powerful, and beautiful tools to help you stand out online.
                        </p>
                        <ul className="space-y-4">
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Simple setup in minutes
                            </li>
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Analytics for your profile
                            </li>
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Constant updates and new features
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
