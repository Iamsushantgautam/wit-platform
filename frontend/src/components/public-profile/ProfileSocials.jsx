import React from 'react';
import {
    FaInstagram, FaYoutube, FaTelegram, FaTwitter,
    FaFacebook, FaWhatsapp, FaDiscord, FaLinkedin,
    FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const ProfileSocials = ({ socialLinks, getSocialIcon }) => {
    // Check if any social links exist
    if (!socialLinks || !Object.keys(socialLinks).some(key => socialLinks[key])) {
        return null;
    }

    return (
        <div className="profile-social-section">
            <h3 className="profile-social-title">Connect With Me</h3>
            <div className="profile-social-grid">
                {Object.entries(socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    return (
                        <a
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="profile-social-item"
                        >
                            <div className={`profile-link-item__icon profile-link-item__icon--${platform}`}>
                                {getSocialIcon(platform)}
                            </div>
                            <span className="profile-social-label">{platform}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileSocials;
