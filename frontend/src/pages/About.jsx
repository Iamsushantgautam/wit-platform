import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield } from 'lucide-react';
import { ProfileUpdates } from '../components/public-profile';

const About = () => {
    return (
        <div className="home-page pb-20">
            {/* Hero Section */}
            <div className="hero-section text-center">
                <div className="container hero-content">
                    <h1 className="hero-title">
                        Empowering <span className="hero-highlight">Creators</span> & <span className="hero-highlight">Developers</span>
                    </h1>
                    <p className="hero-subtitle mx-auto" style={{ maxWidth: '700px' }}>
                        WitHub is the ultimate platform to showcase your identity, manage your AI toolkit, and connect with a thriving community of innovators.
                    </p>
                </div>
            </div>


            {/* Mission Section */}
            <div className="section bg-secondary">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="section-title">Our Mission</h2>
                            <p className="text-secondary text-lg mb-6">
                                We believe that every creator deserves a professional, customizable, and powerful space to represent themselves online.
                            </p>
                            <p className="text-secondary text-lg mb-8">
                                In the age of AI, managing your tools and resources is just as important as showcasing your work. WitHub bridges the gap between personal branding and resource management.
                            </p>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Join Our Mission <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="card bg-primary text-inverse p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white/20 rounded-lg">
                                            <Star size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Premium Quality</h3>
                                            <p className="text-white/80">Built for excellence</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white/20 rounded-lg">
                                            <Users size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Community First</h3>
                                            <p className="text-white/80">Growing together</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 rounded-lg">
                                            <Shield size={32} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">Secure & Private</h3>
                                            <p className="text-white/80">Your data, your control</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="section">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                            <div className="text-secondary font-medium">Active Users</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-secondary font-medium">AI Tools Listed</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                            <div className="text-secondary font-medium">Profile Views</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
