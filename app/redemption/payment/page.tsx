'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type PaymentState = 'WAITING_FOR_PAYMENT' | 'GENERATING_VOUCHER';

export default function RedemptionPaymentPage() {
    const router = useRouter();
    const [status, setStatus] = useState<PaymentState>('WAITING_FOR_PAYMENT');

    // Dev Helper to proceed
    const handleSimulatePaymentReceived = () => {
        setStatus('GENERATING_VOUCHER');

        // Simulate voucher generation delay
        setTimeout(() => {
            router.push('/redemption/voucher');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="w-8"></div>
                    <h1 className="font-bold text-lg text-gray-900">
                        {status === 'WAITING_FOR_PAYMENT' ? '預約確認與支付' : '付款已確認'}
                    </h1>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="flex-1 max-w-xl mx-auto px-6 py-12 flex flex-col items-center text-center">

                {status === 'WAITING_FOR_PAYMENT' ? (
                    <div className="animate-fadeIn w-full">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <svg className="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="absolute top-0 right-0 flex h-6 w-6">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-yellow-500"></span>
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            申請已提交<br />請聯繫客服完成後續步驟
                        </h2>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left text-gray-600 space-y-4">
                            <p className="font-medium text-gray-900 mb-2">請點擊下方按鈕聯繫專屬客服，並完成以下步驟：</p>
                            <ul className="list-inside space-y-2 text-sm">
                                <li className="flex gap-2">
                                    <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                                    <span>確認最終預約提貨時間</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                                    <span>支付履約服務費 (200 USDT)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                                    <span>獲取實物黃金提貨憑證</span>
                                </li>
                            </ul>
                        </div>

                        <div className="w-full space-y-3">
                            <a href="https://wa.me/85212345678" target="_blank" className="block w-full py-4 rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                聯繫專屬客服
                            </a>

                            <button
                                onClick={() => router.push('/redemption')}
                                className="block w-full py-4 rounded-full border border-gray-200 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                                取消兌換申請
                            </button>

                            {/* Mock Button for User Testing */}
                            <button
                                onClick={handleSimulatePaymentReceived}
                                className="block w-full py-2 rounded-full text-gray-300 font-medium hover:text-gray-400 transition-colors text-xs"
                            >
                                (測試用) 模擬付款完成
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fadeIn w-full">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            付款已確認
                        </h2>

                        <p className="text-gray-600 text-lg mb-12">
                            我們已確認收到你的付款。<br />
                            當前正在為你生成實物黃金提貨憑證。
                        </p>

                        {/* Loader */}
                        <div className="relative pt-4">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-100">
                                <div className="animate-progress w-full shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400"></div>
                            </div>
                            <p className="text-sm text-gray-400">通常需要數分鐘，請稍候...</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Dev Tools */}
            {status === 'WAITING_FOR_PAYMENT' && (
                <div className="fixed bottom-4 right-4 z-50 text-xs">
                    <button
                        onClick={handleSimulatePaymentReceived}
                        className="bg-black/80 text-white px-3 py-2 rounded hover:bg-black transition-colors"
                    >
                        [Dev] Simulate Payment Received
                    </button>
                </div>
            )}
        </div>
    );
}
