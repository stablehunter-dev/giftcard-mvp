'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ProfilePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Add state
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const router = useRouter();

    // Check authentication status
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authStatus = localStorage.getItem('isAuthenticated') === 'true';
            setIsAuthenticated(authStatus);

            if (!authStatus) {
                router.push('/auth?redirect=/profile');
            } else {
                setIsLoading(false);
            }
        }
    }, [router]);

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
                <div className="max-w-3xl mx-auto">
                    {/* Large Tether Gold Card - Total Balance */}
                    <div
                        className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 sm:mb-10"
                        style={{
                            background: 'linear-gradient(135deg, #F4D03F 0%, #E9C46A 50%, #D4AF37 100%)',
                            aspectRatio: '1.586',
                            maxHeight: '320px'
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

                    {/* Tab Section */}
                    <div className="flex items-center gap-3 mb-6">
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
                        onClick={() => setShowAppointmentModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-[0.98]"
                        disabled={activeCards.length === 0}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>預約兌換黃金</span>
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

            {/* Appointment Modal */}
            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                敬請期待
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                我們將在2026年春節後開放預約。
                            </p>
                            <button
                                onClick={() => setShowAppointmentModal(false)}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 sm:py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                確定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
