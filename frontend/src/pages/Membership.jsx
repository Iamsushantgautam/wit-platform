import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Check, X, Crown, Zap, Shield, HelpCircle, ChevronDown, Star } from 'lucide-react';
import '../styles/Membership.css';

const Membership = () => {
    const { user, loading } = useContext(AuthContext);
    const [billingCycle, setBillingCycle] = useState('monthly');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="membership-container membership-bg">
            <div className="membership-content">

                <div className="membership-hero animate-fade-in-up">
                    <div className="membership-badge">
                        <Star size={14} className="fill-current" />
                        <span>Premium Access</span>
                    </div>
                    <h1 className="membership-title">
                        Unlock Your Full <br />
                        <span className="creative-potential-text animate-gradient-x">Creative Potential</span>
                    </h1>
                    <p className="membership-description">
                        Join the elite community of creators. Get exclusive access to advanced AI tools, premium prompts, and special offers.
                    </p>

                    {/* Billing Toggle */}
                    <div className="billing-toggle-container">
                        <span className={`billing-toggle-label ${billingCycle === 'monthly' ? 'active' : 'inactive'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="billing-toggle-button"
                            aria-label="Toggle billing cycle"
                        >
                            <div className={`toggle-dot ${billingCycle === 'yearly' ? 'yearly' : ''}`} />
                        </button>
                        <span className={`billing-toggle-label ${billingCycle === 'yearly' ? 'active' : 'inactive'}`}>
                            Yearly
                            <span className="save-badge">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="pricing-grid">

                    <div className="pricing-card animate-fade-in-left">
                        <div className="pricing-card-header">
                            <div className="pricing-card-icon-container">
                                <Zap size={28} />
                            </div>
                            <h3 className="pricing-card-title">Free Starter</h3>
                            <p className="pricing-card-subtext">Essential tools for casual creators.</p>
                        </div>

                        <div className="price-container">
                            <span className="price-text">$0</span>
                            <span className="price-suffix">/month</span>
                        </div>

                        <div className="feature-list">
                            <FeatureItem included>Public Profile Page</FeatureItem>
                            <FeatureItem included>Access Community Profiles</FeatureItem>
                            <FeatureItem included>Basic Settings</FeatureItem>
                            <FeatureItem>Top-Tier AI Tools</FeatureItem>
                            <FeatureItem>Premium Prompt Library</FeatureItem>
                            <FeatureItem>Exclusive Deals</FeatureItem>
                            <FeatureItem>Priority 24/7 Support</FeatureItem>
                        </div>

                        {user ? (
                            <button className="pricing-button pricing-button-free">
                                {user.plan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
                            </button>
                        ) : (
                            <Link to="/login" className="pricing-button pricing-button-free">
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Pro Plan */}
                    <div className="pro-card-wrapper animate-fade-in-right">
                        <div className="glow-card-container">
                            <div className="glow-card-content card-glow">
                                {/* Popular Badge */}
                                <div className="popular-badge-container">
                                    <div className="popular-badge">
                                        <Star size={10} fill="currentColor" /> Most Popular
                                    </div>
                                </div>

                                <div className="pro-header">
                                    <div className="pro-icon-container">
                                        <Crown size={32} fill="currentColor" />
                                    </div>
                                    <h3 className="pro-title">Pro Membership</h3>
                                    <p className="pro-subtitle">For power users who want it all.</p>
                                </div>

                                <div className="pro-price-container">
                                    <span className="pro-price-text">
                                        {billingCycle === 'monthly' ? '$19' : '$15'}
                                    </span>
                                    <span className="pro-price-suffix">/month</span>
                                    {billingCycle === 'yearly' && <span className="billed-annually-badge">BILLED ANNUALLY</span>}
                                </div>

                                <div className="pro-features">
                                    <FeatureItem dark included>Everything in Free</FeatureItem>
                                    <FeatureItem dark included>Unlimited AI Tools Access</FeatureItem>
                                    <FeatureItem dark included>Full Prompt Library (10,000+)</FeatureItem>
                                    <FeatureItem dark included>Exclusive Offers & Discounts</FeatureItem>
                                    <FeatureItem dark included>Verified Profile Badge <Shield size={14} className="verified-badge-icon" /></FeatureItem>
                                    <FeatureItem dark included>Advanced Analytics</FeatureItem>
                                    <FeatureItem dark included>Priority Support</FeatureItem>
                                </div>

                                {user ? (
                                    <Link to={`/checkout?type=plan_upgrade&id=pro&billing=${billingCycle}`} className="pro-button">
                                        {(user.plan === 'pro' || user.plan === 'premium') ? 'Manage Subscription' : 'Upgrade to Pro'}
                                    </Link>
                                ) : (
                                    <Link to="/login" className="pro-button">
                                        Start Pro Trial
                                    </Link>
                                )}

                                <div className="payment-badge">
                                    <Shield size={12} /> Safe & Secure Payment via Stripe
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <div className="faq-header-content">
                        <span className="faq-subheading">Support</span>
                        <h2 className="faq-title">Frequently Asked Questions</h2>
                    </div>
                    <div className="faq-list">
                        <FAQItem question="How does the upgrade process work?">
                            Upgrading is instant and automated. Simply click "Upgrade to Pro", enter your payment details (or use a coupon code), and your account will be upgraded immediately.
                        </FAQItem>
                        <FAQItem question="Can I switch between plans?">
                            Absolutely! You can upgrade or downgrade at any time. If you downgrade, you will retain access to Pro features until the end of your current billing cycle.
                        </FAQItem>
                        <FAQItem question="Are there any hidden fees?">
                            No. The price you see is the price you pay. There are no setup fees, cancellation fees, or hidden charges.
                        </FAQItem>
                        <FAQItem question="What happens to my data if I cancel?">
                            Your profile and public data remain safe. You will simply lose access to the 'Pro-only' tools and the ability to edit premium settings. You can reactivate anytime.
                        </FAQItem>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="membership-footer">
                    <div className="footer-icon-outer">
                        <div className="footer-icon-inner">
                            <HelpCircle size={24} />
                        </div>
                    </div>
                    <h3 className="footer-heading">Still have questions?</h3>
                    <p className="footer-text">Our support team is available 24/7 to assist you.</p>
                    <a href="mailto:support@withub.com" className="footer-link">Contact Support &rarr;</a>
                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ children, included, dark }) => (
    <div className={`feature-item-row ${!included ? 'excluded' : ''}`}>
        <div className={`feature-icon-wrapper ${included ? (dark ? 'included-dark' : 'included-light') : (dark ? 'excluded-dark' : 'excluded-light')}`}>
            {included ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
        </div>
        <span className={`feature-label ${dark ? 'dark' : 'light'}`}>{children}</span>
    </div>
);

const FAQItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="faq-item-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="faq-header"
            >
                <h4 className="faq-question">{question}</h4>
                <div className={`faq-icon-wrapper ${isOpen ? 'open' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <div className={`faq-content ${isOpen ? 'open' : ''}`}>
                <div className="faq-inner-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Membership;
