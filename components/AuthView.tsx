import React, { useState } from 'react';
import { Mail, Lock, Chrome, Dumbbell } from 'lucide-react';
import { api } from '../api';

export const AuthView: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await api.signInWithEmail(email, password);
                if (error) throw error;
            } else {
                const { error } = await api.signUpWithEmail(email, password);
                if (error) throw error;
                // Depending on config, might need email confirmation. 
                // For now assuming auto-confirm or user is notified.
                alert('Please check your email for confirmation link if required.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await api.signInWithGoogle();
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Dumbbell className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-100">
                        {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        {isLogin ? 'مرحباً بك مجدداً في Gym Tracker' : 'ابدأ رحلتك الرياضية معنا'}
                    </p>
                </div>

                <div className="bg-surface p-8 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-zinc-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg bg-background border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-primary focus:ring-primary pr-10 py-3 sm:text-sm transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg bg-background border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-primary focus:ring-primary pr-10 py-3 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'تسجيل')}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-surface text-zinc-500">
                                    أو
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-zinc-700 rounded-lg shadow-sm text-sm font-medium text-zinc-200 bg-surfaceHighlight hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
                        >
                            <Chrome className="h-5 w-5 ml-2 text-zinc-100" />
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-medium text-primary hover:text-primaryDark transition-colors"
                        >
                            {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
