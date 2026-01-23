import React from 'react';
import { Bell } from 'lucide-react';
import UpdateCard from '../blocks/UpdateCard';


const ProfileUpdates = ({ updates }) => {
    if (!updates || updates.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Bell size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">No updates yet</h3>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Check back later for news and announcements</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {updates.map((update) => (
                <UpdateCard
                    key={update._id}
                    update={update}
                    layout="horizontal"
                />
            ))}
        </div>
    );
};

export default ProfileUpdates;
