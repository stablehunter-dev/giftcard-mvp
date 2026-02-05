'use client';

import HandbookLayout from '@/app/components/HandbookLayout';

const sections = [
    { id: 'welcome', title: '欢迎' },
    { id: 'activation', title: '激活流程' },
    { id: 'card-info', title: '卡片包含什么' },
    { id: 'how-to-use', title: '如何使用' },
    { id: 'where-to-view', title: '在哪里查看' },
    { id: 'security', title: '安全提示' },
    { id: 'faq', title: '常见问题' },
];

export default function CardholderHandbook() {
    return (
        <HandbookLayout title="持卡用户手册" sections={sections}>
            {/* Welcome Section */}
            <section id="welcome" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">恭喜获得 GoldFin 黄金礼品卡</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    恭喜您获得一份特别的礼物！这张礼品卡内含 <strong>10g 黄金</strong>（约价值 1607 USDT，按当前金价 5000 USDT/盎司计算）。平台为每张卡托管等值的 XAUt（Tether Gold，链上黄金代币），确保您的资产安全可靠。激活后，您可以选择提现为数字货币或兑换成实物黄金。
                </p>
            </section>

            {/* Activation Process Section */}
            <section id="activation" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">激活流程</h2>

                {/* Flow Diagram */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                    <div className="flex items-center justify-between text-center">
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">1</div>
                            <p className="text-sm font-medium text-gray-700">扫描二维码</p>
                        </div>
                        <div className="text-purple-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">2</div>
                            <p className="text-sm font-medium text-gray-700">注册账户</p>
                        </div>
                        <div className="text-purple-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">3</div>
                            <p className="text-sm font-medium text-gray-700">绑卡充值</p>
                        </div>
                        <div className="text-purple-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">✓</div>
                            <p className="text-sm font-medium text-gray-700">开始使用</p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">步骤1: 扫码激活</h3>
                        <p className="text-gray-600">使用手机扫描卡片上的二维码，或访问 <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">giftcard.goldfin.com</span> 手动输入您的卡号。整个过程十分简单，不到1分钟。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">步骤2: 注册账户</h3>
                        <p className="text-gray-600">使用您的邮箱注册或登录账户。<strong>无需身份验证（Non-KYC）</strong>，保护您的隐私，注册过程简单快捷。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">步骤3: 绑卡充值</h3>
                        <p className="text-gray-600">卡片会自动绑定到您的账户，<strong>10g黄金资产</strong>立即充值到您的数字黄金账户中。同时实体卡片将失效，请妥善保管您的账户登录信息。</p>
                    </div>
                </div>
            </section>

            {/* Card Info Section */}
            <section id="card-info" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">卡片包含什么</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
                        <div className="text-3xl mb-2">💎</div>
                        <h3 className="font-semibold text-gray-900 mb-1">10g 数字黄金</h3>
                        <p className="text-sm text-gray-600 mb-1">由平台托管的 XAUt（Tether Gold）</p>
                        <p className="text-xs text-gray-500">当前价值约 1607 USDT（金价5000 USDT/oz）</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="text-3xl mb-2">🎁</div>
                        <h3 className="font-semibold text-gray-900 mb-1">实体礼品卡</h3>
                        <p className="text-sm text-gray-600">激活前可转赠他人，激活后自动失效</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                        <div className="text-3xl mb-2">🔓</div>
                        <h3 className="font-semibold text-gray-900 mb-1">隐私保护 Non-KYC</h3>
                        <p className="text-sm text-gray-600">无需身份验证，保护您的个人信息</p>
                    </div>
                </div>

                {/* Status Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">说明</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900 font-medium">未激活</td>
                                <td className="px-6 py-4 text-gray-600">可转赠他人，或留给自己使用；10g黄金安全托管在平台</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900 font-medium">已激活</td>
                                <td className="px-6 py-4 text-gray-600">绑定到您的账户，实体卡失效；您可在个人中心查看资产并进行提现/兑换</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* How to Use Section */}
            <section id="how-to-use" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">如何使用（Q1上线）</h2>

                <div className="space-y-6">
                    {/* Option A: Digital Currency */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">选项A: 提现数字货币</h3>
                        <p className="text-gray-700 font-medium mb-4">提现 XAUt 或 USDT 到您的加密钱包</p>

                        <div className="bg-white rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">操作步骤:</h4>
                            <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-2">
                                <li>登录个人中心</li>
                                <li>点击「我要兑换」</li>
                                <li>选择「XAUt / USDT」</li>
                                <li>输入钱包地址和提现数量</li>
                                <li>确认提现（需支付少量网络手续费）</li>
                            </ol>
                        </div>

                        <p className="text-sm text-gray-600">提现后，您可以在任何支持的加密货币交易所自由交易 XAUt 或 USDT，或选择长期持有数字黄金资产作为保值工具。</p>
                    </div>

                    {/* Option B: Physical Gold */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">选项B: 兑换实物黄金</h3>
                        <p className="text-gray-700 font-medium mb-4">预约前往指定门店提取实物金条</p>

                        <div className="bg-white rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">操作步骤:</h4>
                            <ol className="list-decimal list-inside text-gray-600 space-y-1 ml-2">
                                <li>登录 <span className="font-mono text-sm bg-gray-100 px-1 rounded">giftcard.goldfin.com/profile</span> 个人中心</li>
                                <li>点击「我要兑换」</li>
                                <li>选择「实物黄金」</li>
                                <li>填写兑换数量（<strong>最低100g起</strong>，您可以积累多张卡后一起兑换）</li>
                                <li>选择提货地区（初期支持香港）</li>
                                <li>选择预约日期并联系客服确认</li>
                            </ol>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-white rounded-lg p-3">
                                <span className="font-semibold text-gray-900">改期:</span>
                                <span className="text-gray-600"> 支付后免费改期一次，灵活调整行程</span>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <span className="font-semibold text-gray-900">取消:</span>
                                <span className="text-gray-600"> 服务费不退，但黄金余额不扣，会保留在您的账户中</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Where to View Section */}
            <section id="where-to-view" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">在哪里查看</h2>

                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">登录方式</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>访问 <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">giftcard.goldfin.com/profile</span></li>
                        <li>或扫描礼品卡上的二维码直接跳转</li>
                    </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">可查看内容</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>实时黄金价格走势（XAUT）</li>
                        <li>您的黄金资产总额（克数）</li>
                        <li>资产当前价值（USDT）</li>
                        <li>历史绑定记录</li>
                    </ul>
                </div>
            </section>

            {/* Security Section */}
            <section id="security" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">安全提示</h2>

                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">请注意以下安全事项:</h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span><strong>账户安全：</strong>礼品卡激活后，实体卡立即失效，所有资产都在您的账户中。请妥善保管登录密码，切勿告诉任何人（包括自称客服的人员）</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span><strong>实物兑换：</strong>兑换实物黄金前请确认预约信息，支付后仅支持免费改期一次。如需取消，服务费不退但黄金余额会保留</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span><strong>官方渠道：</strong>如遇到任何问题，请通过官方 WhatsApp 客服联系我们。官方不会主动索要您的密码或私钥</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mb-8 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">常见问题</h2>

                <div className="space-y-4">
                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 激活后能转给别人吗？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p>不能。已激活的卡片已经永久绑定到您的账户，黄金资产成为您个人财产的一部分。如果您希望转赠他人，请在激活前转赠实体卡片。</p>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 提现/兑换什么时候上线？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p className="mb-3"><strong>2026年Q1上线。</strong>上线后，您可以灵活选择：</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>
                                    <strong>提现数字货币（XAUt/USDT）：</strong>
                                    <ul className="list-circle list-inside ml-4 mt-1 text-sm">
                                        <li>不限制地区（不服务美国公民）</li>
                                        <li>提现到您的加密钱包，自由交易或持有</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>兑换实物黄金：</strong>
                                    <ul className="list-circle list-inside ml-4 mt-1 text-sm">
                                        <li>初期支持香港地区</li>
                                        <li>最低100g起兑，需提前预约</li>
                                        <li>您可以积累多张卡片后一次性兑换</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 卡片丢失怎么办？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <div className="mb-3">
                                <p className="font-semibold text-gray-900 mb-1">✅ 已激洺的卡片：</p>
                                <p>您的资产非常安全，都保存在您的账户中，实体卡片已经失效。只要您保管好账户密码，资产就不会丢失。</p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                <p className="font-semibold text-gray-900 mb-1">⚠️ 未激活的卡片：</p>
                                <p>平台<strong>无法冻结或找回</strong>。未激活的卡片是完全匿名的，<strong>谁持有卡片即视为所有者</strong>。如果您丢失了未激活的实体卡，他人捂到后可以直接激活使用。请像保管现金一样妥善保管未激活的卡片。</p>
                            </div>
                        </div>
                    </details>
                </div>
            </section>
        </HandbookLayout>
    );
}
