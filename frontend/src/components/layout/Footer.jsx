import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Footer = () => {
    const { siteName } = useContext(AuthContext);

    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="footer-logo">{siteName || 'WitHub'}</h3>
                        <p className="footer-desc">
                            The ultimate platform for showcasing your profile, managing AI tools, and connecting with the world. Built for creators, developers, and innovators.
                        </p>
                    </div>
                    <div>
                        <h4 className="footer-heading">Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                            <li><Link to="/roadmap" className="footer-link">Roadmap</Link></li>
                            <li><Link to="/offers" className="footer-link">Offers & Deals</Link></li>
                            <li><Link to="/tools" className="footer-link">AI Tools</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-heading">Connect</h4>
                        <div className="flex gap-4 mt-4">
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors p-2 bg-slate-800 rounded-full hover:bg-slate-700"><Twitter size={18} /></a>
                            <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors p-2 bg-slate-800 rounded-full hover:bg-slate-700"><MessageCircle size={18} /></a>
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-full hover:bg-slate-700"><Github size={18} /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="footer-heading">Legal</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                            <li><a href="#" className="footer-link">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} {siteName || 'WitHub'}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
