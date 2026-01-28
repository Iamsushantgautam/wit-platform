import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Shield, CreditCard, Tag, ArrowLeft, CheckCircle2, Coins, Zap } from 'lucide-react';
import '../styles/Checkout.css';

const Checkout = () => {
    const { user, setUser, API_URL } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState(1);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const id = params.get('id');

        if (!type || !id) {
            navigate('/membership');
            return;
        }

        const billing = params.get('billing') || 'monthly';
        const isYearly = billing === 'yearly';

        if (type === 'plan_upgrade') {
            setItem({
                type,
                id,
                billing,
                name: id === 'pro' ? `Pro Membership ${isYearly ? '(Yearly)' : ''}` : 'Premium Membership',
                price: id === 'pro' ? (isYearly ? 180 : 19) : 49,
                monthlyRate: id === 'pro' ? (isYearly ? 15 : 19) : 49,
                duration: isYearly ? 12 : 1,
                icon: <Zap className="text-amber-500" size={32} />
            });
            if (isYearly) setSelectedMonths(12);
        } else if (type === 'add_coins') {
            setItem({
                type,
                id,
                name: `${id} Coins Package`,
                price: parseInt(id) / 100,
                icon: <Coins className="text-blue-500" size={32} />
            });
        }
    }, [location, navigate]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setError('');
        try {
            const res = await axios.post(`${API_URL}/coupons/validate`, { code: couponCode }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAppliedCoupon(res.data);
            setCouponCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid coupon code');
        }
    };

    const calculateSubtotal = () => {
        if (!item) return 0;
        if (appliedCoupon?.type === 'free_pro') {
            const months = appliedCoupon.planDurationUnit === 'year' ? appliedCoupon.planDurationValue * 12 : appliedCoupon.planDurationValue;
            return (item.monthlyRate * months).toFixed(2);
        }
        return (item.monthlyRate * selectedMonths).toFixed(2);
    };

    const calculateTotal = () => {
        if (!item) return 0;
        let total = parseFloat(calculateSubtotal());

        if (appliedCoupon) {
            if (appliedCoupon.type === 'free_pro') {
                total = 0;
            } else if (appliedCoupon.type === 'coin_discount' && item.type === 'add_coins') {
                total = total * (1 - appliedCoupon.value / 100);
            } else if (appliedCoupon.type === 'coin_off' && item.type === 'add_coins') {
                total = Math.max(0, total - appliedCoupon.value);
            } else if (appliedCoupon.type === 'coin_combo' && item.type === 'add_coins') {
                total = total * (1 - appliedCoupon.value / 100);
            }
        }
        return total.toFixed(2);
    };

    const handleCheckout = async () => {
        const totalAmount = calculateTotal();

        if (parseFloat(totalAmount) > 0) {
            setError('Paid payments are not supported yet. Please use a 100% OFF coupon.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/transactions/checkout`, {
                itemId: item.id,
                itemType: item.type,
                couponCode: appliedCoupon?.code,
                duration: item.billing === 'yearly' ? 12 : (appliedCoupon?.type === 'free_pro' ? (appliedCoupon.planDurationUnit === 'year' ? appliedCoupon.planDurationValue * 12 : appliedCoupon.planDurationValue) : selectedMonths)
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setSuccess(true);
            setUser({ ...user, plan: res.data.user.plan, coins: res.data.user.coins });
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    if (!item) return <div className="loading-wrapper">Loading...</div>;

    if (success) {
        return (
            <div className="success-screen">
                <div className="success-card animate-fade-in-up">
                    <div className="success-icon-wrapper">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="success-title">Payment Successful!</h2>
                    <p className="success-message">
                        Your account has been updated. You will be redirected to your dashboard in a few seconds.
                    </p>
                    <Link to="/dashboard" className="success-button">
                        Go to Dashboard Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-root">
            <div className="checkout-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="checkout-grid">
                    {/* Left Side: Order Details */}
                    <div className="checkout-left">
                        <div className="checkout-card">
                            <h2 className="section-title">
                                <span className="step-number">1</span>
                                Order Summary
                            </h2>

                            <div className="item-display">
                                <div className="item-info">
                                    <div className="item-icon-wrapper">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-type-label">
                                            {appliedCoupon?.type === 'free_pro'
                                                ? `${appliedCoupon.planDurationValue} ${appliedCoupon.planDurationUnit}${appliedCoupon.planDurationValue > 1 ? 's' : ''} Access`
                                                : item.type === 'plan_upgrade'
                                                    ? `${selectedMonths} Month${selectedMonths > 1 ? 's' : ''} Access`
                                                    : 'One-time Purchase'}
                                        </p>
                                    </div>
                                </div>
                                <div className="item-price-main">
                                    {appliedCoupon?.type === 'free_pro' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm line-through text-gray-400">Rs.{calculateSubtotal()}</span>
                                            <span className="text-green-600 font-bold">FREE</span>
                                        </div>
                                    ) : (
                                        `Rs.${calculateSubtotal()}`
                                    )}
                                </div>
                            </div>

                            {/* Month Selector for Monthly Plan */}
                            {item.type === 'plan_upgrade' && item.billing === 'monthly' && !appliedCoupon && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-dashed border-slate-200">
                                    <span className="text-sm font-bold text-slate-600">Purchase for</span>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={selectedMonths}
                                            onChange={(e) => setSelectedMonths(parseInt(e.target.value))}
                                            className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {[1, 2, 3, 6, 12, 24].map(m => (
                                                <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Coupon Section */}
                            <div className="coupon-area">
                                <label className="coupon-label">Have a coupon code?</label>
                                <div className="coupon-input-group">
                                    <div className="coupon-input-wrapper">
                                        <Tag className="coupon-icon" size={18} />
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="coupon-input"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="coupon-button"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {error && <p className="error-message"><Shield size={14} /> {error}</p>}
                                {appliedCoupon && (
                                    <div className="applied-coupon">
                                        <div className="applied-coupon-info">
                                            <div className="applied-coupon-icon">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <div>
                                                <p className="applied-coupon-text">Coupon "{appliedCoupon.code}" Applied</p>
                                                <p className="applied-coupon-subtext">
                                                    {appliedCoupon.type === 'free_pro' ? `100% OFF (Free Pro Plan for ${appliedCoupon.planDurationValue} ${appliedCoupon.planDurationUnit}${appliedCoupon.planDurationValue > 1 ? 's' : ''})` :
                                                        appliedCoupon.type === 'coin_discount' ? `${appliedCoupon.value}% Discount` :
                                                            appliedCoupon.type === 'coin_off' ? `Rs.${appliedCoupon.value} OFF` :
                                                                appliedCoupon.type === 'free_coin' ? `+${appliedCoupon.value} Bonus Coins` :
                                                                    appliedCoupon.type === 'coin_combo' ? `${appliedCoupon.value}% Discount + ${appliedCoupon.bonusValue} Bonus Coins` :
                                                                        'Special Offer Applied'}
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => setAppliedCoupon(null)} className="remove-coupon">Remove</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="checkout-card">
                            <h2 className="section-title">
                                <span className="step-number">2</span>
                                Payment Method
                            </h2>
                            <div className="payment-methods">
                                <div className="payment-method active">
                                    <CreditCard className="payment-method-icon" size={32} />
                                    <span className="payment-method-name">Card Payment</span>
                                </div>
                                <div className="payment-method disabled">
                                    <div className="payment-method-paypal">PayPal</div>
                                    <span className="payment-method-soon">Coming Soon</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Price Breakdown */}
                    <div className="checkout-right">
                        <div className="summary-card sticky-summary">
                            <h3 className="summary-title">Summary</h3>

                            <div className="summary-rows">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span className="summary-row-value flex items-center gap-2">
                                        <span className="text-sm text-gray-400 font-bold">
                                            {appliedCoupon?.type === 'free_pro'
                                                ? (appliedCoupon.planDurationUnit === 'year' ? appliedCoupon.planDurationValue * 12 : appliedCoupon.planDurationValue)
                                                : selectedMonths} X
                                        </span>
                                        <span>Rs.{item.monthlyRate.toFixed(2)}</span>
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <div className="summary-row summary-discount">
                                        <span>Discount</span>
                                        <span className="summary-row-value">
                                            {appliedCoupon.type === 'free_pro' ? '-100%' :
                                                appliedCoupon.type === 'coin_discount' ? `-${appliedCoupon.value}%` :
                                                    appliedCoupon.type === 'coin_off' ? `-Rs.${appliedCoupon.value}` :
                                                        appliedCoupon.type === 'free_coin' ? `+${appliedCoupon.value} Coins` :
                                                            appliedCoupon.type === 'coin_combo' ? `-${appliedCoupon.value}% + ${appliedCoupon.bonusValue} Coins` : ''}
                                        </span>
                                    </div>
                                )}
                                <div className="summary-row">
                                    <span>Taxes</span>
                                    <span className="summary-row-value">Rs.0.00</span>
                                </div>
                            </div>

                            <div className="summary-total-area">
                                <div className="summary-total-row">
                                    <span className="summary-total-label">Total</span>
                                    <div className="flex flex-col items-end">
                                        {appliedCoupon && (
                                            <span className="text-sm line-through text-gray-400 mb-[-4px]">Rs.{calculateSubtotal()}</span>
                                        )}
                                        <span className="summary-total-price">Rs.{calculateTotal()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || parseFloat(calculateTotal()) > 0}
                                className={`pay-button ${parseFloat(calculateTotal()) > 0 ? 'btn-disabled' : ''}`}
                            >
                                {loading ? 'Processing...' : (calculateTotal() === '0.00' ? 'Complete Order' : 'Pay Now (Offline)')}
                                {!loading && <CreditCard size={20} />}
                            </button>

                            <div className="secure-badge">
                                <Shield size={14} /> Encrypted Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
