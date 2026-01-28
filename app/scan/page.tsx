'use client';

import Link from 'next/link';
import { useState } from 'react';

const copy = {
  heroTitleLine1: 'Easy Gold',
  heroTitleLine2: 'Real Value',
  heroSubtitle: 'Instant redemption, goods or cash.',
  cardAmount: '10',
  cardUnit: 'g',
  valueLine: '10 XAU₮ ≈ 2500 USD',
  valueSubline: 'Redeem digital gold or physical gold bars after collection.',
  bindButton: 'Bind Gift Card',
  stepsTitle: 'Activate gold assets in 3 steps',
  step1Title: 'Claim your digital gold',
  step2Title: 'Schedule physical redemption',
  step3Title: 'Deposit into your wallet',
  stepBody:
    'Click "Confirm Gift Card," enter the "redemption code" on the back of the card to claim your digital GoldFin account.',
  backedByGold: 'Each gram is backed by real gold',
  infoCardTitle: 'How to determine the value of the gift card?',
  infoCardBody:
    'This is a digital gold gift card. The amount on the card is measured in grams, and upon redemption, you will receive a digital gold balance that can be used to claim physical gold or withdrawn to your personal wallet.',
  partnerLine1: 'Working hand-in-hand with high-quality partners,',
  partnerLine2: 'we provide safe and reliable gold exchange services.',
  faqTitle: 'FAQ',
  faqQuestion1: 'What is TetherGold?',
  faqAnswer1:
    'Tether Gold is a digital asset pegged to physical gold, launched in 2020 by Tether, the stablecoin giant. Each XAUT token represents one troy ounce of gold stored in a secure vault in Switzerland.',
  faqQuestion2: 'Question 2',
  faqQuestion3: 'Question 3',
  faqQuestion4: 'Question 4',
  faqQuestion5: 'Question 5',
  faqQuestion6: 'Question 6',
  termsIntro:
    'By using the GoldFin gift card redemption service, you agree to the following terms and conditions:',
  terms: [
    'The gift card becomes effective immediately upon activation, and the physical card becomes invalid and cannot be canceled or refunded.',
    'All redemptions are subject to platform confirmation; the confirmation time will vary depending on the circumstances.',
    'The final specifications and quantity of gold delivered will be subject to the actual inventory of the store. GoldFin reserves the right of final interpretation.',
    "Users are responsible for safeguarding their account information and redemption QR code. GoldFin will not be liable for any losses caused by the user's personal reasons.",
    'GoldFin reserves the right to modify these terms of service at any time.',
  ],
  footer:
    '© 2026 GoldFin. All rights reserved. | Services available only in Hong Kong.',
};

const imgTexture =
  'https://www.figma.com/api/mcp/asset/fd76d626-6fbf-4be1-838e-9eae61d02dd2';
const imgNoiseTexture =
  'https://www.figma.com/api/mcp/asset/a895a69a-0b34-4566-9b9b-34ece0568797';
const imgWallet =
  'https://www.figma.com/api/mcp/asset/728f921a-79ba-4254-badc-755dae381c36';
const imgHeartSparkles =
  'https://www.figma.com/api/mcp/asset/bcf8812e-ee57-407b-9c81-d8d0b2f1fc25';
const imgEllipseGroup =
  'https://www.figma.com/api/mcp/asset/90554839-0351-4d2a-bbec-357b40d497e7';
const imgLine101 =
  'https://www.figma.com/api/mcp/asset/bdcee368-17a8-43ee-86ff-a6a3d9a4d067';
const imgGroupStep =
  'https://www.figma.com/api/mcp/asset/1734d2d7-c7cd-4430-a35a-04155733ebb2';
const imgTetherGoldLogo =
  'https://www.figma.com/api/mcp/asset/921c3e1b-9d5e-45d1-902b-03bb552a473e';
const imgTetherGoldLogoCard =
  'https://www.figma.com/api/mcp/asset/882f18aa-e815-4590-a561-f6ca3f5a21c3';
const imgEllipseBullet =
  'https://www.figma.com/api/mcp/asset/acd270f4-1214-42af-947f-ea486ce3bd44';

