import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

type Stage = 'register' | 'verify';

export const SignUp: React.FC = () => {
    const { signUp, setActive, isLoaded } = useSignUp();
    const navigate = useNavigate();

    const [stage, setStage] = useState<Stage>('register');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 1: create the account and send OTP
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setError('');
        setIsSubmitting(true);

        try {
            await signUp.create({ emailAddress: email, password, firstName, lastName });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setStage('verify');
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message ?? 'Sign-up failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: verify OTP
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({ code });
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                navigate('/', { replace: true });
            } else {
                setError('Verification incomplete. Please try again.');
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: { message: string }[] };
            setError(clerkError.errors?.[0]?.message ?? 'Invalid code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBase =
        'w-full py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all';

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/10 dark:bg-brand-red/5 rounded-full -ml-32 -mb-32 blur-3xl" />

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20">
                        <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full transition-colors" />
                    </div>
                    {stage === 'register' ? (
                        <>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Create account</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Join Findr today</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Check your email</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                We sent a 6-digit code to <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>
                            </p>
                        </>
                    )}
                </div>

                {/* Register Form */}
                {stage === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Name row */}
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                    <User size={16} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className={`${inputBase} pl-10 pr-3`}
                                />
                            </div>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    required
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className={`${inputBase} px-4`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={`${inputBase} pl-11 pr-4`}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                placeholder="Password (min 8 chars)"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={`${inputBase} pl-11 pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && <p className="text-sm text-red-500 dark:text-red-400 text-center px-2">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting || !isLoaded}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-blue text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-brand-blue/90 active:scale-95 transition-all disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creating account…' : 'Create Account'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {/* Verify Form */}
                {stage === 'verify' && (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            placeholder="6-digit code"
                            value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                            className={`${inputBase} px-4 text-center text-2xl tracking-[0.5em] font-bold`}
                        />

                        {error && <p className="text-sm text-red-500 dark:text-red-400 text-center px-2">{error}</p>}

                        <button
                            type="submit"
                            disabled={isSubmitting || !isLoaded || code.length < 6}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-blue text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-brand-blue/90 active:scale-95 transition-all disabled:opacity-60"
                        >
                            {isSubmitting ? 'Verifying…' : 'Verify Email'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStage('register')}
                            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-colors"
                        >
                            ← Back to registration
                        </button>
                    </form>
                )}

                {/* Footer */}
                {stage === 'register' && (
                    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="font-semibold text-brand-blue hover:underline">
                            Sign in
                        </Link>
                    </p>
                )}
                <p className="mt-12 text-center text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                    Google Developer Groups on Campus - USTP
                </p>
            </div>
        </div>
    );
};
