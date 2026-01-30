'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// ============================================================================
// TYPES & ENUMS
// ============================================================================

type PaymentStep = 'CHAIN_SELECT' | 'QUOTE' | 'SETTLING' | 'SUCCESS' | 'FUNDS_BLOCKED' | 'INCOMPLETE';

type KytStatus = 'pending' | 'pass' | 'fail';

type ActivationStatus = 'none' | 'processing' | 'success' | 'fail';

type CardLockStatus = 'normal' | 'frozen';

interface Chain {
    id: string;
    name: string;
    displayName: string;
    token: string;
    icon: string;
    recommended?: boolean;
    addressPrefix: string;
}

interface PaymentState {
    // Core identifiers
    serialNumber: string;
    cardType: string;
    amount: number; // Gold amount in grams
    resellerName: string;

    // Chain selection
    selectedChain: Chain | null;
    pendingChain: Chain | null; // 页面1临时选中的链

    // Pricing
    referencePrice: number; // Page 1: reference only, updates every 30s
    quoteAmount: number | null; // Page 2: fixed quote
    quoteExpiresAt: number | null; // Unix timestamp

    // Payment tracking
    paidAmount: number;
    requiredAmount: number;
    remainingAmount: number;
    paidRatioToTotal: number;

    // KYT & Settlement
    kytStatus: KytStatus;
    activationStatus: ActivationStatus;
    settlementWindowEndsAt: number | null; // 1 hour from first payment

    // Card status
    cardLockStatus: CardLockStatus;

    // Balance for future orders
    holdBalance: number;

    // Fee deducted on incomplete settlement
    feeDeductedAmount: number;

    // UI state
    lastPriceUpdate: Date | null;
    quoteUpdateCount: number; // How many times quote was auto-refreshed
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CHAINS: Chain[] = [
    { id: 'TRON_USDT', name: 'TRON', displayName: 'TRON (TRC-20)', token: 'USDT', icon: '🔷', recommended: true, addressPrefix: 'T' },
    { id: 'ETH_USDT', name: 'Ethereum', displayName: 'Ethereum (ERC-20)', token: 'USDT', icon: '⬡', addressPrefix: '0x' },
    { id: 'ARBITRUM_USDT', name: 'Arbitrum', displayName: 'Arbitrum One', token: 'USDT', icon: '🔹', addressPrefix: '0x' },
    { id: 'BASE_USDT', name: 'Base', displayName: 'Base', token: 'USDT', icon: '🔵', recommended: true, addressPrefix: '0x' },
    { id: 'MATIC_USDT', name: 'Polygon', displayName: 'Polygon (POS)', token: 'USDT', icon: '💜', addressPrefix: '0x' },
    { id: 'BSC_USDT', name: 'BSC', displayName: 'BNB Smart Chain', token: 'USDT', icon: '🟡', recommended: true, addressPrefix: '0x' },
    { id: 'SOL_USDT', name: 'Solana', displayName: 'Solana', token: 'USDT', icon: '🟣', addressPrefix: '' },
];

const REFERENCE_PRICE_REFRESH_INTERVAL = 30; // 30 seconds for reference price
const QUOTE_EXPIRY_SECONDS = 120; // 2 minutes for quote
const SETTLEMENT_WINDOW_HOURS = 1; // 1 hour settlement window
const MIN_PAYMENT_RATIO_FOR_HEDGE = 0.10; // 10% threshold
const INCOMPLETE_SETTLEMENT_FEE_RATE = 0.05; // 5% fee

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateAddress = (chain: Chain): string => {
    if (chain.id === 'SOL_USDT') {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        return Array.from({ length: 44 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    } else if (chain.id === 'TRON_USDT') {
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        return 'T' + Array.from({ length: 33 }, () => chars.charAt(Math.floor(Math.random() * 58))).join('');
    } else {
        return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }
};

const calculatePrice = async (goldGrams: number): Promise<number> => {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd'
        );
        const data = await response.json();
        const pricePerOunce = data['tether-gold']?.usd || 2640;
        const pricePerGram = pricePerOunce / 31.1035;
        const premium = 0.15;
        return Math.round(goldGrams * pricePerGram * (1 + premium));
    } catch (error) {
        console.error('Failed to fetch price:', error);
        // Fallback calculation
        return Math.round(goldGrams * 85 * 1.15);
    }
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL params
    const serialNumber = searchParams.get('serial') || '';
    const amount = Number(searchParams.get('amount')) || 0;
    const initialPrice = Number(searchParams.get('price')) || 0;
    const cardType = searchParams.get('type') || '';
    const resellerName = searchParams.get('reseller') || '';

    // Current step
    const [currentStep, setCurrentStep] = useState<PaymentStep>('CHAIN_SELECT');

    // Payment address (generated when entering QUOTE step)
    // Payment addresses (multi-address support)
    const [paymentAddresses, setPaymentAddresses] = useState<Array<{ id: string; chain: Chain; address: string }>>([]);
    const [activeAddressId, setActiveAddressId] = useState<string>('');
    
    // Get current active payment address
    const paymentAddress = useMemo(() => {
        const active = paymentAddresses.find(a => a.id === activeAddressId);
        return active?.address || '';
    }, [paymentAddresses, activeAddressId]);

    // Reference price countdown (for Page 1)
    const [refPriceCountdown, setRefPriceCountdown] = useState(REFERENCE_PRICE_REFRESH_INTERVAL);

    // Quote countdown (for Page 2)
    const [quoteCountdown, setQuoteCountdown] = useState(QUOTE_EXPIRY_SECONDS);

    // Settlement countdown (for Page 3)
    const [settlementCountdown, setSettlementCountdown] = useState(0);

    // Payment detection simulation
    const [isDetectingPayment, setIsDetectingPayment] = useState(false);
    const [showQuoteRefreshedNotice, setShowQuoteRefreshedNotice] = useState(false);
    const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);