const gradientHeroTitle =
  'linear-gradient(100.26deg, #FFF3C5 -1.9%, #F7D377 33.86%, #DCAB46 51.07%, #D2822F 87.99%)';
const gradientHeroSubtitle =
  'linear-gradient(100.26deg, #FFF3C5 -1.9%, #F7D377 33.86%, #DCAB46 51.07%, #D2822F 87.99%, #6B3D15 106.77%)';
const gradientGoldWide =
  'linear-gradient(161.04358767367538deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientGoldFaq =
  'linear-gradient(165.06751199882558deg, rgb(255, 243, 197) 23.253%, rgb(247, 211, 119) 44.07%, rgb(220, 171, 70) 54.087%, rgb(210, 130, 47) 75.579%, rgb(107, 61, 21) 86.511%)';
const gradientStepsText =
  'linear-gradient(113.08709287374843deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientInfoTitle =
  'linear-gradient(126.21736127847876deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientInfoBody =
  'linear-gradient(108.72119018582683deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientFaqOpen =
  'linear-gradient(155.86173152454887deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientFaqClosed =
  'linear-gradient(160.3100503733612deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 11.687%, rgb(220, 171, 70) 33.106%, rgb(210, 130, 47) 43.032%)';
const gradientFaqBody =
  'linear-gradient(109.54915537870974deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientValueLine =
  'linear-gradient(161.33059049519247deg, rgb(255, 243, 197) 1.8958%, rgb(247, 211, 119) 33.863%, rgb(220, 171, 70) 51.07%, rgb(210, 130, 47) 87.987%, rgb(107, 61, 21) 106.77%)';
const gradientBindText =
  'linear-gradient(137.68400414392175deg, rgb(255, 243, 197) 1.9104%, rgb(247, 211, 119) 40.034%, rgb(220, 171, 70) 60.218%, rgb(210, 130, 47) 103.52%, rgb(107, 61, 21) 125.55%)';

const faqItems = [
  { id: 1, question: copy.faqQuestion1, answer: copy.faqAnswer1 },
  { id: 2, question: copy.faqQuestion2, answer: '' },
  { id: 3, question: copy.faqQuestion3, answer: '' },
  { id: 4, question: copy.faqQuestion4, answer: '' },
  { id: 5, question: copy.faqQuestion5, answer: '' },
  { id: 6, question: copy.faqQuestion6, answer: '' },
];

