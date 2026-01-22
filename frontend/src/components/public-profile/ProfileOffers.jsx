import React from 'react';
import { ArrowRight, ChevronRight, Ticket, Layout } from 'lucide-react';

const ProfileOffers = ({ profile }) => {
    return (
        <>
            {/* Hero Banner */}
            {profile?.heroOffer?.isVisible !== false && (
                <div
                    className="profile-hero-banner"
                    style={{ backgroundColor: profile?.heroOffer?.backgroundColor || '#1f2937' }}
                >
                    <div className="profile-hero-banner__content">
                        <span className="profile-hero-banner__badge">
                            {profile?.heroOffer?.badge || 'Limited Time Offer'}
                        </span>
                        <h1 className="profile-hero-banner__title" style={{ whiteSpace: 'pre-wrap' }}>
                            {profile?.heroOffer?.title || '5-in-1 AI Viral Offer Pack'}
                        </h1>
                        <p className="profile-hero-banner__subtitle">
                            {profile?.heroOffer?.subtitle || 'Get 20% Off This Weekend Only!'}
                        </p>
                        <a
                            href={profile?.heroOffer?.ctaLink || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="profile-hero-banner__cta"
                            style={{ display: 'inline-flex', textDecoration: 'none' }}
                        >
                            {profile?.heroOffer?.ctaText || 'GRAB OFFER'} <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            )}

            {/* Filter Pills */}
            <div className="profile-filters">
                <button className="profile-filter-pill active">Premium Offers</button>
                <button className="profile-filter-pill">Free Offers</button>
                <button className="profile-filter-pill">Best Sellers</button>
                <button className="profile-filter-pill">New Arrivals</button>
            </div>

            {/* Offer Grid */}
            <div className="profile-course-grid">
                {(profile?.banners || []).filter(b => b.isVisible !== false).map((banner, idx) => (
                    <a
                        key={idx}
                        href={banner.link || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="profile-course-card"
                    >
                        <div className="profile-course-card__image-wrapper">
                            {banner.imageUrl ? (
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title}
                                    className="profile-course-card__image"
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                                    <Layout size={32} color="#9ca3af" />
                                </div>
                            )}
                            {banner.tags && banner.tags.length > 0 && (
                                <span className="profile-course-card__badge">
                                    {banner.tags[0]}
                                </span>
                            )}
                        </div>
                        <div className="profile-course-card__body">
                            <h3 className="profile-course-card__title">{banner.title}</h3>
                            {banner.caption && (
                                <p style={{ fontSize: '13px', color: '#666', margin: '8px 0', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {banner.caption}
                                </p>
                            )}
                            <div className="profile-course-card__footer">
                                {banner.promoCode ? (
                                    <div className="profile-course-card__rating" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                                        <Ticket size={14} />
                                        {banner.promoCode}
                                    </div>
                                ) : (
                                    <div />
                                )}
                                <div className="profile-course-card__link">
                                    View <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </>
    );
};

export default ProfileOffers;
