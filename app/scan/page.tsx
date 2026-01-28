'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Dynamic card data - in production, this would come from API or URL params
const CARD_DATA = {
  amount: 10,
  currency: 'XAU₮',
  usdValue: 2500,
};

const FAQ_ITEMS = [
  {
    id: 1,
    question: 'What is TetherGold?',
    answer: 'Tether Gold is a digital asset pegged to physical gold, launched in 2020 by Tether, the stablecoin giant. Each XAUT token represents one troy ounce of gold stored in a secure vault in Switzerland.',
  },
  {
    id: 2,
    question: 'How do I redeem my gift card?',
    answer: 'Click "Bind Gift Card", enter the redemption code on the back of your card, and the gold value will be instantly credited to your GoldFin account.',
  },
  {
    id: 3,
    question: 'Can I withdraw physical gold?',
    answer: 'Yes, you can schedule a physical gold redemption at our partner locations. The minimum withdrawal amount is 100g.',
  },
  {
    id: 4,
    question: 'Is my gold secure?',
    answer: 'Absolutely. All gold is backed by Tether Gold (XAUT) tokens, which represent physical gold stored in Swiss vaults with regular third-party audits.',
  },
  {
    id: 5,
    question: 'What fees are involved?',
    answer: 'Gift card activation is free. Physical redemption has a small handling fee. Converting XAUT to USDT uses decentralized exchanges with standard network fees.',
  },
  {
    id: 6,
    question: 'How long is the gift card valid?',
    answer: 'GoldFin gift cards do not expire. However, once activated, the physical card becomes invalid for security reasons.',
  },
];