export default function ScanLandingPage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#060606] flex justify-center">
      <div
        className="relative"
        style={{ width: 390, height: 2600, backgroundColor: '#060606' }}
      >
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 390,
            height: 278,
            borderRadius: 10.833,
            border: '0.271px solid rgba(0,0,0,0.75)',
            boxShadow: '0px 1.083px 3.792px 0px rgba(0,0,0,0.25)',
            overflow: 'clip',
            backgroundColor: '#000000',
          }}
        >
          <div
            className="absolute"
            style={{
              left: -549.81,
              top: -275.59,
              width: 1099.052,
              height: 995.651,
            }}
          >
            <img
              alt=""
              src={imgEllipseGroup}
              className="block"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div
            className="absolute"
            style={{
              left: '50%',
              bottom: -127.33,
              width: 606.636,
              height: 205.631,
              transform: 'translateX(-50%)',
              backgroundColor: '#000000',
              filter: 'blur(54.167px)',
            }}
          />
          <div
            className="absolute"
            style={{
              inset: 'calc(-0.03% - 0.27px) calc(-269.24% - 1.73px) calc(-269.2% - 1.73px) calc(0.01% - 0.27px)',
              backgroundImage: `url('${imgTexture}')`,
              backgroundPosition: 'top left',
              backgroundSize: '1024px 1024px',
              mixBlendMode: 'overlay',
              opacity: 0.7,
            }}
          />
          <div
            className="absolute"
            style={{ left: -0.3, top: -0.18, width: 1440, height: 1024, opacity: 0.4 }}
          >
            <div
              aria-hidden="true"
              className="absolute"
              style={{
                inset: 0,
                backgroundImage: `url('${imgNoiseTexture}')`,
                backgroundPosition: 'top left',
                backgroundSize: '1738.35546875px 1738.35546875px',
                opacity: 0.08,
                pointerEvents: 'none',
              }}
            />
          </div>
          <div
            className="absolute"
            style={{
              left: 'calc(50% - 212px / 2 - 49px)',
              top: 88,
              width: 212,
              height: 102,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 600,
              fontSize: 46,
              lineHeight: '110%',
              display: 'flex',
              alignItems: 'center',
              textShadow: '3.80338px 3.8049px 5.68158px rgba(44, 18, 2, 0.8)',
              backgroundImage: gradientHeroTitle,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <div>
              <p className="m-0 whitespace-pre-wrap">{copy.heroTitleLine1}</p>
              <p className="m-0 whitespace-pre-wrap">{copy.heroTitleLine2}</p>
            </div>
          </div>
          <div
            className="absolute"
            style={{
              left: 'calc(50% - 289px / 2 - 11.5px)',
              top: 200,
              width: 289,
              height: 18,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 400,
              fontSize: 18,
              lineHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              textShadow: '3.80338px 3.8049px 5.68158px #2C1202',
              backgroundImage: gradientHeroSubtitle,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 whitespace-pre-wrap">{copy.heroSubtitle}</p>
          </div>
        </div>

        <div
          className="absolute"
          style={{ left: 18, top: 278, width: 354, height: 224 }}
        >
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: 354,
              height: 224,
              borderRadius: 16,
              overflow: 'clip',
              boxShadow: '3.17px 3.17px 10.2px 0px rgba(44,18,2,0.6)',
            }}
          >
            <div
              className="absolute"
              style={{
                inset: 0,
                borderRadius: 16,
                backgroundImage:
                  'linear-gradient(94.72deg, #D2822F -25.7%, #DAA543 31.27%, #F7D377 81.84%)',
                transform: 'rotate(180deg)',
                transformOrigin: 'center',
              }}
            />
            <div
              className="absolute"
              style={{ right: 20.01, bottom: 20.33, width: 100.493, height: 31.541 }}
            >
              <img
                alt=""
                src={imgTetherGoldLogoCard}
                className="block"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
        <div
          className="absolute"
          style={{
            left: 314.58,
            top: 312.6,
            transform: 'translateY(-50%)',
            width: 28,
            height: 27.073,
            fontFamily: 'Douyin Sans, sans-serif',
            fontWeight: 700,
            fontSize: 27.312,
            lineHeight: 'normal',
            color: '#7b4612',
            zIndex: 2,
          }}
        >
          <p className="m-0 whitespace-pre-wrap">{copy.cardAmount}</p>
        </div>
        <div
          className="absolute"
          style={{
            left: 343.64,
            top: 315.06,
            transform: 'translateY(-50%)',
            width: 8,
            height: 13.035,
            fontFamily: 'Douyin Sans, sans-serif',
            fontWeight: 700,
            fontSize: 12.605,
            lineHeight: 'normal',
            color: '#7b4612',
            zIndex: 2,
          }}
        >
          <p className="m-0 whitespace-pre-wrap">{copy.cardUnit}</p>
        </div>

        <div className="absolute" style={{ left: 0, top: 0, width: 390, height: 600 }}>
          <div
            className="absolute"
            style={{
              left: 'calc(50% + 0.5px)',
              top: 519,
              transform: 'translate(-50%, -50%)',
              width: 229,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'center',
              textShadow: '7.179px 7.182px 10.724px #2c1202',
              backgroundImage: gradientValueLine,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 leading-none whitespace-pre-wrap">{copy.valueLine}</p>
          </div>
          <div
            className="absolute"
            style={{
              left: 'calc(50% - 125px)',
              top: 538,
              transform: 'translateY(-50%)',
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 400,
              fontSize: 10,
              lineHeight: 1.2,
              color: '#453113',
              whiteSpace: 'nowrap',
            }}
          >
            <p className="m-0">{copy.valueSubline}</p>
          </div>
        </div>

        <div className="absolute" style={{ left: 18, top: 562, width: 354, height: 50 }}>
          <Link href="/activate" className="block relative w-full h-full">
            <div
              className="absolute"
              style={{
                left: 0,
                top: 0,
                width: 354,
                height: 50,
                borderRadius: 100,
                border: '1px solid #f3cd71',
                backdropFilter: 'blur(32px)',
                backgroundImage:
                  'linear-gradient(162.53855850645098deg, rgba(217, 159, 63, 0.2) 25.033%, rgba(98, 49, 0, 0.2) 55.797%, rgba(28, 14, 0, 0.2) 88.622%)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: 192.5,
                top: 25,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Bentley, sans-serif',
                fontWeight: 600,
                fontSize: 18,
                textAlign: 'center',
                textShadow: '7.179px 7.182px 10.724px #2c1202',
                backgroundImage: gradientBindText,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              <p className="m-0 leading-none">{copy.bindButton}</p>
            </div>
          </Link>
        </div>

        <div className="absolute" style={{ left: 18, top: 662, width: 354 }}>
          <div
            className="absolute"
            style={{
              left: 0,
              top: 52,
              width: 354,
              height: 440,
              borderRadius: 16,
              backdropFilter: 'blur(32px)',
              backgroundImage:
                'linear-gradient(150.61712957686265deg, rgba(217, 159, 63, 0.2) 1.3658%, rgba(98, 49, 0, 0.2) 43.662%, rgba(6, 6, 6, 0.2) 82.08%)',
            }}
          />
          <div
            className="absolute"
            style={{
              left: 177,
              top: 11,
              transform: 'translate(-50%, -50%)',
              width: 354,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 600,
              fontSize: 22,
              textAlign: 'center',
              textShadow: '7.179px 7.182px 10.724px #2c1202',
              backgroundImage: gradientGoldWide,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 leading-none whitespace-pre-wrap">{copy.stepsTitle}</p>
          </div>

          <div className="absolute" style={{ left: 32.5, top: 107, width: 0, height: 275 }}>
            <div style={{ transform: 'rotate(90deg)' }}>
              <div className="relative" style={{ width: 275, height: 0 }}>
                <div className="absolute" style={{ inset: '-1px 0 0 0' }}>
                  <img alt="" src={imgLine101} className="block" style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute" style={{ left: 21, top: 76.9, width: 24, height: 24 }}>
            <div className="absolute" style={{ inset: '-19% -36.14% -36.14% -19%' }}>
              <img alt="" src={imgGroupStep} className="block" style={{ width: '100%', height: '100%' }} />
            </div>
            <div
              className="absolute"
              style={{
                left: 12.19,
                top: 12,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Bentley, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                color: '#271102',
                textAlign: 'center',
              }}
            >
              <p className="m-0 leading-none">01</p>
            </div>
          </div>

          <div className="absolute" style={{ left: 21, top: 218.5, width: 24, height: 24 }}>
            <div className="absolute" style={{ inset: '-19% -36.14% -36.14% -19%' }}>
              <img alt="" src={imgGroupStep} className="block" style={{ width: '100%', height: '100%' }} />
            </div>
            <div
              className="absolute"
              style={{
                left: 11.39,
                top: 11.9,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Bentley, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                color: '#271102',
                textAlign: 'center',
              }}
            >
              <p className="m-0 leading-none">02</p>
            </div>
          </div>

          <div className="absolute" style={{ left: 21, top: 362.1, width: 24, height: 24 }}>
            <div className="absolute" style={{ inset: '-19% -36.14% -36.14% -19%' }}>
              <img alt="" src={imgGroupStep} className="block" style={{ width: '100%', height: '100%' }} />
            </div>
            <div
              className="absolute"
              style={{
                left: 11.39,
                top: 11.84,
                transform: 'translate(-50%, -50%)',
                fontFamily: 'Bentley, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                color: '#271102',
                textAlign: 'center',
              }}
            >
              <p className="m-0 leading-none">03</p>
            </div>
          </div>

          <div
            className="absolute"
            style={{
              left: 58,
              top: 129,
              transform: 'translateY(-50%)',
              width: 278,
              fontFamily: 'Bentley, sans-serif',
              textShadow: '8.169px 8.173px 12.203px #2c1202',
              backgroundImage: gradientStepsText,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 text-[18px] font-semibold">{copy.step1Title}</p>
            <p className="m-0 text-[14px] font-light leading-[2]">{copy.stepBody}</p>
          </div>
          <div
            className="absolute"
            style={{
              left: 58,
              top: 272,
              transform: 'translateY(-50%)',
              width: 278,
              fontFamily: 'Bentley, sans-serif',
              textShadow: '8.169px 8.173px 12.203px #2c1202',
              backgroundImage: gradientStepsText,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 text-[18px] font-semibold">{copy.step2Title}</p>
            <p className="m-0 text-[14px] font-light leading-[2]">{copy.stepBody}</p>
          </div>
          <div
            className="absolute"
            style={{
              left: 58,
              top: 415,
              transform: 'translateY(-50%)',
              width: 278,
              fontFamily: 'Bentley, sans-serif',
              textShadow: '8.169px 8.173px 12.203px #2c1202',
              backgroundImage: gradientStepsText,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <p className="m-0 text-[18px] font-semibold">{copy.step3Title}</p>
            <p className="m-0 text-[14px] font-light leading-[2]">{copy.stepBody}</p>
          </div>
        </div>

        <div
          className="absolute"
          style={{
            left: 195,
            top: 1197,
            transform: 'translate(-50%, -50%)',
            width: 354,
            fontFamily: 'Bentley, sans-serif',
            fontWeight: 600,
            fontSize: 22,
            textAlign: 'center',
            textShadow: '7.179px 7.182px 10.724px #2c1202',
            backgroundImage: gradientGoldWide,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            zIndex: 2,
          }}
        >
          <p className="m-0 leading-none whitespace-pre-wrap">{copy.backedByGold}</p>
        </div>

        <div
          className="absolute"
          style={{ left: 0, top: 1238, width: 390, height: 249, overflowX: 'auto', overflowY: 'hidden', zIndex: 1 }}
        >
          <div className="relative" style={{ width: 580, height: 249 }}>
            <div className="absolute" style={{ left: 18, top: 0, width: 272, height: 249 }}>
              <div
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: 272,
                  height: 249,
                  borderRadius: 16,
                  border: '1px solid #e3b655',
                  backdropFilter: 'blur(32px)',
                  backgroundImage:
                    'linear-gradient(138.10083919168807deg, rgba(217, 159, 63, 0.2) 23.992%, rgba(98, 49, 0, 0.2) 55.873%, rgba(28, 14, 0, 0.2) 89.889%)',
                }}
              />
              <div className="absolute" style={{ left: 9, top: 14, width: 71, height: 71 }}>
                <img
                  alt=""
                  src={imgWallet}
                  className="absolute"
                  style={{ inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                className="absolute"
                style={{
                  left: 84,
                  top: 52,
                  transform: 'translateY(-50%)',
                  width: 170,
                  fontFamily: 'Bentley, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.3,
                  textShadow: '8.169px 8.173px 12.203px #2c1202',
                  backgroundImage: gradientInfoTitle,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <p className="m-0 whitespace-pre-wrap">{copy.infoCardTitle}</p>
              </div>
              <div
                className="absolute"
                style={{
                  left: 18,
                  top: 156,
                  transform: 'translateY(-50%)',
                  width: 236,
                  fontFamily: 'Bentley, sans-serif',
                  fontWeight: 300,
                  fontSize: 14,
                  lineHeight: 1.5,
                  textShadow: '8.169px 8.173px 12.203px #2c1202',
                  backgroundImage: gradientInfoBody,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <p className="m-0 whitespace-pre-wrap">{copy.infoCardBody}</p>
              </div>
            </div>

            <div className="absolute" style={{ left: 308, top: 0, width: 272, height: 249 }}>
              <div
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  width: 272,
                  height: 249,
                  borderRadius: 16,
                  backdropFilter: 'blur(32px)',
                  backgroundImage:
                    'linear-gradient(138.10083919168807deg, rgba(217, 159, 63, 0.2) 23.992%, rgba(98, 49, 0, 0.2) 55.873%, rgba(28, 14, 0, 0.2) 89.889%)',
                }}
              />
              <div className="absolute" style={{ left: 16.5, top: 18.5, width: 62, height: 62 }}>
                <img
                  alt=""
                  src={imgHeartSparkles}
                  className="absolute"
                  style={{ inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                className="absolute"
                style={{
                  left: 84,
                  top: 52,
                  transform: 'translateY(-50%)',
                  width: 170,
                  fontFamily: 'Bentley, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.3,
                  textShadow: '8.169px 8.173px 12.203px #2c1202',
                  backgroundImage: gradientInfoTitle,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <p className="m-0 whitespace-pre-wrap">{copy.infoCardTitle}</p>
              </div>
              <div
                className="absolute"
                style={{
                  left: 18,
                  top: 156,
                  transform: 'translateY(-50%)',
                  width: 236,
                  fontFamily: 'Bentley, sans-serif',
                  fontWeight: 300,
                  fontSize: 14,
                  lineHeight: 1.5,
                  textShadow: '8.169px 8.173px 12.203px #2c1202',
                  backgroundImage: gradientInfoBody,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <p className="m-0 whitespace-pre-wrap">{copy.infoCardBody}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute"
          style={{
            left: 18,
            top: 1520,
            fontFamily: 'Bentley, sans-serif',
            fontWeight: 400,
            fontSize: 9,
            lineHeight: 1.4,
            color: '#453113',
            textShadow: '7.179px 7.182px 10.724px #2c1202',
            whiteSpace: 'nowrap',
          }}
        >
          <p className="m-0">{copy.partnerLine1}</p>
          <p className="m-0">{copy.partnerLine2}</p>
        </div>
        <div className="absolute" style={{ left: 237, top: 1520.83, width: 60.929, height: 19.124 }}>
          <img alt="" src={imgTetherGoldLogo} className="block" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute" style={{ left: 314, top: 1521, width: 60.929, height: 19.124 }}>
          <img alt="" src={imgTetherGoldLogo} className="block" style={{ width: '100%', height: '100%' }} />
        </div>

        <div
          className="absolute"
          style={{
            left: 195,
            top: 1604,
            transform: 'translate(-50%, -50%)',
            width: 354,
            fontFamily: 'Bentley, sans-serif',
            fontWeight: 600,
            fontSize: 22,
            textAlign: 'center',
            textShadow: '7.179px 7.182px 10.724px #2c1202',
            backgroundImage: gradientGoldFaq,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <p className="m-0 leading-none whitespace-pre-wrap">{copy.faqTitle}</p>
        </div>

        <div
          className="absolute"
          style={{ left: 18, top: 1645, width: 354, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {faqItems.map((item) => {
            const isOpen = openFaqId === item.id;
            const isFirst = item.id === 1;
            return (
              <div key={item.id} className="relative w-full">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="relative w-full text-left"
                  style={{
                    height: isOpen && isFirst ? 238 : 76,
                    borderRadius: isOpen && isFirst ? 16 : 0,
                    border: isOpen && isFirst ? '1px solid #e3b655' : 'none',
                    backdropFilter: isOpen && isFirst ? 'blur(32px)' : 'none',
                    backgroundImage:
                      isOpen && isFirst
                        ? 'linear-gradient(146.61767152747598deg, rgba(217, 159, 63, 0.2) 23.992%, rgba(98, 49, 0, 0.2) 55.873%, rgba(28, 14, 0, 0.2) 89.889%)'
                        : 'none',
                    padding: isOpen && isFirst ? 0 : '24px 20px',
                    display: 'flex',
                    alignItems: isOpen && isFirst ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      position: isOpen && isFirst ? 'absolute' : 'relative',
                      left: isOpen && isFirst ? 19 : 0,
                      top: isOpen && isFirst ? 33 : 'auto',
                      transform: isOpen && isFirst ? 'translateY(-50%)' : 'none',
                      fontFamily: 'Bentley, sans-serif',
                      fontWeight: 600,
                      fontSize: 18,
                      textShadow: '8.169px 8.173px 12.203px #2c1202',
                      backgroundImage: isOpen && isFirst ? gradientFaqOpen : gradientFaqClosed,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      minWidth: 240,
                    }}
                  >
                    <p className="m-0 leading-none whitespace-pre-wrap">{item.question}</p>
                  </div>
                  <div
                    style={{
                      position: isOpen && isFirst ? 'absolute' : 'relative',
                      right: isOpen && isFirst ? 18 : 0,
                      top: isOpen && isFirst ? 22 : 'auto',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isOpen ? (
                        <path d="M4 12H20" stroke="#F7D377" strokeWidth="2" />
                      ) : (
                        <path d="M12 4V20M4 12H20" stroke="#F7D377" strokeWidth="2" />
                      )}
                    </svg>
                  </div>
                </button>
                {isOpen && item.answer && (
                  <div
                    className="absolute"
                    style={{
                      left: -1,
                      top: 55,
                      width: 333,
                      height: 82,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: 20,
                        top: 77,
                        transform: 'translateY(-50%)',
                        width: 314,
                        fontFamily: 'Bentley, sans-serif',
                        fontWeight: 300,
                        fontSize: 16,
                        lineHeight: 2,
                        textShadow: '8.169px 8.173px 12.203px #2c1202',
                        backgroundImage: gradientFaqBody,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <p className="m-0 whitespace-pre-wrap">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="absolute"
          style={{ left: 18, top: 2284, width: 354, height: 258, borderRadius: 16 }}
        >
          <div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: 354,
              height: 258,
              borderRadius: 16,
              backdropFilter: 'blur(32px)',
              backgroundImage:
                'linear-gradient(165.17998884438606deg, rgba(217, 159, 63, 0.2) 16.786%, rgba(98, 49, 0, 0.2) 39.745%, rgba(6, 6, 6, 0.2) 67.516%)',
            }}
          />
          <p
            className="absolute"
            style={{
              left: 18,
              top: 18,
              width: 318,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 400,
              fontSize: 12,
              lineHeight: 1.4,
              color: '#f1cb60',
              opacity: 0.5,
            }}
          >
            {copy.termsIntro}
          </p>
          <div
            className="absolute"
            style={{
              left: 30,
              top: 58,
              width: 306,
              fontFamily: 'Bentley, sans-serif',
              fontWeight: 400,
              fontSize: 9,
              lineHeight: 1.8,
              color: '#f1cb60',
              opacity: 0.5,
            }}
          >
            <p className="m-0">{copy.terms[0]}</p>
            <p className="m-0">{copy.terms[1]}</p>
            <p className="m-0">{copy.terms[2]}</p>
            <p className="m-0">{copy.terms[3]}</p>
            <p className="m-0">{copy.terms[4]}</p>
          </div>
          <div className="absolute" style={{ left: 20, top: 64, width: 4, height: 4 }}>
            <img alt="" src={imgEllipseBullet} className="block" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute" style={{ left: 20, top: 96, width: 4, height: 4 }}>
            <img alt="" src={imgEllipseBullet} className="block" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute" style={{ left: 20, top: 128, width: 4, height: 4 }}>
            <img alt="" src={imgEllipseBullet} className="block" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute" style={{ left: 20, top: 176, width: 4, height: 4 }}>
            <img alt="" src={imgEllipseBullet} className="block" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="absolute" style={{ left: 20, top: 224, width: 4, height: 4 }}>
            <img alt="" src={imgEllipseBullet} className="block" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        <div
          className="absolute"
          style={{
            left: '50%',
            top: 2558.5,
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Bentley, sans-serif',
            fontWeight: 400,
            fontSize: 9,
            lineHeight: 1.4,
            color: '#453113',
            whiteSpace: 'nowrap',
          }}
        >
          <p className="m-0">{copy.footer}</p>
        </div>
      </div>
    </div>
  );
}
