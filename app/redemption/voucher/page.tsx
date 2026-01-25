'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RedemptionVoucherPage() {
    const router = useRouter();
    // Mock Voucher Data
    const voucher = {
        id: 'REF-20260125-HK-001',
        amount: 200,
        region: '香港',
        storeName: 'Point Gold Hong Kong Refinery (點金香港冶煉廠)',
        address: '香港紅磡鶴園東街 4 號恆藝珠寶大廈 1 樓',
        date: '2026 / 02 / 10 (週二)',
        contact: '+852 2333 8888'
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-20 text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-md">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/profile" className="p-2 -ml-2 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                    <h1 className="font-bold text-lg">實物黃金提貨憑證</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 pt-20 pb-8">

                {/* Status Badge */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>憑證有效</span>
                    </div>
                </div>

                {/* Voucher Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl text-gray-900 relative">
                    {/* Top Section: Gold Gradient */}
                    <div className="h-32 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern.png')] bg-repeat"></div>

                        <div className="text-center z-10">
                            <div className="text-yellow-900/60 font-bold uppercase tracking-widest text-xs mb-1">GOLD REDEMPTION VOUCHER</div>
                            <div className="text-4xl font-bold text-yellow-900 tracking-tight">{voucher.amount}<span className="text-xl align-top ml-1">g</span></div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 relative">
                        {/* Cutout Circles */}
                        <div className="absolute -top-3 left-0 w-6 h-6 bg-gray-900 rounded-full translate-x-[-50%]"></div>
                        <div className="absolute -top-3 right-0 w-6 h-6 bg-gray-900 rounded-full translate-x-[50%]"></div>
                        <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-gray-200"></div>

                        <div className="space-y-6 pt-4">
                            {/* QR Code Placeholder */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-48 bg-gray-100 rounded-xl mb-3 flex items-center justify-center border-4 border-white shadow-inner">
                                    <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v3h2v-3h2v2h-2v1h-2v1h-2v-2zm-3 7h3v2h-3v-2zm6 0h3v2h-3v-2z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="font-mono font-bold text-gray-600 text-lg tracking-widest">{voucher.id}</p>
                                    <p className="text-xs text-gray-400 mt-1">請在提貨時向店員出示此憑證</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Details Grid */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">提貨地點</label>
                                    <div className="flex items-start gap-2">
                                        <div className="text-xl">📍</div>
                                        <div>
                                            <div className="font-bold">{voucher.storeName}</div>
                                            <div className="text-sm text-gray-500 leading-snug mt-0.5">{voucher.address}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">提貨日期</label>
                                        <div className="font-bold flex items-center gap-2">
                                            <span>📅</span> {voucher.date}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">聯繫電話</label>
                                    <div className="font-bold flex items-center gap-2 text-gray-900">
                                        <span>📞</span> {voucher.contact}
                                    </div>
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                                <strong>提貨須知：</strong><br />
                                • 請攜帶本人有效身份證明原件<br />
                                • 提貨需現場核銷本憑證二維碼<br />
                                • 如需改期，請提前至少 24 小時聯繫專屬客服
                            </div>
                        </div>
                    </div>
                </div>

                {/* CS Action */}
                <div className="mt-8 text-center space-y-4">
                    <button className="text-gray-400 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        聯繫客服
                    </button>

                    {/* Mock Reset Button */}
                    <button
                        onClick={() => router.push('/redemption')}
                        className="text-xs text-gray-600 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        (測試用) 結束訂單並發起新兌換
                    </button>
                </div>
            </main>
        </div>
    );
}
