import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import ProfileSocials from './ProfileSocials';

const ProfileHero = ({ profile, username, featureFlags }) => {
    // Get Lucide icon component by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon ? Icon : LucideIcons.Link; // fallback to Link icon
    };

    // Get button configurations with defaults
    const button1 = profile?.heroButtons?.button1 || {
        label: 'Get Help',
        icon: 'MessageCircle',
        link: '#',
        isVisible: true
    };

    const button2 = profile?.heroButtons?.button2 || {
        label: 'Free Prompts',
        icon: 'Star',
        link: '/prompts',
        isVisible: true
    };

    const Button1Icon = getIconComponent(button1.icon);
    const Button2Icon = getIconComponent(button2.icon);

    // Helper to determine if link is internal or external
    const isInternalLink = (link) => {
        return link.startsWith('/') || link.startsWith('#');
    };

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
            {(!featureFlags || featureFlags.userHeroButtonsEnabled !== false) && (
                <div className="profile-hero-card__actions">
                    {button1.isVisible && (
                        isInternalLink(button1.link) ? (
                            <Link
                                to={button1.link}
                                className="profile-hero-card__btn profile-hero-card__btn--secondary"
                            >
                                <Button1Icon size={18} />
                                {button1.label}
                            </Link>
                        ) : (
                            <a
                                href={button1.link}
                                target="_blank"
                                rel="noreferrer"
                                className="profile-hero-card__btn profile-hero-card__btn--secondary"
                            >
                                <Button1Icon size={18} />
                                {button1.label}
                            </a>
                        )
                    )}
                    {button2.isVisible && (
                        isInternalLink(button2.link) ? (
                            <Link
                                to={button2.link}
                                className="profile-hero-card__btn profile-hero-card__btn--primary"
                            >
                                <Button2Icon size={18} />
                                {button2.label}
                            </Link>
                        ) : (
                            <a
                                href={button2.link}
                                target="_blank"
                                rel="noreferrer"
                                className="profile-hero-card__btn profile-hero-card__btn--primary"
                            >
                                <Button2Icon size={18} />
                                {button2.label}
                            </a>
                        )
                    )}

                </div>
            )}

        </div>
    );
};

export default ProfileHero;
