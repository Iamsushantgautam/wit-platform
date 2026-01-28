import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Tag, Plus, Trash2, Edit3, Copy, CheckCircle2, XCircle, X, Check, Gift, Crown } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import '../../styles/AdminCoupons.css';

const AdminCoupons = () => {
    const { API_URL } = useContext(AuthContext);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const initialFormState = {
        code: '',
        type: 'coin_discount',
        value: 0,
        bonusValue: 0,
        planDurationUnit: 'month',
        planDurationValue: 1,
        usageLimit: 1,
        expiryDate: '',
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(`${API_URL}/coupons`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCoupons(res.data);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_URL}/coupons/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post(`${API_URL}/coupons`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            setShowModal(false);
            fetchCoupons();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await axios.delete(`${API_URL}/coupons/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchCoupons();
        } catch (err) {
            alert('Error deleting coupon');
        }
    };

    const handleEdit = (coupon) => {
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            bonusValue: coupon.bonusValue || 0,
            planDurationUnit: coupon.planDurationUnit || 'month',
            planDurationValue: coupon.planDurationValue || 1,
            usageLimit: coupon.usageLimit,
            expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
            isActive: coupon.isActive
        });
        setEditingId(coupon._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'free_pro': return <Crown size={16} className="text-amber-500" />;
            case 'free_coin': return <Gift size={16} className="text-blue-500" />;
            case 'coin_combo': return <Tag size={16} className="text-purple-500" />;
            default: return <Tag size={16} className="text-green-500" />;
        }
    };

    return (
        <div className="admin-coupons-container animate-fade-in-up">
            <div className="admin-header-flex">
                <div>
                    <h2 className="admin-title">Coupon Management</h2>
                    <p className="admin-subtitle">Generate and track promotional codes for plans and coins.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-generate"
                >
                    <Plus size={20} />
                    <span>Generate New Code</span>
                </button>
            </div>

            {/* Coupons List */}
            <div className="coupons-table-card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Usage</th>
                                <th>Expiry</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</td></tr>
                            ) : coupons.length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>No coupons generated yet</td></tr>
                            ) : coupons.map(c => (
                                <tr key={c._id}>
                                    <td className="coupon-code-cell">{c.code}</td>
                                    <td>
                                        <div className="type-badge-flex">
                                            {getIcon(c.type)}
                                            {c.type.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="value-highlight">
                                            {c.type === 'free_pro' ? `PRO (${c.planDurationValue} ${c.planDurationUnit}${c.planDurationValue > 1 ? 's' : ''})` :
                                                c.type === 'coin_discount' ? `${c.value}%` :
                                                    c.type === 'coin_off' ? `$${c.value}` :
                                                        c.type === 'coin_combo' ? `${c.value}% + ${c.bonusValue} Coins` :
                                                            `${c.value} Coins`}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="usage-text">{c.usedCount} / {c.usageLimit}</span>
                                    </td>
                                    <td>
                                        <span className="expiry-text">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}</span>
                                    </td>
                                    <td>
                                        <span className={`status-capsule ${c.isActive ? 'status-active' : 'status-inactive'}`}>
                                            {c.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-flex">
                                            <button onClick={() => handleCopy(c.code, c._id)} className={`btn-action-icon btn-copy ${copiedId === c._id ? 'copied' : ''}`} title="Copy Code">
                                                {copiedId === c._id ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <button onClick={() => handleEdit(c)} className="btn-action-icon btn-edit" title="Edit Coupon">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(c._id)} className="btn-action-icon btn-delete" title="Delete Coupon">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in-up">
                        <div className="modal-header">
                            <h3 className="modal-title">{isEditing ? 'Edit Coupon' : 'Generate Coupon'}</h3>
                            <button onClick={() => setShowModal(false)} className="btn-close-modal">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="coupon-form">
                            <div className="form-group">
                                <label className="field-label">Coupon Code</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="form-input"
                                    placeholder="e.g. FREEPRO100"
                                />
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="field-label">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="coin_discount">Coin Discount (%)</option>
                                        <option value="coin_combo">Discount% + Free Coins</option>
                                        <option value="coin_off">Coin Off ($)</option>
                                        <option value="free_coin">Free Coins (Bonus)</option>
                                        <option value="free_pro">Free Pro Plan</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="field-label">{formData.type === 'coin_combo' ? 'Discount %' : 'Value'}</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {formData.type === 'coin_combo' && (
                                <div className="form-group animate-fade-in">
                                    <label className="field-label">Free Coins Bonus</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.bonusValue}
                                        onChange={e => setFormData({ ...formData, bonusValue: e.target.value })}
                                        className="form-input"
                                        placeholder="Amount of free coins"
                                    />
                                </div>
                            )}

                            {formData.type === 'free_pro' && (
                                <div className="form-grid-2 animate-fade-in">
                                    <div className="form-group">
                                        <label className="field-label">Duration Unit</label>
                                        <select
                                            value={formData.planDurationUnit}
                                            onChange={e => setFormData({ ...formData, planDurationUnit: e.target.value })}
                                            className="form-select"
                                        >
                                            <option value="month">Month(s)</option>
                                            <option value="year">Year(s)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">Duration Value</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.planDurationValue}
                                            onChange={e => setFormData({ ...formData, planDurationValue: e.target.value })}
                                            className="form-input"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="field-label">Usage Limit</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="field-label">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span className="checkbox-label">Active (Enabled)</span>
                                </label>
                            </div>

                            <div className="form-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-submit">{isEditing ? 'Save Changes' : 'Generate Code'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
