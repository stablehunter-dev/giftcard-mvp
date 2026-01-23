'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [redemptionCode, setRedemptionCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCameraPermissionModal, setShowCameraPermissionModal] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [showOCRModal, setShowOCRModal] = useState(false);
    const [ocrStatus, setOCRStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Check authentication status
    useEffect(() => {
        // Use a small timeout to push execution to next tick and simulate async check
        // This avoids strict 'set-state-in-effect' linter errors
        const checkAuth = setTimeout(() => {
            const authStatus = typeof window !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false;

            if (!authStatus) {
                // Redirect to auth page with return URL
                router.push('/auth?redirect=/activate');
            } else {
                setIsLoading(false);
            }
        }, 0);

        return () => clearTimeout(checkAuth);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate redemption code (remove hyphens for validation)
        const cleanCode = redemptionCode.replace(/-/g, '');
        if (!cleanCode || cleanCode.length !== 16) {
            setError('請輸入有效的16位兌換碼');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);
            setRedemptionCode('');
        }, 1500);
    };

    const handleCameraClick = () => {
        setShowCameraPermissionModal(true);
    };

    const handleCameraPermissionConfirm = () => {
        setShowCameraPermissionModal(false);
        // Trigger file input (camera on mobile, file picker on desktop)
        fileInputRef.current?.click();
    };

    const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show OCR processing modal
        setShowOCRModal(true);
        setOCRStatus('processing');
        setIsProcessingImage(true);

        // Simulate OCR processing with random success/failure
        setTimeout(() => {
            // 80% success rate for mock
            const isSuccess = Math.random() > 0.2;

            if (isSuccess) {
                // Mock OCR result using the provided card image example
                const mockRecognizedCode = '4J3N-50XZ-YH8R-JTJ6';
                setRedemptionCode(mockRecognizedCode);
                setOCRStatus('success');
                setError('');

                // Auto-close success modal after 3s to give time to see the toggle button
                setTimeout(() => {
                    if (ocrStatus === 'success') {
                        setShowOCRModal(false);
                        setIsProcessingImage(false);
                    }
                }, 3000);
            } else {
                // Recognition failed
                setOCRStatus('failed');
                // Keep modal open so user can see the failure message
            }
        }, 2500);
    };

    const handleToggleOCRDemo = () => {
        // Toggle between success and failed states for demo
        if (ocrStatus === 'success') {
            setOCRStatus('failed');
            setRedemptionCode(''); // Clear the filled code  
        } else {
            setOCRStatus('success');
            setRedemptionCode('4J3N-50XZ-YH8R-JTJ6');
        }
    };

    const handleOCRModalClose = () => {
        setShowOCRModal(false);
        setIsProcessingImage(false);
    };

    // Remove logout function as we're navigating to profile instead

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
                        href="/profile"
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base transition-colors"
                    >
                        個人中心
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12 sm:mb-16 pt-6 sm:pt-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4 sm:mb-6">
                            綁定您的禮品卡
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light">
                            輸入兌換碼，開啟您的黃金兌換之旅
                        </p>
                    </div>

                    {/* Redemption Code Input */}
                    <section className="mb-12 sm:mb-16">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                <div>
                                    <label htmlFor="redemptionCode" className="block text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                        禮品卡兌換碼
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="redemptionCode"
                                            value={redemptionCode}
                                            onChange={(e) => {
                                                // Remove existing hyphens and non-alphanumeric chars
                                                let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                // Auto-format with hyphens: XXXX-XXXX-XXXX-XXXX
                                                if (value.length > 0) {
                                                    const parts = value.match(/.{1,4}/g) || [];
                                                    value = parts.join('-');
                                                }
                                                setRedemptionCode(value);
                                                setError('');
                                            }}
                                            className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-14 sm:pr-16 border-2 rounded-xl text-base sm:text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${error ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="XXXX-XXXX-XXXX-XXXX"
                                            maxLength={19}
                                            disabled={isProcessingImage}
                                        />
                                        {/* Camera Icon Button */}
                                        <button
                                            type="button"
                                            onClick={handleCameraClick}
                                            disabled={isProcessingImage}
                                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="拍照識別兌換碼"
                                        >
                                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </button>
                                        {/* Hidden file input for camera/file picker */}
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
                                            兌換碼為16位字符，可在禮品卡背面找到，也可點擊相機圖標拍照識別
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || isProcessingImage}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 sm:py-4 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? '綁定中...' : '確認綁定'}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* How Binding Works */}
                    <section className="mb-12 sm:mb-20">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                            綁定流程說明
                        </h2>
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        輸入或拍照識別兌換碼
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        手動輸入禮品卡上的兌換碼，或點擊相機圖標拍照自動識別。拍照時請豎著手機、橫著卡片以提高識別率。
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        確認綁定
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        點擊「確認綁定」後，禮品卡將綁定至您的帳戶，實體卡片會立即失效。
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                                        選擇門店預約
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        綁定成功後，您可以前往下一步選擇門店並預約兌換時間。
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
                                    <span>禮品卡綁定後即刻生效，實體卡片隨即失效，權益將記入您的 GoldFin 帳戶，不可取消、轉讓或退款</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>每張禮品卡只能綁定一次，請確保使用正確的帳戶進行綁定</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>只能在指定門店進行預約兌換，最終兌換以門店實際庫存為準</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>提交兌換申請後需等待平台確認，請留意電郵通知</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-amber-600 mt-1">•</span>
                                    <span>如遇到任何問題，請點擊右下角 WhatsApp 圖標聯絡客服</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section className="mb-8 sm:mb-12">
                        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                服務條款與免責聲明
                            </h2>
                            <div className="text-xs sm:text-sm text-gray-600 space-y-2 sm:space-y-3 leading-relaxed">
                                <p>
                                    使用 GoldFin 禮品卡兌換服務即表示您同意以下條款：
                                </p>
                                <ul className="space-y-1.5 sm:space-y-2 ml-3 sm:ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                        <span>禮品卡一經綁定即刻生效，實體卡片隨即失效，不可取消或退款</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                        <span>所有兌換需經平台確認，確認時間視實際情況而定</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                        <span>最終交付的黃金規格與數量以門店實際庫存為準，GoldFin 保留最終解釋權</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                        <span>用戶需妥善保管帳戶資訊及兌換二維碼，如因用戶個人原因導致的損失，GoldFin 概不負責</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full flex-shrink-0"></span>
                                        <span>GoldFin 保留隨時修改服務條款的權利</span>
                                    </li>
                                </ul>
                                <p className="text-xs text-gray-500 pt-3 sm:pt-4 border-t border-gray-200 mt-4">
                                    © 2026 GoldFin. 版權所有 | 服務僅適用於香港地區
                                </p>
                            </div>
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
                                    {/* Loading spinner */}
                                    <div className="w-20 h-20 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        識別中...
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        正在解析禮品卡兌換碼，請稍候
                                    </p>
                                </>
                            )}

                            {ocrStatus === 'success' && (
                                <>
                                    {/* Success checkmark */}
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        識別成功！
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                                        已自動填入兌換碼：
                                    </p>
                                    <div className="bg-gray-100 rounded-xl px-4 py-3 font-mono text-lg tracking-wider text-gray-900 mb-6">
                                        {redemptionCode}
                                    </div>
                                    {/* Close button */}
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
                                    {/* Error icon */}
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                        未能識別
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                                        無法識別兌換碼，請調整拍攝角度或手動輸入
                                    </p>
                                    {/* Close button */}
                                    <button
                                        onClick={handleOCRModalClose}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                    >
                                        關閉
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Toggle demo button - positioned outside modal at bottom center */}
                        {ocrStatus !== 'processing' && (
                            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <button
                                    onClick={handleToggleOCRDemo}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                                >
                                    {ocrStatus === 'success' ? (
                                        <>
                                            <span>查看失敗示例</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span>查看成功示例</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Camera Permission Modal */}
            {showCameraPermissionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
                        {/* Close button */}
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
                            {/* Illustration */}
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center">
                                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    <rect x="6" y="10" width="12" height="6" rx="1" fill="white" opacity="0.3" />
                                    <text x="12" y="14" textAnchor="middle" fontSize="4" fill="currentColor">卡號</text>
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
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-base sm:text-lg py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                確定
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                綁定成功！
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                您的禮品卡已成功綁定至帳戶。
                            </p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-base sm:text-lg py-3 sm:py-3.5 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
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
