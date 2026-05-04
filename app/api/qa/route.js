import { getSupabase } from '@/lib/supabase';

const QA_PAIRS = [
    {
        keywords: ['试用期', '辞退', '赔偿', '怎么办'],
        question: '试用期被辞退有赔偿吗？',
        answer: '试用期被辞退是否有赔偿，需要分情况讨论：\n\n1️⃣ 如果用人单位证明劳动者不符合录用条件而辞退，无需支付赔偿金；\n\n2️⃣ 如果用人单位无法证明不符合条件，或违法解除劳动合同，应当支付赔偿金（经济补偿金的2倍）；\n\n3️⃣ 试用期内，劳动者提前3日通知即可解除劳动合同。\n\n💡 建议：保留好劳动合同、录用条件约定等证据。',
        relatedCaseTitle: '试用期解除劳动合同纠纷'
    },
    {
        keywords: ['七天', '无理由', '退货', '网购'],
        question: '网购商品可以七天无理由退货吗？',
        answer: '是的！根据《消费者权益保护法》第二十五条：\n\n✅ 网络、电视、电话、邮购等方式销售的商品，消费者有权在收到商品之日起七日内退货；\n\n✅ 无需说明理由（定作、生鲜、数字化商品、报纸期刊除外）；\n\n⚠️ 退货商品应当完好，退回运费一般由消费者承担。',
        relatedCaseTitle: '网络购物纠纷'
    },
    {
        keywords: ['加班', '费', '规定', '多少'],
        question: '加班费是怎么计算的？',
        answer: '加班费计算标准（劳动合同法第四十四条）：\n\n⏰ 工作日加班：不低于工资的150%\n\n⏰ 休息日加班又不能安排补休：不低于200%\n\n⏰ 法定节假日加班：不低于300%\n\n💡 月计薪天数 = 21.75天\n日工资 = 月工资 ÷ 21.75\n小时工资 = 日工资 ÷ 8',
        relatedCaseTitle: '加班费争议案例'
    },
    {
        keywords: ['年假', '多少天', '规定'],
        question: '年假有多少天？',
        answer: '根据《职工带薪年休假条例》：\n\n📅 工作满1年不满10年：5天\n📅 工作满10年不满20年：10天\n📅 工作满20年：15天\n\n⚠️ 注意：\n• 国家法定休假日、休息日不计入年休假\n• 单位因工作需要不能安排休假的，需支付300%工资报酬',
        relatedCaseTitle: '年休假争议'
    },
    {
        keywords: ['高温', '津贴', '补贴', '多少钱'],
        question: '高温津贴有多少钱？',
        answer: '根据《防暑降温措施管理办法》：\n\n🌡️ 用人单位应当向劳动者发放高温津贴\n\n💰 室外高温作业：每月不低于180元\n💰 室内高温作业：每月不低于145元\n\n📆 发放时间由各省规定，一般为6-9月\n\n⚠️ 高温津贴不计入最低工资标准。',
        relatedCaseTitle: '高温津贴争议'
    },
    {
        keywords: ['劳动合同', '不签', '违法'],
        question: '公司不签劳动合同违法吗？',
        answer: '违法！根据《劳动合同法》：\n\n🚫 用人单位自用工之日起超过一个月不满一年未与劳动者订立书面劳动合同：应当向劳动者每月支付2倍工资\n\n🚫 满一年不订立：视为已订立无固定期限劳动合同\n\n💡 保存好工资条、工作证、考勤记录等证据。',
        relatedCaseTitle: '未签劳动合同双倍工资'
    },
    {
        keywords: ['押金', '不退', '怎么办'],
        question: '租房押金不退怎么办？',
        answer: '租房押金不退的维权步骤：\n\n1️⃣ 协商：首先与房东协商，明确扣押理由\n\n2️⃣ 投诉：向当地房管部门或拨打12345投诉\n\n3️⃣ 起诉：准备好租赁合同、押金收据、沟通记录等证据，向法院起诉\n\n⚠️ 注意保留所有证据，包括押金收据、转账记录、房屋交接单等。',
        relatedCaseTitle: '租房押金纠纷'
    },
    {
        keywords: ['噪声', '扰民', '投诉', '时间'],
        question: '装修噪声扰民有时间限制吗？',
        answer: '有！根据《环境噪声污染防治法》：\n\n🔨 法定装修时间：工作日上午8:00-12:00，下午14:00-18:00\n\n🚫 法定休息日、节假日全天及工作日12:00-14:00、18:00-次日8:00，禁止进行产生噪声的装修作业\n\n💡 遇到噪声扰民可向物业投诉或拨打12369环保热线。',
        relatedCaseTitle: '噪声扰民纠纷'
    },
    {
        keywords: ['定金', '订金', '区别', '能退'],
        question: '定金和订金有什么区别？能退吗？',
        answer: '⚠️ 一字之差，区别很大！\n\n💰 定金（担保性质）\n• 付定金方违约：无权要求返还\n• 收定金方违约：双倍返还\n• 具有担保效力\n\n💰 订金（预付款性质）\n• 不是法律概念\n• 无论谁违约，一般都可要求退还\n• 只是预付款项\n\n💡 签订合同前务必看清是"定金"还是"订金"！',
        relatedCaseTitle: '定金与订金纠纷'
    },
    {
        keywords: ['欺诈', '消费', '赔偿', '多少'],
        question: '消费欺诈可以要求多少赔偿？',
        answer: '根据《消费者权益保护法》第五十五条：\n\n💰 欺诈消费赔偿：消费金额的3倍\n• 增加赔偿金额不足500元的：按500元计算\n\n💰 惩罚性赔偿：\n• 明知商品或服务存在缺陷仍销售：最高可达损失金额的2倍以下\n\n🛡️ 保留好发票、合同、聊天记录等证据。',
        relatedCaseTitle: '消费欺诈赔偿案例'
    },
    {
        keywords: ['名誉', '侵权', '网络', '处罚'],
        question: '网上骂人侵犯名誉权吗？',
        answer: '是的！根据《民法典》第一千零一十九条：\n\n🚫 以侮辱、诽谤方式损害他人名誉\n🚫 未经允许使用他人肖像\n🚫 捏造事实丑化他人人格\n\n⚖️ 处罚：\n• 停止侵害、消除影响、恢复名誉、赔礼道歉\n• 赔偿精神损害抚慰金\n• 情节严重的可能构成侮辱罪、诽谤罪',
        relatedCaseTitle: '网络名誉侵权案例'
    },
    {
        keywords: ['个人信息', '泄露', '怎么办'],
        question: '个人信息被泄露怎么办？',
        answer: '个人信息泄露后的应对措施：\n\n1️⃣ 收集证据：保存泄露源、损失证明等\n\n2️⃣ 向网站投诉：要求删除泄露信息\n\n3️⃣ 报警：泄露个人信息情节严重可报警\n\n4️⃣ 起诉：要求停止侵害、赔偿损失\n\n🛡️ 可依据《个人信息保护法》维权\n\n📞 可向网信办12377举报',
        relatedCaseTitle: '个人信息泄露案例'
    },
    {
        keywords: ['物业费', '不交', '起诉'],
        question: '物业费可以拒交吗？',
        answer: '一般情况下不能拒交，但有例外：\n\n✅ 可以拒交的情形：\n• 物业服务企业未履行合同约定的服务义务\n• 物业费收费标准未经物价部门审批\n• 房屋存在质量问题（在保修期内）\n\n❌ 不能拒交的情形：\n• 以"未入住"为由\n• 以"不需要服务"为由\n\n💡 如物业服务存在瑕疵，建议保留证据并协商。',
        relatedCaseTitle: '物业费纠纷'
    },
    {
        keywords: ['婚假', '多少天', '规定'],
        question: '婚假有多少天？',
        answer: '婚假天数规定：\n\n💒 一般婚假：1-3天（各省规定不同）\n\n📅 晚婚假（多数地区已取消）：\n• 部分地区仍有：7-10天不等\n\n💡 婚假期间工资照发\n\n📋 所需材料：\n• 结婚证\n• 请假申请\n• 部分地区需提供晚婚证明',
        relatedCaseTitle: '婚假争议'
    },
    {
        keywords: ['病假', '工资', '怎么算'],
        question: '病假期间工资怎么发？',
        answer: '病假工资计算（按各地规定）：\n\n📊 一般标准：\n• 本人工资的60%-100%\n\n📋 病假工资最低标准：\n• 不得低于当地最低工资标准的80%\n\n💊 医疗期规定：\n• 工作年限 < 5年：3个月\n• 工作年限 5-10年：6个月\n• 工作年限 > 10年：按年限递增，最高24个月\n\n⚠️ 需提供医院证明',
        relatedCaseTitle: '病假工资争议'
    }
];