    // Preserved quote state when switching chains (to avoid reset)
    const [preservedQuoteState, setPreservedQuoteState] = useState<{
        quoteAmount: number;
        quoteExpiresAt: number;
        quoteCountdown: number;
        selectedChain: Chain;
    } | null>(null);

    // Payment state
    const [state, setState] = useState<PaymentState>({
        serialNumber,
        cardType,
        amount,
        resellerName,
        selectedChain: null,
        pendingChain: null,
        referencePrice: initialPrice,
        quoteAmount: null,
        quoteExpiresAt: null,
        paidAmount: 0,
        requiredAmount: 0,
        remainingAmount: 0,
        paidRatioToTotal: 0,
        kytStatus: 'pending',
        activationStatus: 'none',
        settlementWindowEndsAt: null,
        cardLockStatus: 'normal',
        holdBalance: 0,
        feeDeductedAmount: 0,
        lastPriceUpdate: new Date(),
        quoteUpdateCount: 0,
    });

    // Update state helper
    const updateState = useCallback((updates: Partial<PaymentState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    // Refresh reference price (Page 1)
    const refreshReferencePrice = useCallback(async () => {
        const newPrice = await calculatePrice(amount);
        updateState({
            referencePrice: newPrice,
            lastPriceUpdate: new Date(),
        });
        setRefPriceCountdown(REFERENCE_PRICE_REFRESH_INTERVAL);
    }, [amount, updateState]);

    // Generate new quote (Page 2)
    const generateQuote = useCallback(async () => {
        const quotePrice = await calculatePrice(amount);
        const expiresAt = Date.now() + QUOTE_EXPIRY_SECONDS * 1000;

        updateState({
            quoteAmount: quotePrice,
            quoteExpiresAt: expiresAt,
            requiredAmount: quotePrice,
            remainingAmount: quotePrice,
            quoteUpdateCount: state.quoteUpdateCount + 1,
        });
        setQuoteCountdown(QUOTE_EXPIRY_SECONDS);

        // Show refreshed notice if this is a refresh
        if (state.quoteUpdateCount > 0) {
            setShowQuoteRefreshedNotice(true);
            setTimeout(() => setShowQuoteRefreshedNotice(false), 3000);
        }
    }, [amount, state.quoteUpdateCount, updateState]);

    // Handle chain selection (Page 1) - 只记录待选链，不跳转
    const handleSelectChain = (chain: Chain) => {
        updateState({ pendingChain: chain });
    };

    // Handle switching chain from quote page (Page 2 -> Page 1)
    // Preserves the current quote state so it doesn't reset
    const handleSwitchChainFromQuote = () => {
        if (state.quoteAmount && state.quoteExpiresAt && state.selectedChain) {
            // Save current quote state
            setPreservedQuoteState({
                quoteAmount: state.quoteAmount,
                quoteExpiresAt: state.quoteExpiresAt,
                quoteCountdown: quoteCountdown,
                selectedChain: state.selectedChain,
            });
            // Set pending chain to current selected chain
            updateState({ pendingChain: state.selectedChain });
        }
        setCurrentStep('CHAIN_SELECT');
    };

    // Handle returning to quote page without changing chain
    const handleReturnToQuote = () => {
        if (preservedQuoteState && state.pendingChain?.id === preservedQuoteState.selectedChain.id) {
            // Restore the preserved countdown
            setQuoteCountdown(preservedQuoteState.quoteCountdown);
        }
        setCurrentStep('QUOTE');
    };

    // 确认购买并生成报价（页面1 -> 页面2）
    const handleConfirmPurchase = async () => {
        if (!state.pendingChain) return;

        // Check if user is switching back to the same chain with a preserved quote
        if (preservedQuoteState && state.pendingChain.id === preservedQuoteState.selectedChain.id) {
            // Restore the preserved quote state without resetting countdown
            updateState({
                selectedChain: state.pendingChain,
                quoteAmount: preservedQuoteState.quoteAmount,
                quoteExpiresAt: preservedQuoteState.quoteExpiresAt,
                requiredAmount: preservedQuoteState.quoteAmount,
                remainingAmount: preservedQuoteState.quoteAmount,
            });
            setQuoteCountdown(preservedQuoteState.quoteCountdown);

            // Create address if not exists
            if (paymentAddresses.length === 0) {
                const firstAddress = {
                    id: 'addr-1',
                    chain: state.pendingChain,
                    address: generateAddress(state.pendingChain),
                };
                setPaymentAddresses([firstAddress]);
                setActiveAddressId(firstAddress.id);
            }

            setCurrentStep('QUOTE');
            return;
        }

        // New chain selection - generate fresh quote
        setIsGeneratingQuote(true);
        try {
            updateState({ selectedChain: state.pendingChain });

            // 创建第一个支付地址
            const firstAddress = {
                id: 'addr-1',
                chain: state.pendingChain,
                address: generateAddress(state.pendingChain),
            };
            setPaymentAddresses([firstAddress]);
            setActiveAddressId(firstAddress.id);

            // Clear preserved state for new quote
            setPreservedQuoteState(null);

            await generateQuote();
            setCurrentStep('QUOTE');
        } finally {
            setIsGeneratingQuote(false);
        }
    };

    // Simulate payment detection (Page 2 → Page 3)
    const handleConfirmPayment = () => {
        setIsDetectingPayment(true);

        // Simulate detection delay
        setTimeout(() => {
            // Simulate receiving 40% of the quote (partial payment)
            const simulatedPaid = Math.floor((state.quoteAmount || 0) * 0.4);
            const newPaidAmount = state.paidAmount + simulatedPaid;
            const newRemaining = (state.quoteAmount || 0) - newPaidAmount;
            const paidRatio = newPaidAmount / (state.quoteAmount || 1);

            // Determine if 10% threshold is met
            const shouldTriggerHedge = paidRatio >= MIN_PAYMENT_RATIO_FOR_HEDGE;

            updateState({
                paidAmount: newPaidAmount,
                remainingAmount: newRemaining > 0 ? newRemaining : 0,
                paidRatioToTotal: paidRatio,
                activationStatus: shouldTriggerHedge ? 'processing' : 'none',
                settlementWindowEndsAt: Date.now() + SETTLEMENT_WINDOW_HOURS * 60 * 60 * 1000,
            });

            setSettlementCountdown(SETTLEMENT_WINDOW_HOURS * 60 * 60);
            setIsDetectingPayment(false);

            // Check if full payment is received
            const isFullPayment = newRemaining <= 0;

            if (isFullPayment) {
                // Full payment - go to activation status page (Page 4 style)
                updateState({ activationStatus: 'processing' });
                setCurrentStep('SUCCESS'); // Page 4 now handles processing/success/failed states

                // Start KYT check simulation (takes 30 seconds for full payment)
                setTimeout(() => {
                    // Simulate random KYT result (90% pass rate)
                    const kytResult: KytStatus = Math.random() > 0.1 ? 'pass' : 'fail';
                    updateState({ kytStatus: kytResult });

                    if (kytResult === 'fail') {
                        updateState({
                            cardLockStatus: 'frozen',
                            activationStatus: 'fail',
                        });
                        // Page 4 will automatically show failed state
                    } else {
                        // KYT passed, show success
                        updateState({ activationStatus: 'success' });
                        // Page 4 will automatically show success state
                    }
                }, 30000); // 30 seconds for KYT check simulation
            } else {
                // Partial payment - go to settling page for continue payment
                setCurrentStep('SETTLING');

                // Start KYT check simulation for partial payment too (30 seconds)
                setTimeout(() => {
                    const kytResult: KytStatus = Math.random() > 0.1 ? 'pass' : 'fail';
                    updateState({ kytStatus: kytResult });

                    if (kytResult === 'fail') {
                        updateState({
                            cardLockStatus: 'frozen',
                            activationStatus: 'fail',
                        });
                        setCurrentStep('FUNDS_BLOCKED');
                    }
                }, 30000);
            }
        }, 3000);
    };

    // Handle continue payment in settling state
    const handleContinuePaymentInSettling = () => {
        setIsDetectingPayment(true);

        setTimeout(() => {
            // Simulate completing the payment
            const additionalPayment = state.remainingAmount;
            const newPaidAmount = state.paidAmount + additionalPayment;

            updateState({
                paidAmount: newPaidAmount,
                remainingAmount: 0,
                paidRatioToTotal: 1,
                activationStatus: 'processing', // Set to processing for activation
            });

            setIsDetectingPayment(false);

            // Go to activation status page (Page 4 style) for full payment
            setCurrentStep('SUCCESS');

            // Check KYT status and handle accordingly
            if (state.kytStatus === 'pass') {
                // KYT already passed, show success
                updateState({ activationStatus: 'success' });
            } else if (state.kytStatus === 'pending') {
                // KYT still pending, Page 4 will show processing state
                // The KYT handler will update state when complete
            } else if (state.kytStatus === 'fail') {
                // KYT failed, Page 4 will show failed state
                updateState({
                    cardLockStatus: 'frozen',
                    activationStatus: 'fail',
                });
            }
        }, 2000);
    };

    // Handle settlement window expiry simulation (for demo)
    const simulateSettlementExpiry = () => {
        const fee = Math.floor((state.quoteAmount || 0) * INCOMPLETE_SETTLEMENT_FEE_RATE);
        const remaining = Math.max(0, state.paidAmount - fee);

        updateState({
            feeDeductedAmount: fee,
            holdBalance: state.kytStatus === 'pass' ? remaining : 0,
        });

        setCurrentStep('INCOMPLETE');
    };

    // Handle creating new order from incomplete settlement
    const handleNewOrder = () => {
        // Reset to chain selection with hold balance applied
        updateState({
            quoteAmount: null,
            quoteExpiresAt: null,
            paidAmount: 0,
            remainingAmount: 0,
            paidRatioToTotal: 0,
            kytStatus: 'pending',
            activationStatus: 'none',
            settlementWindowEndsAt: null,
            feeDeductedAmount: 0,
            // holdBalance is kept for the new order
        });
        setCurrentStep('CHAIN_SELECT');
    };

    // Reference price countdown effect (Page 1)
    useEffect(() => {
        if (currentStep !== 'CHAIN_SELECT') return;

        const timer = setInterval(() => {
            setRefPriceCountdown(prev => {
                if (prev <= 1) {
                    refreshReferencePrice();
                    return REFERENCE_PRICE_REFRESH_INTERVAL;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep, refreshReferencePrice]);

    // Quote countdown effect (Page 2)
    useEffect(() => {
        if (currentStep !== 'QUOTE') return;

        const timer = setInterval(() => {
            setQuoteCountdown(prev => {
                if (prev <= 1) {
                    // Auto-refresh quote
                    generateQuote();
                    return QUOTE_EXPIRY_SECONDS;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep, generateQuote]);

    // Settlement countdown effect (Page 3)
    useEffect(() => {
        if (currentStep !== 'SETTLING' || !state.settlementWindowEndsAt) return;

        const timer = setInterval(() => {
            const remaining = Math.max(0, Math.floor((state.settlementWindowEndsAt! - Date.now()) / 1000));
            setSettlementCountdown(remaining);

            if (remaining <= 0) {
                simulateSettlementExpiry();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep, state.settlementWindowEndsAt]);

    // Validate serial number
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

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const renderHeader = (title: string, showBack = true) => (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                {showBack ? (
                    <button
                        onClick={() => {
                            if (currentStep === 'QUOTE') setCurrentStep('CHAIN_SELECT');
                            else router.push('/reseller-activation');
                        }}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : (
                    <div className="w-10" />
                )}
                <h1 className="font-bold text-lg text-gray-900">{title}</h1>
                <div className="w-10" />
            </div>
        </header>
    );

    const renderCardInfo = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 sm:p-6">
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
                            <span className="text-gray-500 block text-xs mb-0.5">黃金權益</span>
                            <span className="font-medium text-yellow-600">{amount}g</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWhatsAppFAB = () => (
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
    );

    // ============================================================================
    // PAGE 1: CHAIN SELECTION & REFERENCE PRICE
    // ============================================================================

    const renderChainSelectPage = () => (
        <div className="min-h-screen bg-gray-50">
            {renderHeader('選擇支付網絡')}

            <main className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-40">
                {/* Combined Price & Chain Selection */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    {/* Header with Price */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                            {preservedQuoteState ? (
                                <>
                                    <div className="text-xs text-gray-400 mb-0.5">鎖定報價</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-yellow-600">{preservedQuoteState.quoteAmount}</span>
                                        <span className="text-sm text-gray-500">USDT</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-xs text-gray-400 mb-0.5">參考價格</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-gray-900">{state.referencePrice}</span>
                                        <span className="text-sm text-gray-500">USDT</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="text-right">
                            {preservedQuoteState ? (
                                <>
                                    <div className={`flex items-center gap-1 text-xs font-medium ${preservedQuoteState.quoteCountdown < 30 ? 'text-red-600' : 'text-yellow-600'}`}>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formatTime(preservedQuoteState.quoteCountdown)}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">報價鎖定中</div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{refPriceCountdown}s</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">實際價格以報價為準</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chain List */}
                    <div className="space-y-2">
                        {CHAINS.map((chain) => {
                            const isSelected = state.pendingChain?.id === chain.id;
                            return (
                                <button
                                    key={chain.id}
                                    onClick={() => handleSelectChain(chain)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all group text-left ${
                                        isSelected
                                            ? 'border-yellow-500 bg-yellow-50'
                                            : 'border-gray-100 hover:border-yellow-400 hover:bg-yellow-50/30'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{chain.icon}</span>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm flex items-center gap-1.5">
                                                {chain.name}
                                                {chain.recommended && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded">
                                                        推薦
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-400">{chain.displayName}</div>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Compact Tip */}
                    <p className="text-[10px] text-gray-400 mt-3 text-center">
                        請選擇與錢包一致的網絡，錯誤網絡可能導致資產丟失
                    </p>
                </div>

                {state.holdBalance > 0 && (
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800">可用餘額抵扣：{state.holdBalance} USDT</span>
                    </div>
                )}
            </main>

            {/* Bottom Navigation Bar */}
            {state.pendingChain && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                    <div className="max-w-xl mx-auto">
                        <div className="bg-yellow-50 rounded-xl p-3 mb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{state.pendingChain.icon}</span>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{state.pendingChain.displayName}</div>
                                        <div className="text-xs text-gray-500">參考價格約 {state.referencePrice} USDT</div>
                                    </div>
                                </div>
                                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                    2分鐘報價
                                </span>
                            </div>
                        </div>

                        {/* Show return button if user has an active quote for this chain */}
                        {preservedQuoteState && state.pendingChain.id === preservedQuoteState.selectedChain.id ? (
                            <div className="space-y-2">
                                <button
                                    onClick={handleReturnToQuote}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    返回報價 (剩餘 {formatTime(preservedQuoteState.quoteCountdown)})
                                </button>
                                <button
                                    onClick={handleConfirmPurchase}
                                    disabled={isGeneratingQuote}
                                    className="w-full bg-white text-gray-700 font-medium text-base py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
                                >
                                    重新生成新報價
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConfirmPurchase}
                                disabled={isGeneratingQuote}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                            >
                                {isGeneratingQuote ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>正在獲取報價...</span>
                                    </>
                                ) : (
                                    '確認購買，獲取實際報價'
                                )}
                            </button>
                        )}
                        <p className="text-center text-xs text-gray-400 mt-2">
                            點擊後將生成2分鐘有效期的固定報價
                        </p>
                    </div>
                </div>
            )}

            {renderWhatsAppFAB()}
        </div>
    );

    // ============================================================================
    // PAGE 2: QUOTE & PAYMENT (2-minute countdown)
    // ============================================================================

    const renderQuotePage = () => (
        <div className="min-h-screen bg-gray-50">
            {renderHeader('完成支付')}

            <main className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-40">
                {/* Combined Quote & Payment Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    {/* Header: Amount + Countdown */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <div className="text-xs text-gray-400 mb-0.5">實際應付金額</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-gray-900">{state.quoteAmount}</span>
                                <span className="text-sm text-gray-500">USDT</span>
                            </div>
                        </div>
                        <div className={`text-right ${quoteCountdown < 30 ? 'text-red-600' : 'text-yellow-600'}`}>
                            <div className="flex items-center gap-1 text-lg font-bold">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTime(quoteCountdown)}
                            </div>
                            <div className="text-[10px]">報價鎖定中</div>
                        </div>
                    </div>

                    {/* Chain + Switch */}
                    {state.selectedChain && (
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{state.selectedChain.icon}</span>
                                <span className="text-sm font-medium text-gray-900">{state.selectedChain.displayName}</span>
                            </div>
                            <button
                                onClick={handleSwitchChainFromQuote}
                                className="text-xs text-yellow-600 font-medium px-2 py-1 rounded hover:bg-yellow-50 transition-colors"
                            >
                                切換網絡
                            </button>
                        </div>
                    )}

                    {/* QR + Address Row */}
                    {activeAddressId && (
                        <div className="flex gap-3 items-start">
                            <div className="w-24 h-24 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                                <svg className="w-14 h-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex gap-1.5 mb-1.5">
                                    <input
                                        type="text"
                                        value={paymentAddress}
                                        readOnly
                                        className="flex-1 px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-[11px] text-gray-600 truncate"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentAddress)}
                                        className="px-2.5 py-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                                    >
                                        複製
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    僅支持 <strong>{state.selectedChain?.displayName}</strong> 網絡，錯誤網絡將導致資產丟失
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Compact Notice */}
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        請確保支付 <strong>{state.quoteAmount} USDT</strong>，超時將自動更新報價。支付完成後請點擊下方按鈕檢測。
                    </p>
                </div>

                {showQuoteRefreshedNotice && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
                        <span className="text-sm text-blue-700">報價已自動更新</span>
                    </div>
                )}
            </main>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                <div className="max-w-xl mx-auto space-y-3">
                    <button
                        onClick={handleConfirmPayment}
                        disabled={isDetectingPayment}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                        {isDetectingPayment ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>檢測支付中...</span>
                            </>
                        ) : (
                            '我已完成轉賬，查看狀態'
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400">
                        點擊後系統將自動檢測區塊鏈到賬情況
                    </p>
                </div>
            </div>

            {isDetectingPayment && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 relative">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">正在檢測支付...</h3>
                            <p className="text-sm text-gray-500 mt-1">通常需要 10-30 秒</p>
                        </div>
                    </div>
                </div>
            )}

            {renderWhatsAppFAB()}
        </div>
    );

    // ============================================================================
    // PAGE 3: SETTLING (KYT check, 1-hour window, continue payment)
    // ============================================================================

    const renderSettlingPage = () => (
        <div className="min-h-screen bg-gray-50">
            {renderHeader('訂單結算中')}

            <main className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-40">
                {/* Combined Status Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    {/* Header: Status + Timer */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">
                                    {state.remainingAmount > 0
                                        ? '等待付款中'
                                        : state.kytStatus === 'pending'
                                            ? '已收到款項'
                                            : '卡號激活中'}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {state.remainingAmount > 0
                                        ? '請在限時內完成支付'
                                        : state.kytStatus === 'pending'
                                            ? '正在進行卡片激活，預計需 30 秒'
                                            : '系統處理中，請稍候'}
                                </p>
                            </div>
                        </div>
                        <div className={`text-right ${settlementCountdown < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                            <div className="text-xl font-bold">{formatTime(settlementCountdown)}</div>
                            <div className="text-xs text-gray-400">結算限時</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-500">支付進度</span>
                            <span className="font-medium text-gray-900">{Math.round(state.paidRatioToTotal * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, state.paidRatioToTotal * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Payment Amounts */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div className="text-center flex-1">
                            <div className="text-xs text-gray-400 mb-0.5">已支付</div>
                            <div className="font-semibold text-green-600">{state.paidAmount} <span className="text-xs">USDT</span></div>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="text-center flex-1">
                            <div className="text-xs text-gray-400 mb-0.5">還需支付</div>
                            <div className={`font-semibold ${state.remainingAmount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                {state.remainingAmount} <span className="text-xs">USDT</span>
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-200"></div>
                        <div className="text-center flex-1">
                            <div className="text-xs text-gray-400 mb-0.5">訂單總額</div>
                            <div className="font-semibold text-gray-900">{state.quoteAmount} <span className="text-xs">USDT</span></div>
                        </div>
                    </div>
                </div>

                {/* Payment Info (Only when remaining > 0) */}
                {state.remainingAmount > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        {/* Warning Banner */}
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 flex items-start gap-2.5">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-red-700 leading-relaxed">
                                請在 <strong>1 小時內</strong> 完成全額支付，逾期將扣除 5% 作為處理費用
                            </p>
                        </div>

                        {/* QR + Address in one row */}
                        <div className="flex gap-4 items-start">
                            <div className="w-28 h-28 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{state.selectedChain?.icon}</span>
                                    <span className="text-sm font-medium text-gray-900">{state.selectedChain?.displayName}</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={paymentAddress}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-600 truncate"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentAddress)}
                                        className="px-3 py-2 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                                    >
                                        複製
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">請使用同一地址支付剩餘金額</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dev/Test: Simulate settlement expiry */}
                <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">開發測試：模擬結算窗口到期</p>
                    <button
                        onClick={simulateSettlementExpiry}
                        className="w-full py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900"
                    >
                        模擬 1 小時到期
                    </button>
                </div>
            </main>

            {/* Bottom Action */}
            {state.remainingAmount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                    <div className="max-w-xl mx-auto space-y-3">
                        <button
                            onClick={handleContinuePaymentInSettling}
                            disabled={isDetectingPayment}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {isDetectingPayment ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>檢測支付中...</span>
                                </>
                            ) : (
                                '確認已支付剩餘金額'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {isDetectingPayment && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 relative">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">正在檢測支付...</h3>
                            <p className="text-sm text-gray-500 mt-1">通常需要 10-30 秒</p>
                        </div>
                    </div>
                </div>
            )}

            {renderWhatsAppFAB()}
        </div>
    );

    // ============================================================================
    // PAGE 4: ACTIVATION STATUS (Success / Processing / Failed)
    // ============================================================================

    const renderSuccessPage = () => {
        // Determine the current activation state
        const isProcessing = state.kytStatus === 'pending' && state.remainingAmount <= 0;
        const isFailed = state.kytStatus === 'fail';
        const isSuccess = state.kytStatus === 'pass' && state.remainingAmount <= 0;

        // Header title based on state
        const headerTitle = isProcessing ? '卡片激活中' : isFailed ? '資金異常' : '激活成功';

        return (
            <div className="min-h-screen bg-gray-50">
                {renderHeader(headerTitle, false)}

                <main className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32">
                    {renderCardInfo()}

                    {/* Status Card - changes based on activation state */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* Icon changes based on state */}
                            {isProcessing ? (
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : isFailed ? (
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex-1">
                                <h2 className="font-bold text-gray-900">
                                    {isProcessing ? '正在激活中' : isFailed ? '資金異常' : '卡號已激活'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {isProcessing
                                        ? '預計需要 30 秒完成激活'
                                        : isFailed
                                            ? '該筆資金存在合規問題，暫不可用'
                                            : `激活時間：${new Date().toLocaleString('zh-HK', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                                </p>
                            </div>

                            {/* Status badge */}
                            {isProcessing ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">激活中</span>
                            ) : isFailed ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">異常</span>
                            ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">已激活</span>
                            )}
                        </div>
                    </div>

                    {/* Additional info based on state */}
                    {isProcessing && (
                        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100 flex items-start gap-2">
                            <svg className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-yellow-800">
                                已收到款項 <strong>{state.paidAmount} USDT</strong>，正在進行卡片激活，請勿關閉頁面
                            </p>
                        </div>
                    )}

                    {isFailed && (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <div className="flex gap-2.5">
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div className="text-xs text-red-800 leading-relaxed">
                                    <p className="font-medium mb-1">需要人工處理</p>
                                    <p className="text-red-700">該筆資金存在合規問題，該卡已凍結。請聯繫客服進行線下核實與處理，通常需要 1-3 個工作日。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {state.paidAmount > (state.quoteAmount || 0) && isSuccess && (
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-start gap-2">
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-blue-800">
                                多付 <strong>{state.paidAmount - (state.quoteAmount || 0)} USDT</strong> 已記錄，請聯繫客服處理
                            </p>
                        </div>
                    )}
                </main>

                {/* Bottom Navigation Bar - only show when not processing */}
                {!isProcessing && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                        <div className="max-w-xl mx-auto space-y-3">
                            {isFailed ? (
                                <a
                                    href="https://wa.me/85212345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg py-4 rounded-full shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    聯繫客服處理
                                </a>
                            ) : (
                                <button
                                    onClick={() => router.push('/reseller-activation')}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                                >
                                    繼續購買下一張卡片
                                </button>
                            )}
                        </div>
                    </div>
                )}

            {renderWhatsAppFAB()}
        </div>
    );
    }

    // ============================================================================
    // PAGE 5: FUNDS BLOCKED
    // ============================================================================

    const renderFundsBlockedPage = () => (
        <div className="min-h-screen bg-gray-50">
            {renderHeader('資金異常', false)}

            <main className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32">
                {renderCardInfo()}

                {/* Error Status Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-gray-900 mb-1">資金異常</h2>
                            <p className="text-xs text-red-600 mb-3">該筆資金存在合規問題，暫不可用</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>已支付: <strong className="text-gray-900">{state.paidAmount} USDT</strong></span>
                                <span className="text-gray-300">|</span>
                                <span>{state.selectedChain?.displayName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <div className="flex gap-2.5">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="text-xs text-red-800 leading-relaxed">
                            <p className="font-medium mb-1">需要人工處理</p>
                            <p className="text-red-700">該卡已凍結，資金暫時凍結待審核。處理時間通常需 1-3 個工作日。</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                <div className="max-w-xl mx-auto">
                    <a
                        href="https://wa.me/85212345678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg py-4 rounded-full shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        聯繫客服處理
                    </a>
                </div>
            </div>
        </div>
    );

    // ============================================================================
    // PAGE 6: INCOMPLETE SETTLEMENT
    // ============================================================================

    const renderIncompletePage = () => (
        <div className="min-h-screen bg-gray-50">
            {renderHeader('未完成結算', false)}

            <main className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-32">
                {renderCardInfo()}

                {/* Status Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-gray-900 mb-1">未完成結算</h2>
                            <p className="text-xs text-gray-500 mb-3">未在規定時間內完成全額支付</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>已支付: <strong className="text-gray-900">{state.paidAmount} USDT</strong></span>
                                <span className="text-gray-300">|</span>
                                <span>{state.selectedChain?.displayName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fee Calculation Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">已支付總額</span>
                        <span className="text-gray-900">{state.paidAmount} USDT</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3 text-red-600">
                        <span>處理費用 (5%)</span>
                        <span>-{state.feeDeductedAmount} USDT</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                                {state.kytStatus === 'pass' ? '保留餘額' : '凍結餘額'}
                            </span>
                            <span className={`font-bold ${state.kytStatus === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                {state.kytStatus === 'pass' ? `${state.holdBalance} USDT` : '不可用'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {state.kytStatus === 'pass' ? (
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-green-800 leading-relaxed">
                            剩餘 <strong>{state.holdBalance} USDT</strong> 已保留，將在下次訂單自動抵扣。
                        </p>
                    </div>
                ) : (
                    <div className="bg-red-50 rounded-xl p-3 border border-red-100 flex items-start gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xs text-red-800 leading-relaxed">
                            該卡已凍結，餘額暫不可用。處理時間需 1-3 個工作日。
                        </p>
                    </div>
                )}

                </main>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe-bottom z-20">
                <div className="max-w-xl mx-auto">
                    {state.kytStatus === 'pass' ? (
                        <div className="space-y-3">
                            <button
                                onClick={handleNewOrder}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                            >
                                開啟新訂單（抵扣餘額）
                            </button>
                            <p className="text-center text-sm text-gray-500">可用餘額抵扣：{state.holdBalance} USDT</p>
                        </div>
                    ) : (
                        <a
                            href="https://wa.me/85212345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg py-4 rounded-full shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            聯繫客服處理
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    // ============================================================================
    // MAIN RENDER
    // ============================================================================

    switch (currentStep) {
        case 'CHAIN_SELECT':
            return renderChainSelectPage();
        case 'QUOTE':
            return renderQuotePage();
        case 'SETTLING':
            return renderSettlingPage();
        case 'SUCCESS':
        case 'FUNDS_BLOCKED':
            // Page 4 now handles: processing, success, and failed states
            return renderSuccessPage();
        case 'INCOMPLETE':
            return renderIncompletePage();
        default:
            return renderChainSelectPage();
    }
}

// ============================================================================
// PAGE EXPORT WITH SUSPENSE
// ============================================================================

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
