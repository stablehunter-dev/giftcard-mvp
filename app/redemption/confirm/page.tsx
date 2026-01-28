'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function RedemptionConfirmContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isContacting, setIsContacting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Get params or defaults
    const quantity = searchParams.get('quantity') || '200';
    const region = searchParams.get('region') === 'hongkong' ? '香港' : '香港';

    // Generate next 4 weeks of available dates (Tue & Thu)
    const generateAvailableDates = () => {
        // Dev: Allow mocking empty state
        if (searchParams.get('mock_empty') === 'true') return [];

        const dates = [];
        const today = new Date();
        const current = new Date(today);
        current.setDate(current.getDate() + 1); // Start checking from tomorrow

        while (dates.length < 8) {
            // 2 = Tuesday, 4 = Thursday
            if (current.getDay() === 2 || current.getDay() === 4) {
                const yyyy = current.getFullYear();
                const mm = String(current.getMonth() + 1).padStart(2, '0');
                const dd = String(current.getDate()).padStart(2, '0');
                const weekDay = current.getDay() === 2 ? '週二' : '週四';
                dates.push(`${yyyy} / ${mm} / ${dd} (${weekDay})`);
            }
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const availableDates = generateAvailableDates();

    const handleContactCS = () => {
        if (!selectedDate) return;
        setIsContacting(true);
        // Simulate proceeding
        setTimeout(() => {
            router.push('/redemption/payment');
        }, 1500);
    };

    const handleExit = () => {
        router.push('/profile');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-28">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/redemption" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="font-bold text-lg text-gray-900">預約兌換</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-6 space-y-6">

                {/* Title Section */}
                <div className="text-center py-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {availableDates.length > 0 ? '請選擇期望預約日期' : '暫無可預約時段'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {availableDates.length > 0 ? '確認預約信息無誤後，聯繫客服完成最終確認與付款。' : '當前合作門店預約已滿，請稍後再試。'}
                    </p>
                </div>

                {/* Info Card 1: Redemption Info & Fees */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-bold text-gray-700 text-sm">兌換方案詳情</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">兌換數量</span>
                            <span className="font-bold text-xl text-gray-900">{quantity} <span className="text-sm font-normal text-gray-500">克實物黃金</span></span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">提貨地區</span>
                            <span className="font-semibold text-gray-900">{region}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">提貨方式</span>
                            <span className="font-semibold text-gray-900">指定合作門店線下提貨</span>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 my-2"></div>

                        {/* Fee Section (Merged) */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500">履約服務費</span>
                                <span className="font-bold text-lg text-gray-900">200 <span className="text-sm font-normal text-gray-500">USDT</span></span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed text-right">
                                涵蓋預約、倉儲、人員交付等成本
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Card 2: Date Selector */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 text-sm">選擇提貨日期</h3>
                        {availableDates.length > 0 && <span className="text-xs text-blue-600 font-medium">尚有空位</span>}
                    </div>
                    <div className="p-4">
                        {availableDates.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {availableDates.map((date, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedDate === date
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-transparent hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedDate === date ? 'border-gray-900' : 'border-gray-300'
                                            }`}>
                                            {selectedDate === date && <div className="w-2.5 h-2.5 bg-gray-900 rounded-full"></div>}
                                        </div>
                                        <div className="flex items-center gap-2 font-mono text-gray-700 font-medium">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {date}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-900 font-bold mb-1">暫無可預約時段</p>
                                <p className="text-sm text-gray-500">近期預約已滿，請嘗試切換提貨地區或稍後再試。</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <p className="text-xs text-blue-700/60 leading-relaxed font-medium">
                        付款後即鎖定庫存，服務費將不予退還。<br />
                        如需變更行程，我們提供一次免費改約機會。
                    </p>
                </div>
            </main>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                <div className="max-w-xl mx-auto space-y-3">
                    {availableDates.length > 0 ? (
                        <>
                            <button
                                onClick={handleContactCS}
                                disabled={isContacting || !selectedDate}
                                className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                            >
                                {isContacting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        正在提交申請...
                                    </>
                                ) : (
                                    <>
                                        <span>{selectedDate ? '提交申請' : '請先選擇預約日期'}</span>
                                        {selectedDate && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleExit}
                            className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                        >
                            暫無法預約，退出
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RedemptionConfirmPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RedemptionConfirmContent />
        </Suspense>
    );
}
