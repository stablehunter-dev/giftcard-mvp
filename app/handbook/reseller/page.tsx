'use client';

import HandbookLayout from '@/app/components/HandbookLayout';

const sections = [
    { id: 'welcome', title: '欢迎' },
    { id: 'sales-process', title: '销售流程' },
    { id: 'commission', title: '返佣机制' },
    { id: 'card-features', title: '卡片功能' },
    { id: 'customer-intro', title: '如何向客户介绍' },
    { id: 'faq', title: '常见问题' },
];

export default function ResellerHandbook() {
    return (
        <HandbookLayout title="经销商手册" sections={sections}>
            {/* Welcome Section */}
            <section id="welcome" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">欢迎成为 GoldFin 销售伙伴</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    零风险代销模式，无需库存压力。销售10g黄金礼品卡即可获得佣金，收益自由定价。
                </p>
            </section>

            {/* Sales Process Section */}
            <section id="sales-process" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">销售流程</h2>

                {/* Flow Diagram */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                    <div className="flex items-center justify-between text-center">
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">1</div>
                            <p className="text-sm font-medium text-gray-700">获取礼品卡</p>
                        </div>
                        <div className="text-blue-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">2</div>
                            <p className="text-sm font-medium text-gray-700">销售给客户</p>
                        </div>
                        <div className="text-blue-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">3</div>
                            <p className="text-sm font-medium text-gray-700">完成销售</p>
                        </div>
                        <div className="text-blue-400 text-2xl px-2">→</div>
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">✓</div>
                            <p className="text-sm font-medium text-gray-700">获得佣金</p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">步骤1: 获取礼品卡</h3>
                        <p className="text-gray-600">联系平台获取10g黄金礼品卡。未激活前可自由销售，无时间限制。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">步骤2: 销售给客户</h3>
                        <p className="text-gray-600">自主定价销售。建议面向投资黄金、资产配置或高端礼品需求的客户。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">步骤3: 完成销售并获得佣金</h3>
                        <p className="text-gray-600">客户激活后，佣金立即结算。您获得销售价超过进货价的全部差价。</p>
                    </div>
                </div>
            </section>

            {/* Commission Section */}
            <section id="commission" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">返佣机制</h2>

                <p className="text-gray-700 mb-6">
                    您可以自由定价（102%-110%）。以下是常见定价策略参考，市场默认价格为105%：
                </p>

                {/* Pricing Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-300 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">策略</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">定价</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">您的收益</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">溢价占比</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">适用场景</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900">保守</td>
                                <td className="px-6 py-4 text-gray-900">102%</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">0.5%</td>
                                <td className="px-6 py-4 text-gray-900">25%</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">低于市场价，易成交</td>
                            </tr>
                            <tr className="hover:bg-gray-50 bg-green-50">
                                <td className="px-6 py-4 text-gray-900 font-semibold">平衡 [推荐]</td>
                                <td className="px-6 py-4 text-gray-900">104%</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">2.5%</td>
                                <td className="px-6 py-4 text-gray-900">63%</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">平衡收益与竞争力</td>
                            </tr>
                            <tr className="hover:bg-gray-50 bg-amber-50">
                                <td className="px-6 py-4 text-gray-900 font-semibold">市场价</td>
                                <td className="px-6 py-4 text-gray-900">105%</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">3.5%</td>
                                <td className="px-6 py-4 text-gray-900">70%</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">市场标准价</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900">激进</td>
                                <td className="px-6 py-4 text-gray-900">107%</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">5.5%</td>
                                <td className="px-6 py-4 text-gray-900">79%</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">高利润，适合高端客户</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Concise explanation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <p className="text-sm text-gray-700">
                        <strong>说明：</strong>进货价 = 黄金成本 × 101.5%（平台收1.5%服务费）｜可在 102%-110% 自由定价｜收益 = 销售价 - 进货价
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">佣金提现</h3>
                    <p className="text-gray-600 mb-2">客户激活后，佣金自动结算到账户。测试期间提现流程：</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>联系客服提供账户信息和提现金额</li>
                        <li>确认 USDT 钱包地址</li>
                        <li>1-2 个工作日内到账</li>
                    </ul>
                </div>

                {/* KYT Warning */}
                <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-r-xl mt-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        资金安全检查风险
                    </h3>
                    <p className="text-red-800 font-semibold mb-3">销售前请告知客户：</p>
                    <div className="bg-white rounded-lg p-4 mb-3">
                        <p className="text-red-900 mb-2"><strong>风险情况：</strong></p>
                        <p className="text-gray-800 mb-3">平台会对支付资金进行 KYT 安全检查。若资金来自高风险地址或混币器，卡片将被冻结。</p>

                        <p className="text-red-900 mb-2"><strong>后果：</strong></p>
                        <ul className="list-disc list-inside text-gray-800 space-y-1 ml-2 mb-3">
                            <li>卡片冻结，无法使用</li>
                            <li>需联系客服人工审核</li>
                            <li>审核通过前资金暂时冻结</li>
                            <li>审核未通过需退款，处理周期较长</li>
                        </ul>

                        <p className="text-red-900 mb-2"><strong>您的责任：</strong></p>
                        <p className="text-gray-800">收款前提醒客户确保资金来源合法，避免使用来路不明的加密货币。</p>
                    </div>
                    <p className="text-sm text-red-700">
                        建议话术："请确保支付的USDT来源合法，避免从未知地址或混币服务转账，否则可能触发安全检查导致冻结。"
                    </p>
                </div>
            </section>

            {/* Card Features Section */}
            <section id="card-features" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">卡片功能</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">可以做什么</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900 font-medium">未激活</td>
                                <td className="px-6 py-4 text-gray-600">您可自由转赠、销售或留作自用，卡片内的10g黄金由平台托管保障</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900 font-medium">已激活</td>
                                <td className="px-6 py-4 text-gray-600">卡片绑定到客户账户，客户可提现数字货币或兑换实物黄金（功能将于2026年Q1上线）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Customer Introduction Section */}
            <section id="customer-intro" className="mb-16 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">如何向客户介绍</h2>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">激活方式</h3>
                        <p className="text-gray-600">告诉客户：只需扫描卡片上的二维码，或访问网站输入卡号，用邮箱注册即可激活。整个过程不到1分钟，无需身份验证（Non-KYC）。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">安全保障</h3>
                        <p className="text-gray-600">告诉客户：每张10g卡片背后，平台都托管了等值的 XAUt（Tether Gold，链上黄金代币），确保资产真实可靠。客户可以随时在个人中心查看实时金价和资产价值。</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">客户可以用卡片做什么（2026年Q1上线）</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                            <li><strong>提现数字货币：</strong>将黄金兑换为 XAUt 或 USDT，提现到自己的加密钱包</li>
                            <li><strong>兑换实物黄金：</strong>100g起兑换，初期支持香港地区门店提取</li>
                            <li><strong>实时查看资产：</strong>登录个人中心可查看当前金价走势和资产实时价值</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">客户服务</h3>
                        <p className="text-gray-600">告诉客户：激活后如有任何问题（提现、兑换、账户查询等），请直接联系平台 WhatsApp 客服，由平台专业团队提供支持。您无需承担售后责任。</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="mb-8 scroll-mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">常见问题</h2>

                <div className="space-y-4">
                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 卡片卖不出去怎么办？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p>完全不用担心！卡片未激活前可随时退还给平台，平台会全额退还您的保证金。您没有任何库存积压风险。<span className="text-sm text-gray-500">（注：从平台获取实体卡需缴纳保证金，具体金额请与您的对接销售确认）</span></p>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 如何设定返佣比例？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p>您可以完全自主决定给客户的返佣比例，系统会自动计算对应的销售价格。给客户的返佣比例越低，您的利润越高；反之返佣比例高可以吸引更多客户。建议参考上方返佣表格，根据您的目标客户群体和竞争情况灵活调整。</p>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 客户激活后找我怎么办？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p>很简单！您只需引导客户联系平台 WhatsApp 客服即可。激活后的所有售后服务（提现、兑换、技术问题等）都由平台负责，您无需承担任何售后工作。</p>
                        </div>
                    </details>

                    <details className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
                            Q: 如何设定返佣比例？
                        </summary>
                        <div className="px-6 pb-4 text-gray-600">
                            <p>返佣比例决定销售价格，参考上方返佣表格。</p>
                        </div>
                    </details>
                </div>
            </section>
        </HandbookLayout>
    );
}
