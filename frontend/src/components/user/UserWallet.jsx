import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import { Coins, History, ShoppingCart, TrendingUp, Search, CheckCircle2, ChevronLeft, ChevronRight, Crown, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserWallet.css';

const UserWallet = () => {
    const { user, API_URL } = useContext(AuthContext);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalSpentRs: 0, totalPurchased: 0, totalEarned: 0, totalInflow: 0, totalSpentCoins: 0 });
    const [customAmount, setCustomAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_URL}/transactions/my`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTransactions(res.data);

            // Calculate detailed stats
            const spentRs = res.data
                .filter(t => t.type === 'purchase' || t.type === 'plan_upgrade' || t.type === 'add_coins')
                .reduce((acc, t) => acc + (t.amount || 0), 0);

            const purchasedCount = res.data
                .filter(t => t.type === 'add_coins')
                .reduce((acc, t) => acc + (t.coins || 0), 0);

            const earnedCount = res.data
                .filter(t => (t.coins || 0) > 0 && t.type !== 'add_coins')
                .reduce((acc, t) => acc + t.coins, 0);

            const totalInflow = purchasedCount + earnedCount;

            const spentCount = res.data
                .filter(t => (t.coins || 0) < 0)
                .reduce((acc, t) => acc + Math.abs(t.coins), 0);

            setStats({
                totalSpentRs: spentRs,
                totalPurchased: purchasedCount,
                totalEarned: earnedCount,
                totalInflow: totalInflow,
                totalSpentCoins: spentCount
            });
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCoins = (amount) => {
        navigate(`/checkout?type=add_coins&id=${amount}`);
    };

    // Pagination Logic
    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="wallet-container animate-fade-in-up">
            <h2 className="wallet-header">
                <Coins />
                <span>My Wallet</span>
            </h2>

            {/* Active Plan Duration View */}
            {
                user?.plan && user?.plan !== 'free' && (
                    <div className="plan-active-card">
                        <div className="plan-info-main">
                            <div className="plan-icon-wrapper">
                                <Crown size={32} />
                            </div>
                            <div>
                                <h3 className="plan-name-badge">{user.plan} Active</h3>
                                <span className="plan-status-pill">Premium Membership</span>
                            </div>
                        </div>
                        <div className="plan-dates-card">
                            <p className="expiry-label">Plan Expiry Date</p>
                            <div className="flex items-center gap-2 justify-end">
                                <Calendar size={18} opacity={0.6} />
                                <span className={`expiry-date ${user.planExpiryDate && new Date(user.planExpiryDate) < new Date() ? 'expired' : ''}`}>
                                    {user.planExpiryDate ? new Date(user.planExpiryDate).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Permanent'}
                                </span>
                            </div>
                            {user.planExpiryDate && new Date(user.planExpiryDate) < new Date() && (
                                <p className="text-[10px] font-bold text-red-100 mt-1 flex items-center gap-1 justify-end">
                                    <AlertTriangle size={10} /> Plan has expired
                                </p>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Wallet Overview Cards */}
            <div className="wallet-grid">
                <div className="balance-card">
                    <Coins className="balance-card-icon" size={160} />
                    <div className="relative z-10">
                        <p className="card-label">Available Balance</p>
                        <h3 className="balance-value">{user?.coins || 0}</h3>
                        <p className="card-subtext">Current spending power</p>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-label">Total Coin Inflow</p>
                        <h3 className="stats-value text-green-600">{stats.totalInflow.toLocaleString()}</h3>
                    </div>
                    <div className="stats-indicator indicator-green">
                        <TrendingUp size={16} />
                        <span>Purchased + Bonus</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="stats-label">Purchased</p>
                            <h3 className="stats-value-small">{stats.totalPurchased.toLocaleString()}</h3>
                        </div>
                        <div className="text-right">
                            <p className="stats-label">Bonus</p>
                            <h3 className="stats-value-small text-purple-600">{stats.totalEarned.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="stats-indicator indicator-blue">
                        <Coins size={16} />
                        <span>Inflow breakdown</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-label">Coins Spent</p>
                        <h3 className="stats-value text-red-500">{stats.totalSpentCoins.toLocaleString()}</h3>
                    </div>
                    <div className="stats-indicator text-red-500">
                        <ShoppingCart size={16} />
                        <span>All usage history</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div>
                        <p className="stats-label">Total Spent (Rs)</p>
                        <h3 className="stats-value">Rs.{stats.totalSpentRs.toFixed(2)}</h3>
                    </div>
                    <div className="stats-indicator indicator-blue">
                        <ShoppingCart size={16} />
                        <span>Investment</span>
                    </div>
                </div>
            </div>

            {/* Quick Add Coins */}
            <div className="quick-add-section">
                <div className="quick-add-content">
                    <div>
                        <h3 className="quick-add-title">Need more coins?</h3>
                        <p className="quick-add-description">Add coins to your wallet to unlock premium features and one-time tools.</p>
                    </div>
                    <div className="coin-options">
                        {[500, 1000, 5000].map(amount => (
                            <button
                                key={amount}
                                onClick={() => handleAddCoins(amount)}
                                className="coin-option-btn"
                            >
                                <span className="coin-amount">+{amount}</span>
                                <span className="coin-price">Rs.{(amount / 100).toFixed(2)}</span>
                            </button>
                        ))}
                        <div className="custom-coin-input-group">
                            <input
                                type="number"
                                placeholder="Custom Amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="custom-coin-input"
                            />
                            <button
                                onClick={() => customAmount && handleAddCoins(customAmount)}
                                className="custom-coin-btn"
                                disabled={!customAmount || customAmount <= 0}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="history-container">
                <div className="history-header">
                    <h3 className="history-title">
                        <History size={24} className="text-blue-500" />
                        Transaction History
                    </h3>
                    <div className="search-wrapper">
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on search
                            }}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="loading-row">
                                        <td colSpan="5">
                                            <div className="loading-bar"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-history">
                                            <History size={48} className="empty-icon" />
                                            <p className="empty-text">No transactions found yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentTransactions.map(t => (
                                <tr key={t._id}>
                                    <td>
                                        <div className="transaction-cell">
                                            <div className={`transaction-icon-box ${t.type === 'plan_upgrade' ? 'icon-box-amber' : 'icon-box-blue'}`}>
                                                {t.type === 'plan_upgrade' ? <TrendingUp size={18} /> : <Coins size={18} />}
                                            </div>
                                            <div>
                                                <p className="transaction-name">{t.description}</p>
                                                {t.couponUsed && <span className="coupon-applied">Applied: {t.couponUsed.code}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="type-cell">{t.type.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <div className="date-group">
                                            <span className="date-main">{new Date(t.createdAt).toLocaleDateString()}</span>
                                            <span className="date-sub">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="amount-group">
                                            {/* Logic: If amount is > 0, show money. If amount is 0 and coins != 0, show coins. */}
                                            {t.amount > 0 ? (
                                                <>
                                                    <span className="amount-main">Rs.{t.amount.toFixed(2)}</span>
                                                    {t.coins > 0 && <span className="amount-coins">+{t.coins} Coins</span>}
                                                </>
                                            ) : (
                                                t.coins !== 0 && (
                                                    <span className={`amount-main ${t.coins < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {t.coins > 0 ? '+' : ''}{t.coins} Coins
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className={`status-badge ${t.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                                            <CheckCircle2 size={12} />
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <div className="pagination-info">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} results
                        </div>
                        <div className="pagination-btns">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`pagination-number-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserWallet;
