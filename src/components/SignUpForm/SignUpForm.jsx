import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { signUp, signIn } from '../../services/authService';
import { DollarSign, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signUp(data);
            // Auto login after sign up
            const user = await signIn({ username: data.username, password: data.password });
            setUser(user);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl z-10 border border-slate-100 relative">
                <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join InFlow today</p>
                </div>



                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <input
                            {...register('username', { required: 'Username is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            placeholder="johndoe"
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none bg-white"
                        >
                            <option value="owner">Owner</option>
                            <option value="accountant">Accountant</option>
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                        <input
                            {...register('company_name', { required: 'Company Name is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors outline-none"
                            placeholder="Acme Inc."
                        />
                        {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/sign-in" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;