'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Supported blockchain networks
interface Chain {
    id: string;
    name: string;
    displayName: string;
    token: string;
    icon: string;
    recommended?: boolean;
    addressPrefix: string;
}

const CHAINS: Chain[] = [
    { id: 'TRON_USDT', name: 'TRON', displayName: 'TRON (TRC-20)', token: 'USDT', icon: '🔷', recommended: true, addressPrefix: 'T' },
    { id: 'ETH_USDT', name: 'Ethereum', displayName: 'Ethereum (ERC-20)', token: 'USDT', icon: '⬡', addressPrefix: '0x' },
    { id: 'ARBITRUM_USDT', name: 'Arbitrum', displayName: 'Arbitrum One', token: 'USDT', icon: '🔹', addressPrefix: '0x' },
    { id: 'BASE_USDT', name: 'Base', displayName: 'Base', token: 'USDT', icon: '🔵', recommended: true, addressPrefix: '0x' },
    { id: 'MATIC_USDT', name: 'Polygon', displayName: 'Polygon (POS)', token: 'USDT', icon: '💜', addressPrefix: '0x' },
    { id: 'BSC_USDT', name: 'BSC', displayName: 'BNB Smart Chain', token: 'USDT', icon: '🟡', recommended: true, addressPrefix: '0x' },
    { id: 'SOL_USDT', name: 'Solana', displayName: 'Solana', token: 'USDT', icon: '🟣', addressPrefix: '' },
];

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const serialNumber = searchParams.get('serial') || '';
    const amount = Number(searchParams.get('amount')) || 0;
    const price = Number(searchParams.get('price')) || 0;
    const cardType = searchParams.get('type') || '';
    const resellerName = searchParams.get('reseller') || '';

    // Chain selection state
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [showChainSelection, setShowChainSelection] = useState(true);

    // Payment state
    const [isPaying, setIsPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | 'insufficient'>('pending');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(60); // 1 minute
    const [isExpired, setIsExpired] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [paymentAddress, setPaymentAddress] = useState('');
    const [currentPrice, setCurrentPrice] = useState(price);
    const [originalPrice, setOriginalPrice] = useState(price);

    // Payment tracking
    const [paidAmount, setPaidAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

    // Price update notification
    const [showPriceUpdate, setShowPriceUpdate] = useState(false);
    const [previousPrice, setPreviousPrice] = useState(price);
    const [cycleCount, setCycleCount] = useState(0); // Track how many 1-minute cycles have passed

    // Generate new payment address and price
    const generatePayment = async (chain: Chain) => {
        setShowWarning(false);
        setCountdown(60);
        setPaidAmount(0);
        setRemainingAmount(0);
        setPaymentStatus('pending');
        setShowPriceUpdate(false);
        setCycleCount(0);

        // Fetch initial price
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd'
            );
            const data = await response.json();
            const pricePerOunce = data['tether-gold']?.usd || 2640;
            const pricePerGram = pricePerOunce / 31.1035;
            const premium = 0.15;
            const newPrice = Math.round(amount * pricePerGram * (1 + premium));
            setCurrentPrice(newPrice);
            setOriginalPrice(newPrice);
            setPreviousPrice(newPrice);
        } catch (error) {
            console.error('Failed to fetch price:', error);
            setCurrentPrice(price);
            setOriginalPrice(price);
            setPreviousPrice(price);
        }

        // Generate mock payment address based on chain
        let mockAddress = '';
        if (chain.id === 'SOL_USDT') {
            // Solana address format (base58 encoded, 32-44 chars)
            const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            mockAddress = Array.from({ length: 44 }, () =>
                chars.charAt(Math.floor(Math.random() * chars.length))
            ).join('');
        } else if (chain.id === 'TRON_USDT') {
            // TRON address format (starts with T, 34 chars)
            mockAddress = 'T' + Array.from({ length: 33 }, () =>
                '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.charAt(
                    Math.floor(Math.random() * 58)
                )
            ).join('');
        } else {
            // EVM chains (0x prefix + 40 hex chars)
            mockAddress = '0x' + Array.from({ length: 40 }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
        }
        setPaymentAddress(mockAddress);
    };

    // Handle chain selection
    const handleSelectChain = async (chain: Chain) => {
        setSelectedChain(chain);
        setShowChainSelection(false);
        await generatePayment(chain);
    };

    // Initialize - no longer generates payment on mount, waits for chain selection
    useEffect(() => {
        // Payment generation now happens after chain selection
    }, []);

    // Countdown timer - cycles every minute and refreshes price
    useEffect(() => {
        if (paymentStatus !== 'pending') return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Cycle complete - refresh price and restart countdown
                    refreshPrice();
                    setCycleCount(c => c + 1);
                    return 60; // Restart countdown
                }

                // Show warning at 10 seconds
                if (prev === 11) {
                    setShowWarning(true);
                } else {
                    setShowWarning(false);
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentStatus]);

    // Refresh price from API
    const refreshPrice = async () => {
        setPreviousPrice(currentPrice);

        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd'
            );
            const data = await response.json();
            const pricePerOunce = data['tether-gold']?.usd || 2640;
            const pricePerGram = pricePerOunce / 31.1035;
            const premium = 0.15;
            const newPrice = Math.round(amount * pricePerGram * (1 + premium));

            if (newPrice !== currentPrice) {
                setCurrentPrice(newPrice);
                setShowPriceUpdate(true);

                // Auto-hide price update notification after 5 seconds
                setTimeout(() => {
                    setShowPriceUpdate(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Failed to fetch price:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Simulate payment detection
    const handleStartPayment = () => {
        setIsPaying(true);
        setPaymentStatus('processing');

        // Simulate payment confirmation after random time (5-10 seconds)
        const delay = 5000 + Math.random() * 5000;
        setTimeout(() => {
            // Simulate detected payment with potential shortage
            const simulatedPaidAmount = Math.floor(currentPrice * 0.95); // User paid 95% of current price

            if (simulatedPaidAmount < currentPrice) {
                // Payment is insufficient
                setPaidAmount(simulatedPaidAmount);
                setRemainingAmount(currentPrice - simulatedPaidAmount);
                setIsPaying(false);
                setPaymentStatus('insufficient');
            } else {
                // Payment complete
                setPaymentStatus('completed');
                setShowSuccessModal(true);
            }
        }, delay);
    };

    // Handle continue payment after partial payment - directly enter processing
    const handleContinuePayment = () => {
        setIsPaying(true);
        setPaymentStatus('processing');

        // Simulate payment confirmation after random time (3-6 seconds)
        const delay = 3000 + Math.random() * 3000;
        setTimeout(() => {
            // After partial payment, assume user completed the payment
            setPaymentStatus('completed');
            setShowSuccessModal(true);
        }, delay);
    };

    if (!serialNumber) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">無效的請求</p>
                    <Link href="/reseller-activation" className="text-yellow-600 hover:text-yellow-700 font-medium">
                        返回激活頁面
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/reseller-activation" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="font-bold text-lg text-gray-900">
                        {showChainSelection ? '選擇支付網絡' : '完成支付'}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32">
                {/* Card Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 sm:p-6">
                        {/* Card Details */}
                        <div className="space-y-3">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-500 mb-1">禮品卡序列號</h2>
                                <div className="font-mono font-medium text-lg text-gray-900">{serialNumber}</div>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block text-xs mb-0.5">卡片類型</span>
                                    <span className="font-medium text-gray-900">{cardType}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs mb-0.5">代理銷售</span>
                                    <span className="font-medium text-yellow-600">{resellerName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions */}
                {!showChainSelection && paymentStatus === 'pending' && (
                    <div className="space-y-4">
                        {/* Price Section - Detailed Amount, Countdown, Cycle, Price Updates */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Main Price Display */}
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500 mb-1">
                                    {remainingAmount > 0 ? '還需支付' : '需支付金額'}
                                </div>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                                        {remainingAmount > 0 ? remainingAmount : currentPrice}
                                    </span>
                                    <span className="text-xl text-gray-600">USDT</span>
                                </div>
                                {remainingAmount > 0 && (
                                    <div className="text-sm text-amber-600 mt-1">
                                        已收到 {paidAmount} USDT
                                    </div>
                                )}
                            </div>

                            {/* Price Update Notification */}
                            {showPriceUpdate && (
                                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fadeIn">
                                    <div className="flex items-center justify-center gap-2 text-amber-700">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        <span className="text-sm font-medium">價格已更新</span>
                                        <span className="text-sm text-amber-600">
                                            {previousPrice} → {currentPrice} USDT
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Countdown & Cycle Info */}
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${showWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{formatTime(countdown)}</span>
                                    <span className="text-xs">後刷新價格</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <span className="text-xs">週期</span>
                                    <span className="font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        #{cycleCount + 1}
                                    </span>
                                </div>
                            </div>

                            {/* Warning Banner */}
                            {showWarning && (
                                <div className="mt-3 text-center text-sm text-red-600 font-medium">
                                    ⚠ 價格即將刷新，請盡快完成支付
                                </div>
                            )}
                        </div>

                        {/* Network Section - Chain, QR Code, Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Selected Chain Header */}
                            {selectedChain && (
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedChain.icon}</span>
                                        <div>
                                            <div className="font-semibold text-gray-900">{selectedChain.displayName}</div>
                                            <div className="text-xs text-gray-500">{selectedChain.token} 網絡</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChainSelection(true)}
                                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors"
                                    >
                                        切換
                                    </button>
                                </div>
                            )}

                            {/* QR Code */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-48 h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                                    <div className="text-center">
                                        <svg className="w-32 h-32 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <p className="text-xs text-gray-400">支付二維碼</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">掃描二維碼或複製地址進行支付</p>
                            </div>

                            {/* Payment Address */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    {selectedChain?.displayName} 地址
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={paymentAddress}
                                        readOnly
                                        className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-900"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentAddress)}
                                        className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        title="複製地址"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Important Info Section */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">支付提示</p>
                                    <ul className="space-y-1 text-blue-700 text-xs">
                                        <li>• 請確保支付金額準確為 {remainingAmount > 0 ? remainingAmount : currentPrice} USDT</li>
                                        <li>• <strong>僅支持 {selectedChain?.displayName} 網絡</strong>，請勿使用其他網絡轉賬</li>
                                        <li>• 價格每分鐘根據金價自動刷新，請以當前顯示金額為準</li>
                                        <li>• 支付完成後請點擊下方按鈕，系統將自動檢測</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chain Selection */}
                {showChainSelection && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-semibold text-gray-900">選擇支付網絡</h2>
                            <span className="text-xs text-gray-500">支持 {CHAINS.length} 條鏈</span>
                        </div>

                        <div className="space-y-3">
                            {CHAINS.map((chain) => (
                                <button
                                    key={chain.id}
                                    onClick={() => handleSelectChain(chain)}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{chain.icon}</span>
                                        <div>
                                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                {chain.name}
                                                {chain.recommended && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                                                        推薦
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">{chain.displayName}</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">網絡選擇提示</p>
                                    <ul className="space-y-1 text-blue-700 text-xs">
                                        <li>• 請確保您選擇的網絡與您的錢包支持的網絡一致</li>
                                        <li>• 不同網絡的轉賬手續費不同，推薦選擇標註「推薦」的網絡</li>
                                        <li>• 錯誤的網絡選擇可能導致資產丟失，請謹慎操作</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Instructions */}
                {!showChainSelection && paymentStatus === 'pending' && (
                    <div className="space-y-4">
                        {/* Price Section - Amount, Countdown, Cycle, Price Updates */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Main Price Display */}
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500 mb-1">
                                    {remainingAmount > 0 ? '還需支付' : '需支付金額'}
                                </div>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                                        {remainingAmount > 0 ? remainingAmount : currentPrice}
                                    </span>
                                    <span className="text-xl text-gray-600">USDT</span>
                                </div>
                                {remainingAmount > 0 && (
                                    <div className="text-sm text-amber-600 mt-1">
                                        已收到 {paidAmount} USDT
                                    </div>
                                )}
                            </div>

                            {/* Price Update Notification */}
                            {showPriceUpdate && (
                                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fadeIn">
                                    <div className="flex items-center justify-center gap-2 text-amber-700">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                        </svg>
                                        <span className="text-sm font-medium">價格已更新</span>
                                        <span className="text-sm text-amber-600">
                                            {previousPrice} → {currentPrice} USDT
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Countdown & Cycle Info */}
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${showWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{formatTime(countdown)}</span>
                                    <span className="text-xs">後刷新價格</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <span className="text-xs">週期</span>
                                    <span className="font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        #{cycleCount + 1}
                                    </span>
                                </div>
                            </div>

                            {/* Warning Banner */}
                            {showWarning && (
                                <div className="mt-3 text-center text-sm text-red-600 font-medium">
                                    ⚠ 價格即將刷新，請盡快完成支付
                                </div>
                            )}
                        </div>

                        {/* Network Section - Chain, QR Code, Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Selected Chain Header */}
                            {selectedChain && (
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedChain.icon}</span>
                                        <div>
                                            <div className="font-semibold text-gray-900">{selectedChain.displayName}</div>
                                            <div className="text-xs text-gray-500">{selectedChain.token} 網絡</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowChainSelection(true)}
                                        className="text-sm text-yellow-600 hover:text-yellow-700 font-medium px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors"
                                    >
                                        切換
                                    </button>
                                </div>
                            )}

                            {/* QR Code */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-48 h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                                    <div className="text-center">
                                        <svg className="w-32 h-32 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <p className="text-xs text-gray-400">支付二維碼</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">掃描二維碼或複製地址進行支付</p>
                            </div>

                            {/* Payment Address */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    {selectedChain?.displayName} 地址
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={paymentAddress}
                                        readOnly
                                        className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-900"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentAddress)}
                                        className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        title="複製地址"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Important Info Section */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex gap-3">
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">支付提示</p>
                                    <ul className="space-y-1 text-blue-700 text-xs">
                                        <li>• 請確保支付金額準確為 {remainingAmount > 0 ? remainingAmount : currentPrice} USDT</li>
                                        <li>• <strong>僅支持 {selectedChain?.displayName} 網絡</strong>，請勿使用其他網絡轉賬</li>
                                        <li>• 價格每分鐘根據金價自動刷新，請以當前顯示金額為準</li>
                                        <li>• 支付完成後請點擊下方按鈕，系統將自動檢測</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing Status */}
                {paymentStatus === 'processing' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                檢測支付中...
                            </h3>
                            <p className="text-gray-600 mb-6">
                                正在確認您的支付，請稍候
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span>通常需要 10-30 秒</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Insufficient Payment Status */}
                {paymentStatus === 'insufficient' && (
                    <div className="space-y-4">
                        {/* Price Section - Amount and Countdown */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Success Status */}
                            <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium">已收到部分款項</span>
                            </div>

                            {/* Remaining Amount - Large Display */}
                            <div className="text-center mb-4">
                                <div className="text-sm text-gray-500 mb-1">還需支付</div>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-4xl sm:text-5xl font-bold text-amber-600 tracking-tight">
                                        {remainingAmount}
                                    </span>
                                    <span className="text-xl text-gray-600">USDT</span>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">當前所需總額</span>
                                    <span className="font-medium text-gray-900">{currentPrice} USDT</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="text-gray-500">已收到</span>
                                    <span className="font-medium text-green-600">{paidAmount} USDT ✓</span>
                                </div>
                            </div>

                            {/* Countdown - Still active */}
                            <div className="flex items-center justify-center gap-4 text-sm">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${showWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">{formatTime(countdown)}</span>
                                    <span className="text-xs">後刷新價格</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <span className="text-xs">週期</span>
                                    <span className="font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">#{cycleCount + 1}</span>
                                </div>
                            </div>

                            {showWarning && (
                                <div className="mt-3 text-center text-sm text-red-600 font-medium">
                                    ⚠ 價格即將刷新，請盡快完成支付
                                </div>
                            )}
                        </div>

                        {/* Network Section - QR Code and Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            {/* Selected Chain Header */}
                            {selectedChain && (
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedChain.icon}</span>
                                        <div>
                                            <div className="font-semibold text-gray-900">{selectedChain.displayName}</div>
                                            <div className="text-xs text-gray-500">{selectedChain.token} 網絡</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* QR Code */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-44 h-44 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                                    <div className="text-center">
                                        <svg className="w-28 h-28 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <p className="text-xs text-gray-400">支付剩餘金額</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">請使用同一地址支付剩餘金額</p>
                            </div>

                            {/* Payment Address */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    {selectedChain?.displayName} 地址
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={paymentAddress}
                                        readOnly
                                        className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-900"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentAddress)}
                                        className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        title="複製地址"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleContinuePayment}
                            disabled={isPaying}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {isPaying ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>檢測支付中...</span>
                                </>
                            ) : (
                                '確認已支付剩餘金額'
                            )}
                        </button>
                    </div>
                )}
            </main>

            {/* Bottom Actions */}
            {!showChainSelection && paymentStatus === 'pending' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                    <div className="max-w-xl mx-auto space-y-3">
                        <button
                            onClick={handleStartPayment}
                            disabled={isPaying}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                        >
                            {remainingAmount > 0 ? '確認已支付剩餘金額' : '我已完成支付'}
                        </button>
                        <p className="text-center text-xs text-gray-400">
                            {remainingAmount > 0
                                ? '請確認已支付剩餘差額後點擊此按鈕'
                                : '點擊按鈕後系統將自動檢測支付狀態'}
                        </p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            {/* Success Animation */}
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                卡號已激活
                            </h3>

                            <p className="text-lg text-gray-600 mb-6">
                                禮品卡已成功激活，用戶現在可以綁定使用
                            </p>

                            {/* Card Details */}
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 mb-6 border border-amber-100">
                                <div className="text-sm text-gray-600 mb-1">已購買卡片</div>
                                <div className="font-mono font-bold text-lg text-gray-900 mb-2">{serialNumber}</div>
                                <div className="text-sm text-gray-600">{cardType} · {amount}g</div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/reseller-activation')}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-lg py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    購買下一張卡片
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}

export default function ResellerPaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">載入中...</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
