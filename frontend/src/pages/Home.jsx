import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    ArrowRight, CheckCircle, Zap, Shield, Globe,
    Sparkles, Users, Link as LinkIcon, Palette,
    BarChart3, Star, ChevronRight, Play
} from 'lucide-react';

const Home = () => {
    // Animated counter hook
    const useCounter = (end, duration = 2000) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            let startTime;
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, [end, duration]);
        return count;
    };

    const usersCount = useCounter(10000);
    const toolsCount = useCounter(500);
    const profilesCount = useCounter(25000);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-content text-center">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>The Future of Personal Branding</span>
                    </div>
                    <h1 className="hero-title">
                        Your Complete <span className="hero-highlight animated-gradient">Digital Identity</span> Platform
                    </h1>
                    <p className="hero-subtitle">
                        Create stunning profiles, curate your favorite AI tools, share important links,
                        and build your personal brand — all with a single, memorable link.
                    </p>
                    <div className="flex justify-center gap-4 hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg shadow-lg hero-btn-primary">
                            <span>Get Started Free</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn btn-outline btn-lg shadow-sm hero-btn-secondary">
                            <Play size={18} />
                            <span>Watch Demo</span>
                        </Link>
                    </div>
                    <p className="hero-note">✨ No credit card required • Setup in 2 minutes</p>
                </div>

                {/* Decorative Background Elements */}
                <div className="hero-bg-elements">
                    <div className="hero-blob blob-1"></div>
                    <div className="hero-blob blob-2"></div>
                    <div className="hero-blob blob-3"></div>
                    <div className="hero-glow"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={28} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-number">{usersCount.toLocaleString()}+</span>
                                <span className="stat-label">Active Users</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Zap size={28} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-number">{toolsCount}+</span>
                                <span className="stat-label">AI Tools</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Globe size={28} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-number">{profilesCount.toLocaleString()}+</span>
                                <span className="stat-label">Profiles Created</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Star size={28} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-number">4.9</span>
                                <span className="stat-label">User Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section how-it-works-section">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-badge">Simple Process</span>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Get your professional profile live in just three easy steps</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">
                                <Users size={32} />
                            </div>
                            <h3 className="step-title">Create Your Profile</h3>
                            <p className="step-desc">Sign up with your unique username and set up your personalized profile in minutes.</p>
                        </div>

                        <div className="step-connector">
                            <ChevronRight size={24} />
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">
                                <Palette size={32} />
                            </div>
                            <h3 className="step-title">Customize & Add Content</h3>
                            <p className="step-desc">Add your links, curate AI tools, upload banners, and personalize your appearance.</p>
                        </div>

                        <div className="step-connector">
                            <ChevronRight size={24} />
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">
                                <LinkIcon size={32} />
                            </div>
                            <h3 className="step-title">Share Your Link</h3>
                            <p className="step-desc">Get your unique URL and share it everywhere — social media, email, business cards!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-badge">Features</span>
                        <h2 className="section-title">Why Choose WitHub?</h2>
                        <p className="section-subtitle">Everything you need to build your personal brand and manage your digital assets efficiently.</p>
                    </div>

                    <div className="features-grid">
                        <div className="card feature-card">
                            <div className="feature-icon icon-blue">
                                <Globe size={28} />
                            </div>
                            <h3 className="feature-title">Custom Public Profile</h3>
                            <p className="feature-desc">Claim your unique username and build a beautiful landing page for all your important links and content.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon icon-purple">
                                <Zap size={28} />
                            </div>
                            <h3 className="feature-title">AI Tools Management</h3>
                            <p className="feature-desc">Curate and showcase your favorite AI tools. Keep track of what you use and share recommendations.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon icon-green">
                                <Shield size={28} />
                            </div>
                            <h3 className="feature-title">Secure & Scalable</h3>
                            <p className="feature-desc">Built with enterprise-grade security. Your data is safe, and your profile is always online and fast.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon icon-orange">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="feature-title">AI Prompts Library</h3>
                            <p className="feature-desc">Access and share curated AI prompts. Build your collection and help others boost productivity.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon icon-pink">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="feature-title">Analytics Dashboard</h3>
                            <p className="feature-desc">Track profile views, link clicks, and engagement. Understand your audience with detailed insights.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon icon-teal">
                                <Palette size={28} />
                            </div>
                            <h3 className="feature-title">Custom Theming</h3>
                            <p className="feature-desc">Personalize every aspect of your profile with themes, colors, and custom branding options.</p>
                            <div className="feature-link">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="text-center mb-16">
                        <span className="section-badge">Testimonials</span>
                        <h2 className="section-title">Loved by Creators</h2>
                        <p className="section-subtitle">See what our users are saying about WitHub</p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#facc15" stroke="#facc15" />)}
                            </div>
                            <p className="testimonial-text">"WitHub transformed how I present myself online. My AI tools collection and links are now beautifully organized in one place!"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">SK</div>
                                <div>
                                    <span className="testimonial-name">Sarah Kim</span>
                                    <span className="testimonial-role">AI Developer</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card featured">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#facc15" stroke="#facc15" />)}
                            </div>
                            <p className="testimonial-text">"The prompts library is a game-changer! I can share my best ChatGPT prompts with my audience and see which ones are most popular."</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">MP</div>
                                <div>
                                    <span className="testimonial-name">Mike Peterson</span>
                                    <span className="testimonial-role">Content Creator</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#facc15" stroke="#facc15" />)}
                            </div>
                            <p className="testimonial-text">"Setup was incredibly easy. Within 5 minutes I had a professional profile that impressed my clients!"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">AJ</div>
                                <div>
                                    <span className="testimonial-name">Alex Johnson</span>
                                    <span className="testimonial-role">Freelance Designer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section bg-secondary">
                <div className="container flex flex-col md:flex-row items-center gap-12">
                    <div className="w-half">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Team collaboration"
                            className="about-image"
                        />
                    </div>
                    <div className="w-half">
                        <span className="section-badge">About Us</span>
                        <h2 className="section-title mb-6">Empowering Digital Creators</h2>
                        <p className="section-desc mb-6">
                            At WitHub, we believe everyone deserves a professional digital presence without the hassle of coding or complex website builders. Our mission is to provide simple, powerful, and beautiful tools to help you stand out online.
                        </p>
                        <ul className="about-checklist">
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Simple setup in minutes
                            </li>
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Analytics for your profile
                            </li>
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Constant updates and new features
                            </li>
                            <li className="list-item">
                                <CheckCircle className="text-accent" size={20} /> Active community support
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Build Your Digital Identity?</h2>
                        <p className="cta-subtitle">Join thousands of creators, developers, and professionals who trust WitHub for their online presence.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-light btn-lg">
                                Get Started for Free <ArrowRight size={20} />
                            </Link>
                        </div>
                        <p className="cta-note">Free forever • No credit card required</p>
                    </div>
                    <div className="cta-decoration">
                        <div className="cta-circle cta-circle-1"></div>
                        <div className="cta-circle cta-circle-2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
