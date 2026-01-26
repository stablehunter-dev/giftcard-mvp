'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type CardStatus = 'unactivated' | 'activated' | 'invalid';

interface CardInfo {
    serialNumber: string;
    status: CardStatus;
    cardType: string;
    amount: number;
    activationPrice: number;
    resellerName: string;
}

// Valid reseller IDs
const VALID_RESELLER_IDS = ['dc', 'yuki', 'mengzi'];

export default function ResellerActivationPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [resellerIdInput, setResellerIdInput] = useState('');
    const [idError, setIdError] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [currentGoldPrice, setCurrentGoldPrice] = useState(85);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showCameraPermissionModal, setShowCameraPermissionModal] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [showOCRModal, setShowOCRModal] = useState(false);
    const [ocrStatus, setOCRStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Mock function to check card status
    const checkCardStatus = async (serial: string): Promise<CardInfo> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock logic: cards ending with 'A' or '6' are unactivated, 'B' or '7' are activated, others are invalid
        const lastChar = serial.charAt(serial.length - 1);

        // Mock reseller names based on serial number pattern
        // As per requirement, reseller is always "DC"
        const resellerNames = ['DC'];
        const resellerIndex = 0;

        // Determine card amount based on serial number
        const amount = serial.charAt(1) === '0' ? 100 : 10;

        // Calculate price: gold price per gram * amount + premium (15%)
        const goldPricePerGram = 85; // Mock: ~$85/gram
        const premium = 0.15; // 15% premium
        const activationPrice = Math.round(amount * goldPricePerGram * (1 + premium));

        if (lastChar === 'A' || lastChar === '6') {
            return {
                serialNumber: serial,
                status: 'unactivated',
                cardType: `${amount}g 黃金禮品卡`,
                amount: amount,
                activationPrice: activationPrice,
                resellerName: resellerNames[resellerIndex]
            };
        } else if (lastChar === 'B' || lastChar === '7') {
            return {
                serialNumber: serial,
                status: 'activated',
                cardType: `${amount}g 黃金禮品卡`,
                amount: amount,
                activationPrice: activationPrice,
                resellerName: resellerNames[resellerIndex]
            };
        } else {
            return {
                serialNumber: serial,
                status: 'invalid',
                cardType: '',
                amount: 0,
                activationPrice: 0,
                resellerName: ''
            };
        }
    };

    const handleIdVerification = (e: React.FormEvent) => {
        e.preventDefault();
        setIdError('');

        if (VALID_RESELLER_IDS.includes(resellerIdInput.toLowerCase())) {
            setIsAuthenticated(true);
            refreshGoldPrice(); // Fetch price on login
        } else {
            setIdError('無效的ID，請重試');
        }
    };

    const refreshGoldPrice = async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd'
            );
            const data = await response.json();

            // Get XAUT price in USD per ounce
            const pricePerOunce = data['tether-gold']?.usd || 2640;

            // Convert to USD per gram (1 oz = 31.1035 grams)
            const pricePerGram = pricePerOunce / 31.1035;
            setCurrentGoldPrice(Math.round(pricePerGram * 100) / 100);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch gold price:', error);
            // Fallback to approximate price
            setCurrentGoldPrice(84.85);
            setLastUpdated(new Date());
        }
    };

    const calculatePrice = (grams: number) => {
        const premium = 0.15;
        return Math.round(grams * currentGoldPrice * (1 + premium));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate serial number (16 continuous digits)
        if (!serialNumber || serialNumber.length !== 16) {
            setError('請輸入有效的16位序列號');
            return;
        }

        setIsChecking(true);

        try {
            const cardInfo = await checkCardStatus(serialNumber);

            if (cardInfo.status === 'invalid') {
                setError('無效的序列號，請檢查後重試');
                setIsChecking(false);
                return;
            }

            if (cardInfo.status === 'activated') {
                setError('此卡片已經激活，無需重複激活');
                setIsChecking(false);
                return;
            }

            // Card is unactivated, proceed to payment
            router.push(`/reseller-activation/payment?serial=${encodeURIComponent(serialNumber)}&amount=${cardInfo.amount}&price=${cardInfo.activationPrice}&type=${encodeURIComponent(cardInfo.cardType)}&reseller=${encodeURIComponent(cardInfo.resellerName)}`);
        } catch (err) {
            setError('檢查失敗，請稍後重試');
            setIsChecking(false);
        }
    };

    const handleCameraClick = () => {
        setShowCameraPermissionModal(true);
    };

    const handleCameraPermissionConfirm = () => {
        setShowCameraPermissionModal(false);
        fileInputRef.current?.click();
    };

    const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setShowOCRModal(true);
        setOCRStatus('processing');
        setIsProcessingImage(true);

        // Simulate OCR processing
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;

            if (isSuccess) {
                // Mock recognized code (ends with 6 for unactivated demo) - continuous 16 digits
                const mockRecognizedCode = '4J3N50XZYH8RJTJ6';
                setSerialNumber(mockRecognizedCode);
                setOCRStatus('success');
                setError('');

                setTimeout(() => {
                    setShowOCRModal(false);
                    setIsProcessingImage(false);
                }, 3000);
            } else {
                setOCRStatus('failed');
            }
        }, 2500);
    };

    const handleOCRModalClose = () => {
        setShowOCRModal(false);
        setIsProcessingImage(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ID Verification Modal */}
            {!isAuthenticated && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                代銷人員驗證
                            </h3>
                            <p className="text-sm text-gray-600">
                                請輸入您的代銷 ID 以繼續
                            </p>
                        </div>

                        <form onSubmit={handleIdVerification} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={resellerIdInput}
                                    onChange={(e) => {
                                        setResellerIdInput(e.target.value);
                                        setIdError('');
                                    }}
                                    className={`w-full px-4 py-3 border-2 rounded-xl text-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${idError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="輸入代銷 ID"
                                    autoFocus
                                />
                                {idError && (
                                    <p className="mt-2 text-sm text-red-500 text-center">{idError}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                驗證
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
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
                    <div className="text-gray-600 font-medium text-sm sm:text-base">
                        代銷購卡
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-12 pt-6 sm:pt-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4 sm:mb-6">
                            購買禮品卡
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light">
                            輸入序列號完成購買付費
                        </p>
                    </div>

                    {/* Current Gold Price */}
                    <section className="mb-8 sm:mb-12">
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    當前禮品卡售價參考
                                </h2>
                                <button
                                    onClick={refreshGoldPrice}
                                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                    title="刷新金價"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-white rounded-xl p-4 sm:p-5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm sm:text-base text-gray-600">10克禮品卡</div>
                                            <div className="text-xs text-gray-400 mt-0.5">購買價格</div>
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                                            {calculatePrice(10)} <span className="text-sm sm:text-base font-normal text-gray-500">USDT</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl p-4 sm:p-5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm sm:text-base text-gray-600">100克禮品卡</div>
                                            <div className="text-xs text-gray-400 mt-0.5">購買價格</div>
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                                            {calculatePrice(100)} <span className="text-sm sm:text-base font-normal text-gray-500">USDT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 text-center mt-4">
                                最後更新: {lastUpdated.toLocaleTimeString('zh-HK')}
                            </div>
                        </div>
                    </section>

                    {/* Serial Number Input */}
                    <section className="mb-12 sm:mb-16">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label htmlFor="serialNumber" className="block text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                        禮品卡序列號
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="serialNumber"
                                            value={serialNumber}
                                            onChange={(e) => {
                                                // Only accept alphanumeric characters, no formatting
                                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                setSerialNumber(value);
                                                setError('');
                                            }}
                                            className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-14 sm:pr-16 border-2 rounded-xl text-base sm:text-lg font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${error ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="16位序列號"
                                            maxLength={16}
                                            disabled={isProcessingImage}
                                        />
                                        {/* Camera Icon Button */}
                                        <button
                                            type="button"
                                            onClick={handleCameraClick}
                                            disabled={isProcessingImage}
                                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="拍照識別序列號"
                                        >
                                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                        {/* Hidden file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleImageCapture}
                                            className="hidden"
                                        />
                                    </div>
                                    {error && (
                                        <p className="mt-2 text-sm sm:text-base text-red-500">{error}</p>
                                    )}
                                    {isProcessingImage && (
                                        <p className="mt-2 text-sm sm:text-base text-blue-600 flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            識別中，請稍候...
                                        </p>
                                    )}
                                    {!error && !isProcessingImage && (
                                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                                            序列號為16位字符，可在禮品卡背面找到，也可點擊相機圖標拍照識別
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isChecking || isProcessingImage}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 sm:py-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isChecking ? '檢查中...' : '檢查並購買'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="mb-12 sm:mb-20">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                            購買流程
                        </h2>
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        輸入序列號
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        手動輸入或拍照識別禮品卡背面的16位序列號
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        完成支付
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        使用穩定幣(USDT)支付購買費用
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        購買完成
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        支付成功後，禮品卡立即激活可供用戶綁定使用
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Important Notice */}
                    <section className="mb-8 sm:mb-12">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                重要提示
                            </h2>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>每張禮品卡只能購買一次，購買後用戶可綁定至個人賬戶</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>請確保序列號正確，錯誤的序列號將無法完成購買</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>支付完成後禮品卡即時激活，購買狀態不可逆轉</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>如遇問題，請點擊右下角 WhatsApp 圖標聯絡客服</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            {/* OCR Recognition Modal */}
            {showOCRModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
                        <div className="text-center">
                            {ocrStatus === 'processing' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        識別中...
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        正在解析禮品卡序列號，請稍候
                                    </p>
                                </>
                            )}

                            {ocrStatus === 'success' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        識別成功！
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                                        已自動填入序列號：
                                    </p>
                                    <div className="bg-gray-100 rounded-xl px-4 py-3 font-mono text-lg tracking-wider text-gray-900 mb-6">
                                        {serialNumber}
                                    </div>
                                    <button
                                        onClick={handleOCRModalClose}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                    >
                                        關閉
                                    </button>
                                </>
                            )}

                            {ocrStatus === 'failed' && (
                                <>
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        未能識別
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                                        無法識別序列號，請調整拍攝角度或手動輸入
                                    </p>
                                    <button
                                        onClick={handleOCRModalClose}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                    >
                                        關閉
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Permission Modal */}
            {showCameraPermissionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
                        <button
                            onClick={() => setShowCameraPermissionModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="關閉"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center">
                                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                                拍照識別提示
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                為增加識別率，請豎著手機，橫著卡片進行拍照
                            </p>

                            <button
                                onClick={handleCameraPermissionConfirm}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                確定
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
