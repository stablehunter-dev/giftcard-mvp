'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type RedemptionState = 'INPUT' | 'PENDING' | 'CONFIRMED';

export default function RedemptionPage() {
    const router = useRouter();

    // Form State
    const [quantity, setQuantity] = useState<number | ''>('');
    const [region, setRegion] = useState('hongkong');

    // Mock Data
    const availableBalance = 120; // 120g
    const minRedemption = 100;

    const handleSubmit = () => {
        if (!quantity || Number(quantity) < minRedemption) return;

        // Directly navigate to confirmation/date selection
        router.push(`/redemption/confirm?quantity=${quantity}&region=${region}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/profile" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="font-bold text-lg text-gray-900">實物黃金兌換</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-6 space-y-6">

                {/* State: INPUT View */}
                <div className="space-y-6 animate-fadeIn">
                    {/* Main Heading Text */}
                    <div className="text-center py-2">
                        <p className="text-gray-500 text-sm">
                            將黃金資產兌換為實物黃金，並通過平台支持的地區完成線下提貨。
                        </p>
                    </div>

                    {/* Service Explanation */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
                            <span className="w-1 h-4 bg-yellow-400 rounded-full"></span>
                            服務說明
                        </h3>

                        <div className="space-y-4">
                            {/* Point 1 */}
                            <div className="flex gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm mb-1">預約制履約申請</div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        提交申請後，您可以直接選擇<span className="text-blue-600 font-semibold px-1">期望預約日期</span>並聯繫客服確認。
                                    </p>
                                </div>
                            </div>

                            {/* Point 2 */}
                            <div className="flex gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm mb-1">確認前零費用</div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        在您確認最終履約方案前，<span className="text-green-600 font-semibold px-1">不會扣除任何資產</span>或產生費用。
                                    </p>
                                </div>
                            </div>

                            {/* Point 3 */}
                            <div className="flex gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm mb-1">改期與取消規則</div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        支付確認後，支持<span className="text-purple-600 font-semibold px-1">免費改期一次</span>。若取消兌換，<span className="text-gray-900 font-medium">僅服務費不退還</span>，未兌換的黃金額度<span className="text-green-600 font-semibold px-1">不會被扣除</span>。
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-50 my-2"></div>

                            {/* Fee */}
                            <div className="flex items-center justify-between text-sm pl-2">
                                <span className="text-gray-500">預估履約服務費</span>
                                <div className="text-right">
                                    <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">200 USDT / 次</span>
                                    <p className="text-[10px] text-gray-400 mt-1 mr-1">單次線下提貨固定費率</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-6">

                        {/* Quantity Input */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-gray-700">
                                    兌換數量
                                </label>
                                <button
                                    onClick={() => setQuantity(availableBalance)}
                                    className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded hover:bg-yellow-100 transition-colors"
                                >
                                    MAX
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="0"
                                    className="w-full text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-gray-200 focus:border-yellow-400 focus:ring-0 px-0 pb-2 placeholder-gray-200 transition-colors"
                                />
                                <span className="absolute right-0 bottom-3 text-gray-500 font-medium">克 (g)</span>
                            </div>

                            <div className="flex items-center justify-between mt-3 text-sm">
                                <span className={`transition-colors ${Number(quantity) > 0 && Number(quantity) < minRedemption ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                    最小兌換數量為 {minRedemption} 克
                                </span>
                                <span className="text-gray-500">
                                    可用餘額：<span className="font-medium text-gray-900">{availableBalance} 克</span>
                                </span>
                            </div>
                        </div>

                        {/* Region Selector */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-4">
                                提貨地區
                            </label>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setRegion('hongkong')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${region === 'hongkong'
                                        ? 'border-yellow-400 bg-yellow-50/50'
                                        : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🇭🇰</span>
                                        <div className="text-left">
                                            <div className={`font-semibold ${region === 'hongkong' ? 'text-gray-900' : 'text-gray-600'}`}>香港</div>
                                            <div className="text-xs text-gray-400">Hong Kong</div>
                                        </div>
                                    </div>
                                    {region === 'hongkong' && (
                                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>

                                <button disabled className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl grayscale">🇸🇬</span>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-400">新加坡</div>
                                            <div className="text-xs text-gray-400">Singapore</div>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">暫不可選</span>
                                </button>

                                <button disabled className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl grayscale">🇦🇪</span>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-400">迪拜</div>
                                            <div className="text-xs text-gray-400">Dubai</div>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">暫不可選</span>
                                </button>

                                <button disabled className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-gray-400">更多地區</div>
                                            <div className="text-xs text-gray-400">More regions coming soon</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <p className="mt-3 text-xs text-gray-400 text-center">
                                提貨地區將用於確認合作門店庫存與可預約時間。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                    <div className="max-w-xl mx-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={!quantity || Number(quantity) < minRedemption || Number(quantity) > availableBalance}
                            className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                        >
                            下一步：選擇預約日期
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            提交預約意向不會產生任何費用，也不會凍結你的資產。
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
}
