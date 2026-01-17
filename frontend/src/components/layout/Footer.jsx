const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="footer-logo">WitHub</h3>
                        <p className="footer-desc">
                            The ultimate platform for showcasing your profile, managing AI tools, and connecting with the world. Built for creators, developers, and innovators.
                        </p>
                    </div>
                    <div>
                        <h4 className="footer-heading">Platform</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Features</a></li>
                            <li><a href="#" className="footer-link">Pricing</a></li>
                            <li><a href="#" className="footer-link">AI Tools</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="footer-heading">Community</h4>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Discord</a></li>
                            <li><a href="#" className="footer-link">Twitter</a></li>
                            <li><a href="#" className="footer-link">Blog</a></li>
                        </ul>
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
                    &copy; {new Date().getFullYear()} WitHub. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
