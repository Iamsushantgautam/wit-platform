import React from 'react';
import { ShieldAlert, AlertCircle, Eye, EyeOff } from 'lucide-react';

const UserAccount = ({
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    updateAccount,
    saving
}) => {
    return (
        <form onSubmit={updateAccount}>
            <h2 className="dashboard-section-title text-red-600">
                <ShieldAlert />
                <span>Security Settings</span>
            </h2>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-6 rounded-2xl mb-10">
                <div className="flex gap-4">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-red-800 dark:text-red-400">Important Notice</h4>
                        <p className="text-sm text-red-700 dark:text-red-500/80 mt-1 leading-relaxed">
                            Changing your username will update your public profile URL. Your current URL will be automatically redirected to the new one, but we recommend only doing this when necessary.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="form-group max-w-md">
                    <label className="label-premium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-premium"
                    />
                </div>

                <div className="form-group max-w-md">
                    <label className="label-premium">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-premium pr-10" placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Leave blank if you don't want to change your password.</p>
                </div>
            </div>

            <button type="submit" disabled={saving} className="btn mt-10 px-8 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none">
                {saving ? 'Updating...' : 'Update Account'}
            </button>
        </form>
    );
};

export default UserAccount;