export default function ScanLandingPage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white overflow-x-hidden">
      {/* Background Layer - Bottom gradient to avoid pure black */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-[#060606]" />
        {/* Top-left glow for hero area */}
        <div className="absolute -left-[200px] -top-[200px] w-[800px] h-[800px] opacity-40">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D89F3F]/20 via-[#623100]/10 to-transparent blur-3xl" />
        </div>
        {/* Bottom gradient layer */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#0a0804] via-[#080605] to-transparent" />
        {/* Subtle noise/texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Section */}
      <div className="relative h-[278px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[#060606]">
          {/* Golden Ellipse Background Image */}
          <div className="absolute -left-[300px] -top-[150px] w-[900px] h-[800px] opacity-80">
            <img
              src="https://www.figma.com/api/mcp/asset/0103067d-e3dc-452c-a304-f194fb8759a3"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay"
               style={{
                 backgroundImage: `url("https://www.figma.com/api/mcp/asset/4db0399c-c7b9-40fa-9dc6-a46b7f809e3c")`,
                 backgroundSize: '1024px 1024px'
               }} />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: `url("https://www.figma.com/api/mcp/asset/14aa6303-491d-40da-a95f-6428b38c845d")`,
                 backgroundSize: '400px 400px'
               }} />
          {/* Bottom blur for fade effect */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-black blur-[54px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 pt-8">
          <h1 className="text-[46px] font-bold leading-[1.1] tracking-tight mb-3"
              style={{
                background: 'linear-gradient(110.6deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '3.8px 3.8px 5.7px rgba(44,18,2,0.8)'
              }}>
            Easy Gold<br />Real Value
          </h1>
          <p className="text-lg leading-relaxed"
             style={{
               background: 'linear-gradient(161deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               textShadow: '3.8px 3.8px 5.7px #2c1202'
             }}>
            Instant redemption, goods or cash.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-8">
        {/* Gold Card Display */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-[354px] h-[224px] rounded-2xl overflow-hidden shadow-[3px_3px_10px_rgba(44,18,2,0.6)]"
               style={{
                 background: 'linear-gradient(97.4deg, #D2822F 25.7%, #DAA543 31.3%, #F7D377 81.8%)'
               }}>
            {/* Tether Gold Logo - Bottom Right */}
            <div className="absolute bottom-5 right-5">
              <Image
                src="/images/tether-gold-logo.png"
                alt="Tether Gold"
                width={100}
                height={32}
                className="object-contain"
              />
            </div>
            {/* Card Value - Top Right */}
            <div className="absolute top-5 right-5 text-[#7B4612] font-bold">
              <span className="text-[28px]">{CARD_DATA.amount}</span>
              <span className="text-[13px] ml-1">g</span>
            </div>
          </div>
        </div>

        {/* Value Text - Dynamic */}
        <div className="text-center mb-6">
          <p className="text-[14px] font-semibold mb-1"
             style={{
               background: 'linear-gradient(161.3deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               textShadow: '7px 7px 10.7px #2c1202'
             }}>
            {CARD_DATA.amount} {CARD_DATA.currency} ≈ {CARD_DATA.usdValue.toLocaleString()} USD
          </p>
          <p className="text-[10px] text-[#453113]">
            Redeem digital gold or physical gold bars after collection.
          </p>
        </div>

        {/* Bind Gift Card Button */}
        <Link href="/activate">
          <div className="w-full h-[50px] rounded-full flex items-center justify-center mb-10 border border-[#F3CD71]"
               style={{
                 background: 'linear-gradient(162.5deg, rgba(217,159,63,0.2) 25%, rgba(98,49,0,0.2) 56%, rgba(28,14,0,0.2) 89%)',
                 backdropFilter: 'blur(32px)'
               }}>
            <span className="text-[18px] font-semibold"
                  style={{
                    background: 'linear-gradient(137.7deg, #FFF3C5 1.9%, #F7D377 40%, #DCAB46 60.2%, #D2822F 103.5%, #6B3D15 125.6%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '7px 7px 10.7px #2c1202'
                  }}>
              Bind Gift Card
            </span>
          </div>
        </Link>

        {/* 3 Steps Section */}
        <div className="mb-10">
          <h2 className="text-center text-[22px] font-semibold mb-6"
              style={{
                background: 'linear-gradient(161deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '7px 7px 10.7px #2c1202'
              }}>
            Activate gold assets in 3 steps
          </h2>

          <div className="rounded-2xl p-5 relative"
               style={{
                 background: 'linear-gradient(150.6deg, rgba(217,159,63,0.2) 1.4%, rgba(98,49,0,0.2) 43.7%, rgba(6,6,6,0.2) 82.1%)',
                 backdropFilter: 'blur(32px)'
               }}>
            {/* Vertical Line */}
            <div className="absolute left-[33px] top-[55px] w-[1px] h-[230px] bg-gradient-to-b from-[#F7D377]/50 via-[#DCAB46]/30 to-transparent" />

            {/* Step 1 */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#F7D377] flex items-center justify-center">
                  <span className="text-[#271102] text-[12px] font-bold">01</span>
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-1"
                    style={{
                      background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '8px 8px 12px #2c1202'
                    }}>
                  Claim your digital gold
                </h3>
                <p className="text-[14px] leading-relaxed opacity-80"
                   style={{
                     background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     textShadow: '8px 8px 12px #2c1202'
                   }}>
                  Click &quot;Confirm Gift Card,&quot; enter the &quot;redemption code&quot; on the back of the card to claim your digital GoldFin account.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 mb-8">
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#F7D377] flex items-center justify-center">
                  <span className="text-[#271102] text-[12px] font-bold">02</span>
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-1"
                    style={{
                      background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '8px 8px 12px #2c1202'
                    }}>
                  Schedule physical redemption
                </h3>
                <p className="text-[14px] leading-relaxed opacity-80"
                   style={{
                     background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     textShadow: '8px 8px 12px #2c1202'
                   }}>
                  Click &quot;Confirm Gift Card,&quot; enter the &quot;redemption code&quot; on the back of the card to claim your digital GoldFin account.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#F7D377] flex items-center justify-center">
                  <span className="text-[#271102] text-[12px] font-bold">03</span>
                </div>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-1"
                    style={{
                      background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '8px 8px 12px #2c1202'
                    }}>
                  Deposit into your wallet
                </h3>
                <p className="text-[14px] leading-relaxed opacity-80"
                   style={{
                     background: 'linear-gradient(113.1deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '8px 8px 12px #2c1202'
                   }}>
                  Click &quot;Confirm Gift Card,&quot; enter the &quot;redemption code&quot; on the back of the card to claim your digital GoldFin account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Each gram is backed by real gold */}
        <h2 className="text-center text-[22px] font-semibold mb-4"
            style={{
              background: 'linear-gradient(161deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '7px 7px 10.7px #2c1202'
            }}>
          Each gram is backed by real gold
        </h2>

        {/* Info Cards - Fixed height and margin */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {/* Card 1 */}
          <div className="flex-shrink-0 w-[272px] min-h-[280px] rounded-2xl p-5 border border-[#E3B655] snap-start mb-2"
               style={{
                 background: 'linear-gradient(138.1deg, rgba(217,159,63,0.2) 24%, rgba(98,49,0,0.2) 55.9%, rgba(28,14,0,0.2) 89.9%)',
                 backdropFilter: 'blur(32px)'
               }}>
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#F7D377]/30 to-[#D2822F]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#F7D377]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold mb-3 leading-tight"
                style={{
                  background: 'linear-gradient(126.2deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '8px 8px 12px #2c1202'
                }}>
              How to determine the value of the gift card?
            </h3>
            <p className="text-[14px] leading-relaxed"
               style={{
                 background: 'linear-gradient(108.7deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 textShadow: '8px 8px 12px #2c1202'
               }}>
              This is a digital gold gift card. The amount on the card is measured in grams, and upon redemption, you will receive a digital gold balance that can be used to claim physical gold or withdrawn to your personal wallet.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-shrink-0 w-[272px] min-h-[280px] rounded-2xl p-5 snap-start mb-2"
               style={{
                 background: 'linear-gradient(138.1deg, rgba(217,159,63,0.2) 24%, rgba(98,49,0,0.2) 55.9%, rgba(28,14,0,0.2) 89.9%)',
                 backdropFilter: 'blur(32px)'
               }}>
            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#F7D377]/30 to-[#D2822F]/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#F7D377]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold mb-3 leading-tight"
                style={{
                  background: 'linear-gradient(126.2deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '8px 8px 12px #2c1202'
                }}>
              How to determine the value of the gift card?
            </h3>
            <p className="text-[14px] leading-relaxed"
               style={{
                 background: 'linear-gradient(108.7deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                 WebkitBackgroundClip: 'text',
                 WebkitTextFillColor: 'transparent',
                 textShadow: '8px 8px 12px #2c1202'
               }}>
              This is a digital gold gift card. The amount on the card is measured in grams, and upon redemption, you will receive a digital gold balance that can be used to claim physical gold or withdrawn to your personal wallet.
            </p>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <p className="text-[9px] text-[#453113] leading-tight">
            Working hand-in-hand with high-quality partners,<br />
            we provide safe and reliable gold exchange services.
          </p>
          <div className="flex gap-2">
            <Image
              src="/images/tether-gold-logo.png"
              alt="Tether Gold"
              width={60}
              height={19}
              className="object-contain opacity-80"
            />
            <Image
              src="/images/tether-gold-logo.png"
              alt="Tether Gold"
              width={60}
              height={19}
              className="object-contain opacity-80"
            />
          </div>
        </div>

        {/* FAQ Section with Toggle */}
        <h2 className="text-center text-[22px] font-semibold mb-4"
            style={{
              background: 'linear-gradient(165.1deg, #FFF3C5 23.3%, #F7D377 44.1%, #DCAB46 54.1%, #D2822F 75.6%, #6B3D15 86.5%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '7px 7px 10.7px #2c1202'
            }}>
          FAQ
        </h2>

        <div className="rounded-2xl overflow-hidden mb-8"
             style={{
               background: 'linear-gradient(138.1deg, rgba(217,159,63,0.2) 24%, rgba(98,49,0,0.2) 55.9%, rgba(28,14,0,0.2) 89.9%)',
               backdropFilter: 'blur(32px)'
             }}>
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`border-b border-[#E3B655]/20 last:border-b-0 ${openFaqId === item.id ? 'p-5' : 'px-5 py-4'}`}
            >
              <button
                className="w-full flex items-center justify-between"
                onClick={() => toggleFaq(item.id)}
              >
                <h3 className="text-[18px] font-semibold text-left pr-4"
                    style={{
                      background: 'linear-gradient(155.9deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '8px 8px 12px #2c1202'
                    }}>
                  {item.question}
                </h3>
                <svg
                  className="w-6 h-6 text-[#F7D377] flex-shrink-0 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {openFaqId === item.id ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  )}
                </svg>
              </button>
              {openFaqId === item.id && (
                <p className="text-[16px] leading-relaxed mt-3"
                   style={{
                     background: 'linear-gradient(109.5deg, #FFF3C5 1.9%, #F7D377 33.9%, #DCAB46 51.1%, #D2822F 88%, #6B3D15 106.8%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     textShadow: '8px 8px 12px #2c1202'
                   }}>
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Terms Section */}
        <div className="rounded-2xl p-5 mb-6"
             style={{
               background: 'linear-gradient(165.2deg, rgba(217,159,63,0.2) 16.8%, rgba(98,49,0,0.2) 39.7%, rgba(6,6,6,0.2) 67.5%)',
               backdropFilter: 'blur(32px)'
             }}>
          <p className="text-[12px] text-[#F1CB60]/50 mb-4">
            By using the GoldFin gift card redemption service, you agree to the following terms and conditions:
          </p>
          <ul className="space-y-3">
            {[
              'The gift card becomes effective immediately upon activation, and the physical card becomes invalid and cannot be canceled or refunded.',
              'All redemptions are subject to platform confirmation; the confirmation time will vary depending on the circumstances.',
              'The final specifications and quantity of gold delivered will be subject to the actual inventory of the store. GoldFin reserves the right of final interpretation.',
              'Users are responsible for safeguarding their account information and redemption QR code. GoldFin will not be liable for any losses caused by the user\'s personal reasons.',
              'GoldFin reserves the right to modify these terms of service at any time.'
            ].map((term, i) => (
              <li key={i} className="flex gap-2 text-[9px] text-[#F1CB60]/50">
                <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[#F1CB60]/50 mt-1" />
                {term}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[9px] text-[#453113]">
            © 2026 GoldFin. All rights reserved. | Services available only in Hong Kong.
          </p>
        </div>
      </main>
    </div>
  );
}
