'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/scan';

    // Check if already logged in
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
                router.push(redirectTo);
            }
        }
    }, [router, redirectTo]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSendCode = async () => {
        setErrors({});

        if (!email || !validateEmail(email)) {
            setErrors({ email: '請輸入有效的郵箱地址' });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call to send verification code
        setTimeout(() => {
            setIsSubmitting(false);
            setCodeSent(true);
            setCountdown(60);
            // In production, this would trigger an email with verification code
        }, 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!email || !validateEmail(email)) {
            setErrors({ email: '請輸入有效的郵箱地址' });
            return;
        }

        if (!verificationCode || verificationCode.length !== 6) {
            setErrors({ code: '請輸入6位驗證碼' });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call to verify code
        setTimeout(() => {
            // Store authentication state
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userInfo', JSON.stringify({
                email: email
            }));

            // Redirect to target page
            router.push(redirectTo);
        }, 1000);
    };

    // Quick skip for mock testing
    const handleQuickLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify({
            email: 'mock@goldfin.com'
        }));
        router.push(redirectTo);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Slim Header with CTA */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
                    <Link href="/scan">
                        <Image
                            src="/images/goldfin-logo.png"
                            alt="Goldfin"
                            width={90}
                            height={30}
                            className="object-contain cursor-pointer"
                            priority
                        />
                    </Link>
                    <Link
                        href="/scan"
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                    >
                        返回首頁
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6">
                <div className="max-w-md mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-12 pt-6 sm:pt-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4">
                            歡迎使用 GoldFin
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 font-light">
                            {codeSent ? '請查收郵箱中的驗證碼' : '使用郵箱驗證碼登入或註冊'}
                        </p>
                    </div>

                    {/* Auth Form Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    電子郵箱 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.email;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        disabled={codeSent}
                                        className={`flex-1 px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="請輸入郵箱地址"
                                    />
                                    {!codeSent ? (
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={isSubmitting}
                                            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-sm sm:text-base rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isSubmitting ? '發送中' : '獲取驗證碼'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={countdown > 0}
                                            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-200 text-gray-600 font-medium text-sm sm:text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {countdown > 0 ? `${countdown}秒` : '重新發送'}
                                        </button>
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs sm:text-sm text-red-500">{errors.email}</p>
                                )}
                                {codeSent && !errors.email && (
                                    <p className="mt-1.5 text-xs sm:text-sm text-green-600">驗證碼已發送至您的郵箱</p>
                                )}
                            </div>

                            {/* Verification Code */}
                            {codeSent && (
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                        驗證碼 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="code"
                                        value={verificationCode}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setVerificationCode(value);
                                            if (errors.code) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.code;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        className={`w-full px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${errors.code ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="請輸入6位驗證碼"
                                        maxLength={6}
                                    />
                                    {errors.code && (
                                        <p className="mt-1.5 text-xs sm:text-sm text-red-500">{errors.code}</p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            {codeSent && (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 sm:py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? '驗證中...' : '確認登入'}
                                </button>
                            )}
                        </form>

                        {/* Divider */}
                        <div className="relative my-6 sm:my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 bg-white text-gray-500">或</span>
                            </div>
                        </div>

                        {/* Third-party Login Placeholder */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                disabled
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google 登入（即將推出）
                            </button>

                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
                                disabled
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                GitHub 登入（即將推出）
                            </button>
                        </div>
                    </div>

                    {/* Quick Login for Mock Testing */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-6">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-blue-800 font-medium mb-2">
                                    開發測試模式
                                </p>
                                <button
                                    type="button"
                                    onClick={handleQuickLogin}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-all"
                                >
                                    快速跳過登入（Mock）
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Terms Notice */}
                    <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
                        登入或註冊即表示您同意我們的
                        <button className="text-yellow-600 hover:underline mx-1">服務條款</button>
                        和
                        <button className="text-yellow-600 hover:underline ml-1">隱私政策</button>
                    </div>
                </div>
            </main>

            {/* Floating WhatsApp FAB */}
            <a
                href="https://wa.me/85212345678"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
                aria-label="聯絡 WhatsApp 客服"
            >
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    需要協助？
                </span>
            </a>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        </div>}>
            <AuthContent />
        </Suspense>
    );
}
