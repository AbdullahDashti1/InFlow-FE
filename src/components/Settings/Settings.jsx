import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../contexts/UserContext';
import * as userService from '../../services/userService';

import { Save, Loader2, Lock, User, Building } from 'lucide-react';

const Settings = () => {
    const { user, setUser } = useContext(UserContext);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm({
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            company_name: user?.company_name || ''
        }
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

    const onProfileSubmit = async (data) => {
        setLoadingProfile(true);
        setMessage({ type: '', text: '' });
        try {
            const updatedUser = await userService.updateProfile(data);
            setUser({ ...user, ...updatedUser });
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setLoadingProfile(false);
        }
    };

    const onPasswordSubmit = async (data) => {
        setLoadingPassword(true);
        setMessage({ type: '', text: '' });
        if (data.new_password !== data.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoadingPassword(false);
            return;
        }

        try {
            await userService.updatePassword({
                current_password: data.current_password,
                new_password: data.new_password
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            resetPassword();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and preferences</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-8">
                {/* Profile Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                    </div>

                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <div className="relative">
                                <input
                                    value={user?.role || ''}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none capitalize"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                {...registerProfile('username', { required: true })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                {...registerProfile('email', { required: true })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    {...registerProfile('company_name')}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingProfile}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Security</h2>
                    </div>

                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                {...registerPassword('current_password', { required: 'Required' })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            {passwordErrors.current_password && <p className="text-xs text-red-500 mt-1">{passwordErrors.current_password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type="password"
                                {...registerPassword('new_password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            {passwordErrors.new_password && <p className="text-xs text-red-500 mt-1">{passwordErrors.new_password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                {...registerPassword('confirm_password', { required: 'Required' })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loadingPassword}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loadingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;