import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star } from 'lucide-react';

const ProfileHero = ({ profile, username }) => {
    return (
        <div className="profile-hero-card">
            <div className="profile-hero-card__avatar-wrapper">
                <img
                    src={profile.image || `https://ui-avatars.com/api/?name=${username}`}
                    alt={profile.name}
                    className="profile-hero-card__avatar"
                />
                <div className="profile-hero-card__badge">AI</div>
            </div>
            <h1 className="profile-hero-card__name">{profile.name || username}</h1>
            <p className="profile-hero-card_bio profile-hero-card_username">
                <span>@ {username}</span>
            </p>
            <p className="profile-hero-card__bio">
                {profile.bio || 'AI Course Creator | Educator'}
            </p>
            <div className="profile-hero-card__actions">
                <button className="profile-hero-card__btn profile-hero-card__btn--secondary">
                    <MessageCircle size={18} />
                    Get Hel
                </button>
                <Link
                    to="/prompts"
                    className="profile-hero-card__btn profile-hero-card__btn--primary"
                >
                    <Star size={18} />
                    Free Prompts
                </Link>
            </div>
        </div>
    );
};

export default ProfileHero;
