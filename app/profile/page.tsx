'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import TradingViewWidget from '../components/TradingViewWidget';

// Mock data for gold gift cards (支持10g和100g版本，第一批以10g为主)
const mockGoldCards = [
    {
        id: '1',
        brand: 'Tether Gold',
        amount: 10,
        status: 'active',
        serialNumber: 'XHYAAJ9KTWH6RST6',
        bindDate: '2024-01-15 14:30',
    },
    {
        id: '2',
        brand: 'Tether Gold',
        amount: 10,
        status: 'active',
        serialNumber: 'K92M3N4P5Q6R7S8T',
        bindDate: '2024-01-18 09:15',
    },
    {
        id: '3',
        brand: 'Tether Gold',
        amount: 100,
        status: 'inactive',
        serialNumber: 'L3M4N5P6Q7R8S9T0',
        bindDate: '2023-12-20 16:45',
    },
];

function ProfileContent() {
    // Add state
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showRedeemSelectionModal, setShowRedeemSelectionModal] = useState(false);
    const [showDigitalRedeemModal, setShowDigitalRedeemModal] = useState(false);
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [featureIndex, setFeatureIndex] = useState(0); // For feature card selection in onboarding

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const [currentGoldPrice, setCurrentGoldPrice] = useState(85.32);
    const [priceChange24h, setPriceChange24h] = useState(1.24);
    const [trendData, setTrendData] = useState<number[]>([83, 83.5, 84.2, 83.8, 84.5, 85, 84.7, 85.32]);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch real-time XAUT price from API
    useEffect(() => {
        if (isLoading) return;

        const fetchGoldPrice = async () => {
            try {
                // Using a CORS proxy for demo, in production use your backend
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd'
                );
                const data = await response.json();

                // Get XAUT price in USD per ounce (XAUt is pegged to 1 oz gold)
                const pricePerOunce = data['tether-gold']?.usd || 2640; // Fallback

                // Convert to USD per gram (1 oz = 31.1035 grams)
                const pricePerGram = pricePerOunce / 31.1035;
                setCurrentGoldPrice(Math.round(pricePerGram * 100) / 100);

                // Update trend data
                setTrendData(prev => {
                    const newData = [...prev.slice(1), pricePerGram];
                    return newData;
                });
            } catch (error) {
                console.error('Failed to fetch gold price:', error);
                // Keep using current price on error
            }
        };

        // Fetch immediately
        fetchGoldPrice();

        // Update every 30 seconds
        const interval = setInterval(fetchGoldPrice, 30000);

        return () => clearInterval(interval);
    }, [isLoading]);

    // Check authentication status
    useEffect(() => {
        const checkAuth = setTimeout(() => {
            const authStatus = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false;

            if (!authStatus) {
                router.push('/auth?redirect=/profile');
            } else {
                setIsLoading(false);
            }
        }, 0);

        return () => clearTimeout(checkAuth);
    }, [router]);

    // Show onboarding modal when redirected from binding
    useEffect(() => {
        if (!isLoading && searchParams.get('from') === 'binding') {
            const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
            if (!hasSeenOnboarding) {
                setShowOnboardingModal(true);
                setOnboardingStep(1);
            }
            // Clean up URL params
            router.replace('/profile');
        }
    }, [isLoading, searchParams, router]);

    const activeCards = mockGoldCards.filter(card => card.status === 'active');
    const inactiveCards = mockGoldCards.filter(card => card.status === 'inactive');
    const totalAmount = activeCards.reduce((sum, card) => sum + card.amount, 0);

    const displayCards = activeTab === 'active' ? activeCards : inactiveCards;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">載入中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Slim Header with Logo and Logout */}
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
                    <button
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated');
                            router.push('/scan');
                        }}
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                    >
                        登出
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 sm:pt-20 pb-28 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Gold Card (Sticky on Desktop) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-24">
                            {/* Large Tether Gold Card - Total Balance */}
                            <div
                                className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 sm:mb-10 lg:mb-0"
                                style={{
                                    background: 'linear-gradient(135deg, #F4D03F 0%, #E9C46A 50%, #D4AF37 100%)',
                                    aspectRatio: '1.586',
                                    width: '100%'
                                }}
                            >
                                <div className="relative h-full p-6 sm:p-8 flex flex-col items-center justify-center">
                                    {/* Center Section - Amount is King */}
                                    <div className="flex-1 flex flex-col items-center justify-center mt-4">
                                        <div className="flex items-baseline gap-2 translate-x-2">
                                            <span className="text-8xl sm:text-9xl font-bold text-amber-900 tracking-tighter drop-shadow-sm filter">
                                                {totalAmount}
                                            </span>
                                            <span className="text-3xl sm:text-4xl font-medium text-amber-900/80 mb-4 sm:mb-6">g</span>
                                        </div>
                                        <div className="text-sm sm:text-base font-medium text-amber-900/40 tracking-[0.3em] uppercase mt-2">
                                            黃金總額
                                        </div>
                                    </div>

                                    {/* Bottom Right - Powered by Tether Gold */}
                                    <div className="absolute bottom-5 right-6 sm:bottom-6 sm:right-8 flex flex-col items-end">
                                        <span className="text-[10px] sm:text-xs font-medium text-amber-900/40 uppercase tracking-wider mb-1.5">
                                            Powered by
                                        </span>
                                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white/50">
                                            <Image
                                                src="/images/tether-gold-logo.png"
                                                alt="Tether Gold"
                                                width={80}
                                                height={24}
                                                className="object-contain opacity-90"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gold Price Widget */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-xs sm:text-sm font-medium text-gray-500 mb-1">实时金价 (XAUT)</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                                                ${currentGoldPrice}
                                            </span>
                                            <span className="text-sm text-gray-500">/克</span>
                                        </div>
                                    </div>
                                    <div className={`text-right ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <div className="text-xs font-medium">24H</div>
                                        <div className="text-lg font-semibold">
                                            {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                {/* TradingView Widget */}
                                <div className="mt-4">
                                    <div className="text-xs text-gray-500 mb-2">市场行情</div>
                                    <div className="rounded-xl overflow-hidden bg-gray-50" style={{ height: '400px' }}>
                                        <TradingViewWidget />
                                    </div>
                                </div>

                                {/* Asset Value */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-gray-500">您的资产价值</div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">
                                                ${(totalAmount * currentGoldPrice).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {totalAmount}g × ${currentGoldPrice}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[10px] text-gray-400 text-center mt-3">
                                    数据每30秒自动更新
                                </div>
                            </div>
                        </div>

                        {/* Right Column: History and Tabs */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Tab Section */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-5 py-2.5 text-sm sm:text-base font-medium rounded-full transition-all ${activeTab === 'active'
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    可用 ({activeCards.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('inactive')}
                                    className={`px-5 py-2.5 text-sm sm:text-base font-medium rounded-full transition-all ${activeTab === 'inactive'
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    已使用 ({inactiveCards.length})
                                </button>
                            </div>

                            {/* Card List */}
                            <div className="space-y-4">
                                {displayCards.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="text-7xl mb-4 opacity-50">📇</div>
                                        <p className="text-gray-500 text-lg">暂无{activeTab === 'active' ? '可用' : '已使用'}的记录</p>
                                    </div>
                                ) : (
                                    displayCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                                        >
                                            <div className="flex items-center justify-between">
                                                {/* Left: Date and Serial */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm text-gray-500">{card.bindDate}</span>
                                                        {card.status === 'inactive' && (
                                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">已使用</span>
                                                        )}
                                                    </div>
                                                    <div className="text-base sm:text-lg font-mono text-gray-900 tracking-wide font-medium group-hover:text-yellow-600 transition-colors">
                                                        {card.serialNumber}
                                                    </div>
                                                </div>

                                                {/* Right: Amount */}
                                                <div className="text-right">
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className={`text-2xl sm:text-3xl font-bold ${card.status === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
                                                            {card.amount}
                                                        </span>
                                                        <span className={`text-sm sm:text-base font-medium ${card.status === 'active' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            g
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 safe-area-inset-bottom z-40">
                <div className="max-w-3xl mx-auto px-4 py-4 sm:py-5 flex gap-4">
                    <Link
                        href="/activate"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 border-2 border-gray-200 rounded-full text-gray-700 font-medium hover:border-yellow-400 hover:text-yellow-600 transition-all active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>綁定新卡</span>
                    </Link>
                    <button
                        onClick={() => setShowRedeemSelectionModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-[0.98]"
                        disabled={activeCards.length === 0}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>我要兌換</span>
                    </button>
                </div>
            </div>

            {/* Floating WhatsApp FAB */}
            <a
                href="https://wa.me/85212345678"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-28 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
                aria-label="聯絡 WhatsApp 客服"
            >
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    需要協助？
                </span>
            </a>

            {/* Redeem Selection Modal */}
            {showRedeemSelectionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 pb-safe-bottom">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-slideUp sm:animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                選擇兌換方式
                            </h3>
                            <button
                                onClick={() => setShowRedeemSelectionModal(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {/* Option 1: Physical Gold */}
                            <button
                                onClick={() => {
                                    setShowRedeemSelectionModal(false);
                                    router.push('/redemption');
                                }}
                                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50/50 transition-all text-left group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                    <span className="text-3xl">🧈</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900 text-lg">實物黃金</h4>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500">預約前往指定門店提取實物金條，看得見的財富</p>
                                </div>
                            </button>

                            {/* Option 2: Digital Token */}
                            <button
                                onClick={() => {
                                    setShowRedeemSelectionModal(false);
                                    setShowDigitalRedeemModal(true);
                                }}
                                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                    <span className="text-3xl">🪙</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900 text-lg">XAUt / USDT</h4>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500">提現數字代幣至您的加密錢包，靈活掌控資產</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Physical Gold Appointment Modal (Coming Soon) */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-yellow-200">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                敬請期待
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-[80%] mx-auto leading-relaxed">
                                實物黃金兌換服務將在<br />
                                <span className="font-semibold text-yellow-600">2026年春節後</span><br />
                                正式開放預約
                            </p>
                            <button
                                onClick={() => setShowAppointmentModal(false)}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-lg py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                            >
                                我知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Token Redeem Modal (Coming Soon) */}
            {showDigitalRedeemModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-200">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                                敬請期待
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-[80%] mx-auto leading-relaxed">
                                XAUt / USDT 提現功能<br />
                                即將上線，盡請期待
                            </p>
                            <button
                                onClick={() => setShowDigitalRedeemModal(false)}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium text-lg py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                            >
                                我知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Onboarding Modal */}
            {showOnboardingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Step 1: Congratulations */}
                        {onboardingStep === 1 && (
                            <div className="text-center">
                                {/* Celebration Icon */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                    🎉 恭喜您！
                                </h3>
                                <p className="text-lg sm:text-xl text-gray-700 mb-6">
                                    您已成功激活數字黃金賬戶
                                </p>

                                {/* Rights List */}
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 mb-6 text-left border border-amber-100">
                                    <h4 className="font-semibold text-gray-900 mb-4 text-center">您現在擁有以下權益：</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">安全的數字黃金資產存儲</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">靈活的提現與兌換選項</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">實物黃金預約兌換資格</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setOnboardingStep(2)}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    下一步
                                </button>
                            </div>
                        )}

                        {/* Step 2: Feature Walkthrough (Carousel) */}
                        {onboardingStep === 2 && (
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                                    您的數字黃金可以做什麼？
                                </h3>
                                <div className="text-sm text-gray-500 mb-6 text-center flex justify-center gap-1.5">
                                    {/* Progress Indicators */}
                                    {[0, 1, 2, 3].map(idx => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === featureIndex ? 'w-6 bg-yellow-500' : 'w-1.5 bg-gray-200'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-center min-h-[300px]">
                                    {/* Left: Text Content */}
                                    <div className="flex-1 text-center md:text-left space-y-4 order-2 md:order-1">
                                        {featureIndex === 0 && (
                                            <div className="animate-fadeIn">
                                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                                    <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">提現 XAUt / USDT</h4>
                                                <p className="text-gray-600 leading-relaxed">
                                                    將您的數字黃金餘額提現為 XAUt 或 USDT，直接轉入您的個人加密貨幣錢包，資產掌控在自己手中。
                                                </p>
                                            </div>
                                        )}
                                        {featureIndex === 1 && (
                                            <div className="animate-fadeIn">
                                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">兌換實物黃金</h4>
                                                <p className="text-gray-600 leading-relaxed">
                                                    在線預約，前往指定門店將數字餘額兌換為實物金條。最低 100g 起兌，讓看不見的數字資產變成看得見的真實財富。
                                                </p>
                                            </div>
                                        )}
                                        {featureIndex === 2 && (
                                            <div className="animate-fadeIn">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">在線購買黃金禮品卡</h4>
                                                <p className="text-gray-600 leading-relaxed">
                                                    即將支援使用餘額直接購買黃金禮品卡，將這份珍貴的禮物輕鬆發送給親朋好友。
                                                </p>
                                            </div>
                                        )}
                                        {featureIndex === 3 && (
                                            <div className="animate-fadeIn">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                                                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">邀請好友返利</h4>
                                                <p className="text-gray-600 leading-relaxed">
                                                    邀請好友註冊並購買禮品卡，您將獲得黃金返利獎勵。分享越多，收穫越多。
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Visual Placeholder */}
                                    <div className="flex-1 w-full order-1 md:order-2">
                                        <div className="bg-gray-50 rounded-3xl aspect-[4/3] md:aspect-square flex flex-col items-center justify-center relative overflow-hidden border border-gray-100 shadow-inner">
                                            {/* Content based on index */}
                                            {featureIndex === 0 && (
                                                <div className="text-center p-6 animate-fadeIn">
                                                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                                                        <span className="text-3xl">🪙</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-400">錢包提現示意圖</div>
                                                </div>
                                            )}
                                            {featureIndex === 1 && (
                                                <div className="text-center p-6 animate-fadeIn">
                                                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                                                        <span className="text-3xl">🧈</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-400">實物兌換示意圖</div>
                                                </div>
                                            )}
                                            {featureIndex === 2 && (
                                                <div className="text-center p-6 animate-fadeIn">
                                                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 opacity-50">
                                                        <span className="text-3xl">🎁</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-amber-200 transform -rotate-6">
                                                            敬請期待
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {featureIndex === 3 && (
                                                <div className="text-center p-6 animate-fadeIn">
                                                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 opacity-50">
                                                        <span className="text-3xl">🤝</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-amber-200 transform -rotate-6">
                                                            敬請期待
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            if (featureIndex < 3) {
                                                setFeatureIndex(prev => prev + 1);
                                            } else {
                                                localStorage.setItem('hasSeenOnboarding', 'true');
                                                setShowOnboardingModal(false);
                                                setOnboardingStep(1);
                                                setFeatureIndex(0);
                                            }
                                        }}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-lg py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        {featureIndex < 3 ? (
                                            <>
                                                下一步
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                開始使用
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">載入中...</p>
                </div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