function matchQuestion(input) {
    const normalizedInput = input.toLowerCase().replace(/\s+/g, '');
    let bestMatch = null;
    let bestScore = 0;

    for (const qa of QA_PAIRS) {
        let score = 0;
        for (const keyword of qa.keywords) {
            const normalizedKeyword = keyword.toLowerCase();
            if (normalizedInput.includes(normalizedKeyword)) {
                score += normalizedKeyword.length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = qa;
        }
    }

    if (bestScore >= 3) {
        return bestMatch;
    }
    return null;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const question = searchParams.get('q') || searchParams.get('question') || '';

        if (!question.trim()) {
            return Response.json({
                error: '请输入问题',
                suggestions: QA_PAIRS.slice(0, 6).map(qa => qa.question)
            });
        }

        const matchedQA = matchQuestion(question);

        if (matchedQA) {
            return Response.json({
                matched: true,
                question: matchedQA.question,
                answer: matchedQA.answer,
                relatedCase: matchedQA.relatedCaseTitle
            });
        }

        const supabase = getSupabase();
        const keyword = question.replace(/[^\w\u4e00-\u9fa5]/g, ' ').trim();
        const { data: cases, error } = await supabase
            .from('cases')
            .select('id, title, summary, field, difficulty')
            .or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
            .limit(3);

        if (error) {
            console.error('Database search error:', error);
        }

        return Response.json({
            matched: false,
            question: question,
            answer: `抱歉，暂无精确匹配的答案。但为您找到以下相关案例：`,
            relatedCases: cases || [],
            suggestions: QA_PAIRS.slice(0, 6).map(qa => qa.question)
        });

    } catch (err) {
        console.error('QA API error:', err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}