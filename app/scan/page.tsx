import Image from 'next/image';
import Link from 'next/link';

export default function ScanLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Slim Header with CTA */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Image
            src="/images/goldfin-logo.png"
            alt="Goldfin"
            width={90}
            height={30}
            className="object-contain"
            priority
          />
          <Link
            href="/activate"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            綁定禮品卡
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 pt-6 sm:pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-4 sm:mb-6">
              你的數字黃金
              <br />
              隨時握在手中
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light">
              無需實名 · 全球兌換 · 靈活變現
            </p>
          </div>

          {/* How to Start - 调整到第二位 */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              如何開始
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    註冊賬戶
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    創建數字黃金賬戶
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    輸入卡密
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    激活禮品卡至賬戶
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    選擇變現方式
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    實金 / XAUt / USDT
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                    預約領取
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    到店或鏈上到賬
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Redemption Options */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              兌換方式
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    領取實物黃金
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <strong>100g 起預約</strong> → 到店領取
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    首批支持香港，後續擴展至新加坡、迪拜 *
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    提取到個人錢包
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    提取 XAUt 或兌換為 USDT 至錢包地址
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              合作伙伴
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-100">
              <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-10">
                攜手優質合作伙伴，提供安全可靠的黃金兌換服務
              </p>

              {/* Partner Logos */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 min-w-[160px] sm:min-w-[200px]">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                      POINT GOLD
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 min-w-[160px] sm:min-w-[200px]">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/tether-gold-logo.png"
                      alt="Tether Gold"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Value Propositions - 调整到后面 */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              為什麼選擇數字黃金禮品卡
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Anonymity */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  免實名持有
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  無需 KYC，卡密即所有權
                </p>
              </div>

              {/* Crypto Purchase */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  加密貨幣購買 *
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  支持多種數字貨幣
                </p>
              </div>

              {/* Flexible Redemption */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  靈活兌換
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  實金、XAUt 或 USDT 任選
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-amber-100">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  立即開始
                </h3>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    href="/activate"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>綁定禮品卡</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-gray-700 font-medium rounded-full border-2 border-gray-300 hover:border-yellow-400 hover:text-yellow-600 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>查看我的黃金卡</span>
                  </Link>
                </div>

                {/* Footnote */}
                <p className="text-xs sm:text-sm text-gray-500 mt-8 sm:mt-10">
                  * 標記功能即將開放，敬請期待
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

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
