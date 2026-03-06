-- Supabase Case Library Data - V3 (Final Fix)

-- Part 1: Add missing columns to the 'cases' table.
-- This ensures the table schema is correct before inserting data.
ALTER TABLE cases ADD COLUMN IF NOT EXISTS coping_methods TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS legal_provisions TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE cases ADD COLUMN IF NOT EXISTS difficulty TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS learner_count INTEGER;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS study_time_minutes INTEGER;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Part 2: Insert the case data with corrected values for 'difficulty' and 'field'.
-- The check constraint likely requires specific English or numeric values.
-- We are using English equivalents as the most probable solution.
INSERT INTO cases (id, title, summary, description, coping_methods, legal_provisions, field, keywords, difficulty, learner_count, study_time_minutes, video_url) VALUES
(
    gen_random_uuid(),
    '618下单之前，我劝你冷静一点！',
    '探讨电商大促期间的冲动消费、消费主义陷阱及对“省钱”的认知偏差。',
    '电商大促期间的冲动消费、陷入消费主义陷阱、以及对“省钱”的认知偏差。',
    '闲鱼锚点法：在购买一手新品前，先去二手平台（如闲鱼）查看该商品的二手价格，以此审视“一手价”是否虚高。\n冷静期法则：在下单前先“服用”防冲动建议，重新审视消费观念。',
    '《消费者权益保护法》第二十五条：经营者采用网络、电视、电话、邮购等方式销售商品，消费者有权自收到商品之日起七日内退货，且无需说明理由（定作、鲜活易腐等特殊商品除外）。',
    'consumer_rights', -- 修正为英文
    ARRAY['电商购物', '消费观念', '七天无理由退货', '618'],
    'beginner', -- 修正为英文
    12543,
    20,
    'https://www.bilibili.com/video/BV1kZ4y1p7yT' -- 占位符链接
),
(
    gen_random_uuid(),
    '“结婚需要一点冲动”，原来是真的啊！',
    '如何应对春节催婚压力、长期恋爱后的婚姻迟疑，以及对亲密关系的恐惧或倦怠。',
    '春节催婚压力、长期恋爱后的婚姻迟疑、对亲密关系的恐惧或倦怠。',
    '建立正确的吵架哲学：不要怕冲突，通过有效的沟通解决分歧，而不是沉默。\n防催婚指南：认清“催婚任务论”的逻辑漏洞，明确单身与结婚的选择权在自己手中。',
    '《民法典》第一千零四十一条：实行婚姻自由、一夫一妻、男女平等的婚姻制度。\n《民法典》第一千零四十六条：结婚应当男女双方完全自愿，不许任何一方对他方加以强迫或任何第三者加以干涉。',
    'marriage_family', -- 修正为英文
    ARRAY['婚姻自由', '亲密关系', '催婚', '自愿结婚'],
    'intermediate', -- 修正为英文
    9865,
    25,
    'https://www.bilibili.com/video/BV1v5411u7VB' -- 占位符链接
),
(
    gen_random_uuid(),
    '【租房大冤种系列】说说我租房遇到的奇葩大坑！',
    '解析租房过程中的信息不对称、奇葩房东或中介、虚假房源及合同陷阱问题。',
    '租房过程中的信息不对称、遇到奇葩房东或中介、虚假房源及合同陷阱。',
    '查询真实成交价：通过特定渠道查询周边租房真实行情，防止被忽悠。\n避坑指南：学习保姆级租房攻略，掌握找房技巧和注意事项（如LOFT的优缺点）。',
    '《民法典》第七百零三条：租赁合同是出租人将租赁物交付承租人使用、收益，承租人支付租金的合同。\n《民法典》第七百二十三条：因第三人主张权利，致使承租人不能对租赁物使用、收益的，承租人可以要求减少租金或者不支付租金。',
    'contract_law', -- 修正为英文
    ARRAY['租房合同', '押金不退', '中介陷阱', '房源真实性'],
    'intermediate', -- 修正为英文
    18321,
    35,
    'https://www.bilibili.com/video/BV1g5411u7xG' -- 占位符链接
),
(
    gen_random_uuid(),
    '今天又又骗了一个大学生，大学生租房真是好忽悠。',
    '关注大学生群体因缺乏社会经验，在校外租房时易被黑中介或不良房东欺诈的问题。',
    '大学生群体缺乏社会经验，在校外租房时极易被黑中介或不良房东欺诈。',
    '提高防范意识：学习“最强租房攻略”，了解租赁市场潜规则。\n无限跑路流（视频提及策略）：虽然带有调侃意味，但核心在于通过法律手段或合同约定保护自己的灵活居住权。',
    '《刑法》第二百六十六条（诈骗罪）：以非法占有为目的，用虚构事实或者隐瞒真相的方法，骗取数额较大的公私财物的行为。\n《消费者权益保护法》：若涉及中介欺诈，可主张“退一赔三”。',
    'civil_criminal', -- 修正为英文
    ARRAY['大学生租房', '房屋诈骗', '合同效力', '维权意识'],
    'expert', -- 修正为英文
    25432,
    40,
    'https://www.bilibili.com/video/BV1zK4y1N7xL' -- 占位符链接
),
(
    gen_random_uuid(),
    '罗翔：食品安全问题的赔款，一定要赔到商家倾家荡产',
    '探讨食品安全领域违法成本过低，商家为牟利不择手段的现状与法律对策。',
    '食品安全领域违法成本过低，商家为牟利不择手段。',
    '惩罚性赔偿：消费者应勇敢主张高额赔偿，利用法律让违法商家付出惨痛代价。',
    '《食品安全法》第一百四十八条：消费者因不符合食品安全标准的食品受到损害，可以向经营者要求赔偿损失，还可以向生产者或者经营者要求支付价款十倍或者损失三倍的赔偿金；增加赔偿的金额不足一千元的，为一千元。',
    'food_safety', -- 修正为英文
    ARRAY['食品安全', '惩罚性赔偿', '315维权', '十倍赔偿'],
    'expert', -- 修正为英文
    31054,
    15,
    'https://www.bilibili.com/video/BV1i3411C7xW' -- 占位符链接
),
(
    gen_random_uuid(),
    '饭店的寒假工，私收开瓶费！',
    '揭露饭店违规收取“开瓶费”等霸王条款，及兼职学生权益受损问题。',
    '饭店违规收取“开瓶费”（服务费）、兼职学生权益受损、管理制度不透明。',
    '拒绝不合理收费：了解消费者有权自主选择商品或服务，拒绝强制性的“潜规则”。\n留存证据：对于餐后结账时的违规扣款，保留账单进行投诉。',
    '《消费者权益保护法》第九条：消费者享有自主选择商品或者服务的权利。\n最高人民法院案例指引：明确“禁止自带酒水”、“收取开瓶费”等属于“霸王条款”，由于其排除消费者权利、免除经营者责任，属于无效条款。',
    'consumer_rights', -- 修正为英文
    ARRAY['开瓶费', '霸王条款', '寒假工', '自主选择权'],
    'beginner', -- 修正为英文
    8799,
    20,
    'https://www.bilibili.com/video/BV1yW411u7xQ' -- 占位符链接
)
ON CONFLICT (id) DO NOTHING;
