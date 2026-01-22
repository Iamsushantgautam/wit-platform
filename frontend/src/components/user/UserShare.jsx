import React from 'react';
import { QrCode, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';

const UserShare = ({ user }) => {
    const publicUrl = `http://${user.username}.${window.location.hostname.includes('localhost') ? 'localhost:5173' : window.location.host}`;

    return (
        <div className="text-center">
            <h2 className="dashboard-section-title justify-center">
                <QrCode className="text-accent" />
                <span>Share Your Profile</span>
            </h2>

            <div className="bg-white p-8 rounded-2xl shadow-xl inline-block mb-8 border border-gray-100">
                <QRCode value={publicUrl} size={200} />
            </div>

            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Scan to visit your profile</p>
            <p className="text-gray-500 mb-8">{publicUrl}</p>

            <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary px-8 py-3"
            >
                Open Public Profile <ExternalLink size={18} className="ml-2" />
            </a>
        </div>
    );
};

export default UserShare;
