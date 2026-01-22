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
              歡迎使用 GoldFin
              <br />
              禮品卡兌換服務
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light">
              輕鬆綁定，安心兌換實體黃金
            </p>
          </div>

          {/* How it Works */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              兌換流程
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    綁定禮品卡
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    使用您的兌換碼登入並綁定禮品卡至您的帳戶。綁定後，實體卡片即失效，所有權益將記入您的帳戶。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    選擇門店並預約
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    選擇您方便的指定門店，填寫預期兌換的黃金規格與數量。最終兌換以門店實際庫存為準。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    等待確認通知
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    我們將盡快確認您的預約，並透過電郵通知您最早到店時間與兌換二維碼。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-gray-50">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    到店兌換實體黃金
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    憑二維碼到指定門店兌換。門店將根據實際庫存確認最終交付的規格與數量。
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
                我們與優質合作伙伴攜手，為您提供安全可靠的實物黃金兌換服務
              </p>

              {/* Partner Logos - Horizontal Display */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
                {/* Point Gold Logo */}
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 min-w-[160px] sm:min-w-[200px]">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                      POINT GOLD
                    </div>
                  </div>
                </div>

                {/* Tether Gold Logo */}
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

              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-center text-gray-500">
                  詳細兌換點資訊請登入後於預約頁面查看
                </p>
              </div>
            </div>
          </section>

          {/* Supported Stores - Login Required */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              兌換地點
            </h2>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-amber-100">
              <div className="text-center max-w-2xl mx-auto">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-sm mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  綁定後查看詳情
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  兌換點的詳細地址、營業時間及預約資訊<br className="hidden sm:block" />
                  將在您綁定禮品卡並登入後於預約頁面顯示。
                </p>

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

                {/* Additional Info */}
                <p className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
                  已綁定禮品卡？登入後即可查看兌換點資訊並進行預約
                </p>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section className="mb-12 sm:mb-16">
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
                  <span>禮品卡綁定後即失效，權益將記入您的 GoldFin 帳戶，不可轉讓</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>只能在上述指定門店進行預約兌換，其他地點不適用</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>預約時填寫的規格與數量為您的意向，最終兌換以門店實際庫存為準</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>需等待平台確認後方可到店，請留意電郵通知</span>
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

