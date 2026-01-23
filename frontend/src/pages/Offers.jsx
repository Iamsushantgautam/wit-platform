import React, { useState, useEffect, useContext } from 'react';
import { Tag, Percent, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import OfferCard from '../components/blocks/OfferCard';
import '../styles/Offers.css';

const Offers = () => {
    const { API_URL } = useContext(AuthContext);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State for Deals
    const [dealPage, setDealPage] = useState(1);
    const DEALS_PER_PAGE = 8;

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get(`${API_URL}/offers`);
                setOffers(res.data);
            } catch (error) {
                console.error("Failed to fetch offers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [API_URL]);

    const promoOffers = offers.filter(o => o.code && o.code.trim() !== '');
    const dealOffers = offers.filter(o => !o.code || o.code.trim() === '');

    // Pagination Logic
    const totalDealPages = Math.ceil(dealOffers.length / DEALS_PER_PAGE);
    const currentDeals = dealOffers.slice((dealPage - 1) * DEALS_PER_PAGE, dealPage * DEALS_PER_PAGE);

    const handleDealPageChange = (direction) => {
        if (direction === 'prev') {
            setDealPage(prev => Math.max(1, prev - 1));
        } else {
            setDealPage(prev => Math.min(totalDealPages, prev + 1));
        }
    };

    return (
        <div className="offers-page">
            <div className="container mx-auto">
                {/* Header */}
                <div className="offers-header animate-fade-up">
                    <div className="offers-badge">
                        <Gift size={16} />
                        <span>Exclusive Deals</span>
                    </div>
                    <h1 className="offers-title">
                        Offers & <span>Rewards</span>
                    </h1>
                    <p className="offers-subtitle">
                        Unlock premium tools for less. Browse our curated selection of coupons and direct deals.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Section 1: Promo Codes (No Pagination requested, usually fewer) */}
                        {promoOffers.length > 0 && (
                            <section className="mb-20 animate-fade-up" style={{ animationDelay: '100ms' }}>
                                <div className="section-header-wrapper">
                                    <div className="offer-section-title">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">

                                        </div>
                                        <h1><Tag size={24} />Coupon Codes</h1>
                                    </div>
                                    {/* Pagination could be added here if needed */}
                                </div>

                                <div className="offers-grid">
                                    {promoOffers.map((offer, idx) => (
                                        <OfferCard key={offer._id} offer={offer} index={idx} />
                                    ))}
                                </div>
                                <br />
                            </section>
                        )}

                        {/* Section 2: Direct Deals (Paginated) */}
                        {dealOffers.length > 0 && (
                            <section className="mb-20 animate-fade-up" style={{ animationDelay: '200ms' }}>
                                <div className="section-header-wrapper">
                                    <div className="offer-section-title">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">

                                        </div>
                                        <h1><Percent size={32} />Hot Deals</h1>
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalDealPages > 1 && (
                                        <div className="pagination-controls">
                                            <button
                                                className="pag-btn"
                                                onClick={() => handleDealPageChange('prev')}
                                                disabled={dealPage === 1}
                                                aria-label="Previous Page"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button
                                                className="pag-btn"
                                                onClick={() => handleDealPageChange('next')}
                                                disabled={dealPage === totalDealPages}
                                                aria-label="Next Page"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="offers-grid">
                                    {currentDeals.map((offer, idx) => (
                                        <OfferCard key={offer._id} offer={offer} index={idx} />
                                    ))}
                                </div>

                                {dealOffers.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">No deals available.</div>
                                )}
                            </section>
                        )}

                        {offers.length === 0 && (
                            <div className="text-center py-20 text-slate-500">
                                <Tag size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No active offers at the moment.</p>
                            </div>
                        )}
                    </>
                )}

                <div className="pt-20 text-center text-slate-400 text-sm">
                    Disclaimer: Valid for new customers only unless specified.
                </div>
            </div>
        </div>
    );
};

export default Offers;
