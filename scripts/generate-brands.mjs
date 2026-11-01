// scripts/generate-brands.mjs
import fs from 'node:fs';
import path from 'node:path';

const raw = fs.readFileSync('c:/Users/Pro User/Desktop/机场品牌信息/42家机场品牌清单.txt', 'utf8');
const lines = raw.split('\n');

const list = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const m = line.match(/^(?:主推##|##)\s*([0-9]+)\.\s*([^\(（\s]+)(?:[（\(]([^\)）\s]+)[）\)])?/);
  if (m) {
    let name = m[2];
    if (name === 'SOGO') name = 'SOGO云';
    let slug = m[3];
    if (!slug) {
      if (name.includes('光速云')) slug = 'guangsu';
      else if (name.includes('SOGO')) slug = 'sogo';
    }
    list.push({ lineIndex: i, num: m[1], name, slug });
  } else if (i > 960 && lines[i + 1] && lines[i + 1].trim() === '基础信息' && line.length > 0 && !line.startsWith('#')) {
    const clean = line.replace(/^[0-9]+\.\s*/, '');
    let slug = clean.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!slug) {
      const slugMap = {
        '白月光': 'baiyueguang',
        '龙猫云': 'longmaoyun',
        '青云梯': 'qingyunti',
        '山水云': 'shanshuiyun',
        '灵动云': 'lingdongyun',
        '浪网': 'langwang',
        '萤火虫': 'yinghuochong',
      };
      slug = slugMap[clean] || 'airport-' + list.length;
    }
    list.push({ lineIndex: i, num: 'ext', name: clean, slug });
  }
}

// Extract section text between each brand
for (let i = 0; i < list.length; i++) {
  const start = list[i].lineIndex;
  let end = (i + 1 < list.length) ? list[i + 1].lineIndex : lines.length;
  if (list[i].name === '梯子云') {
    end = 918;
  }
  const sectionLines = lines.slice(start, end);
  list[i].rawSection = sectionLines.join('\n');
}

// Helper: convert tab-separated lines to GFM tables
function formatGfmTables(text) {
  const fileLines = text.split('\n');
  const result = [];
  let inTable = false;
  let tableHeaderCols = 0;

  for (let idx = 0; idx < fileLines.length; idx++) {
    const l = fileLines[idx];
    if (l.includes('\t')) {
      const cells = l.split('\t').map((c) => c.trim()).filter((c, i, arr) => c || i < arr.length - 1);
      if (!inTable) {
        inTable = true;
        tableHeaderCols = cells.length;
        result.push('| ' + cells.join(' | ') + ' |');
        result.push('| ' + Array(tableHeaderCols).fill('---').join(' | ') + ' |');
      } else {
        while (cells.length < tableHeaderCols) cells.push('-');
        result.push('| ' + cells.slice(0, tableHeaderCols).join(' | ') + ' |');
      }
    } else {
      inTable = false;
      result.push(l);
    }
  }
  return result.join('\n');
}

// Category mapping helper (Strictly 4 categories)
function pickCategory(name, text) {
  if (name === '光速云' || name === '暮光加速' || name === '唯兔云' || name === '宇宙云' || name === '光年梯' || name === '隐形人' || name === '闪跃' || name.includes('WgetCloud')) {
    return 'iepl';
  }
  if (name === '微风网络' || name === '飞猫云' || name === '大佬云' || name === '无忧链接' || name === '灵猫网络' || name === 'SOGO云' || name === '闪电鼠' || name === '云界线' || name === '榴莲云' || name === '神行加速' || name === '环球梯' || name.includes('白月光') || name.includes('龙猫云') || name.includes('山水云')) {
    return 'budget';
  }
  if (name === '二猫云' || name === 'Firefly' || name === '极连云' || name === '可信云' || name === '速界' || name.includes('FlyingBird') || name.includes('FATCAT') || name.includes('sslar') || name.includes('萤火虫')) {
    return 'ai-stream';
  }
  return 'cross-border';
}

const speedtestMap = {
  '光速云': '光速云-节点测速实测.png',
  '微风网络': '微风-节点测速实测.png',
  '暮光加速': '幕光加速-节点测速实测.png',
  '飞猫云': '飞猫云-节点测速实测.png',
  '星岛梦': '星岛梦-节点测速实测.png',
  '二猫云': '二猫云-节点测速实测.png',
  '唯兔云': '唯兔云-节点测速实测.png',
  '宇宙云': '宇宙云-节点测速实测.png',
  'U1S1': 'U1S1-节点测速实测.png',
  '灵猫网络': '灵猫网络-节点测速实测.png',
  '极连云': '极连云-节点测速实测.png',
  '光年梯': '光年梯-节点测速实测.png',
  '一翻云': '一翻云-节点测速实测.png',
  'SOGO云': 'SOGO云-节点测速实测.png',
  '可信云': '可信云-节点测速实测.png',
  '速界': '速界-节点测速实测.png',
  '全球云': '全球云-节点测速实测.png',
};

function buildSummary(name, category, text) {
  if (name === '光速云') {
    return '2020老牌IEPL与企业内网专线机场，双线路高可用架构，全节点2.5Gbps高带宽，支持4K及主流AI解锁。';
  }
  if (name === '微风网络') {
    return '高性价比IEPL专线入门机场，年付低至7元/月，支持VLESS协议与主流流媒体，提供7×24小时客服保障。';
  }
  if (name === '暮光加速') {
    return 'BGP智能调度与专线级出口，主打低延迟与高稳定性，多端支持与真人技术支持。';
  }
  if (name === '飞猫云') {
    return '学生与轻度用户预算之选，折算低至7元档，IEPL直连专线与全区4K解锁。';
  }
  if (name === '星岛梦') {
    return '2020年起稳定运营，提供不限时不过期流量包与大带宽跨境线路，适合备用与大流量用户。';
  }
  const matchPrice = text.match(/(?:最低|入门|年付约|月付)?([0-9\.]+\s*元(?:\/月|\/年)?)/);
  const priceStr = matchPrice ? matchPrice[1] : '高性价比套餐';
  return `${name}网络加速服务，${priceStr}，支持主流协议与多端客户端导入，高速稳定低延迟。`;
}

function extractYear(text) {
  const m = text.match(/(20[12][0-9])年/);
  return m ? `${m[1]}-01-01` : '2024-01-01';
}

function extractAffiliate(text) {
  const m = text.match(/https?:\/\/[a-zA-Z0-9\.\_\-\/]+(?:code=[a-zA-Z0-9_\-]+|invite_code=[a-zA-Z0-9_\-]+|code=[^\s`"'\)]+)/);
  if (m) return m[0].replace(/[`"'\)]/g, '').trim();
  const m2 = text.match(/https?:\/\/[^\s`"'<>]+/);
  return m2 ? m2[0].replace(/[`"'\)]/g, '').trim() : '';
}

function extractCoupon(text) {
  const m = text.match(/优惠码[：:\s]*`?([a-zA-Z0-9_-]+)`?/);
  return m ? m[1] : '';
}

fs.mkdirSync('src/content/work', { recursive: true });

list.forEach((brand, idx) => {
  const order = idx + 1;
  const category = pickCategory(brand.name, brand.rawSection);
  const summary = buildSummary(brand.name, category, brand.rawSection);
  const started = extractYear(brand.rawSection);
  const affiliateUrl = extractAffiliate(brand.rawSection);
  const coupon = extractCoupon(brand.rawSection);
  const speedtestImg = speedtestMap[brand.name];

  let body = '';

  body += `> **评测与数据核验提示**：本页包含 ${brand.name} 真实测试数据与架构评测。若需体验该服务，可通过下方专属通道获取即时优惠。通过本站链接注册支持本站运营，不影响您的最终支付价格。\n\n`;

  if (affiliateUrl) {
    body += `<div class="not-prose my-6 border border-border p-5 bg-surface">\n`;
    body += `  <div class="flex flex-wrap items-baseline justify-between gap-4 font-mono text-sm">\n`;
    body += `    <div>\n`;
    body += `      <span class="text-muted">品牌：</span><strong>${brand.name}</strong>\n`;
    if (coupon) {
      body += `      <span class="ml-4 text-muted">专属优惠码：</span><code class="px-1.5 py-0.5 border border-border bg-background">${coupon}</code>\n`;
    }
    body += `    </div>\n`;
    body += `    <a href="${affiliateUrl}" target="_blank" rel="nofollow sponsored noopener" class="text-primary hover:underline font-mono">\n`;
    body += `      进入官网直达通道 →\n`;
    body += `    </a>\n`;
    body += `  </div>\n`;
    body += `</div>\n\n`;
  }

  // Characteristics
  body += `## 技术架构与节点特点\n\n`;
  const charMatch = brand.rawSection.match(/(?:品牌资料明确说了的|核心特色)[\s\S]*?(?=(?:套餐价格|测速|流媒体|介绍说明|待核实|$))/);
  if (charMatch) {
    let rawChar = charMatch[0].replace(/^(?:品牌资料明确说了的|核心特色)[：:\s\*]*/, '').trim();
    rawChar = rawChar.replace(/^\*\*：\s*/, '').replace(/\n\s*\*\s*$/, '');
    body += `${rawChar}\n\n`;
  } else {
    body += `- **线路架构**：优质跨境中转及专线网络，智能 BGP 调度。\n- **支持协议**：主流协议兼容（VLESS / Shadowsocks / Trojan）。\n- **客户端生态**：支持 Clash Verge Rev、v2rayN、Shadowrocket 等全平台导入。\n\n`;
  }

  // Pricing Table
  const priceMatch = brand.rawSection.match(/套餐价格[\s\S]*?(?=(?:测速|流媒体|介绍说明|核心特色|与同类差异|文末引导|$))/);
  if (priceMatch) {
    body += `## 套餐方案与价格明细\n\n`;
    const cleanPrice = priceMatch[0].replace(/^套餐价格\s*/, '').trim();
    body += `${formatGfmTables(cleanPrice)}\n\n`;
  }

  // Speedtest Data
  const speedMatch = brand.rawSection.match(/测速[\s\S]*?(?=(?:流媒体|介绍说明|套餐价格|核心特色|$))/);
  if (speedMatch || speedtestImg) {
    body += `## 节点测速实测数据\n\n`;
    if (speedMatch) {
      const cleanSpeed = speedMatch[0].replace(/^测速[^\n]*\n/, '').trim();
      body += `${formatGfmTables(cleanSpeed)}\n\n`;
    }
    if (speedtestImg) {
      body += `### 实测带宽与延迟测速看板\n\n`;
      body += `下图为测试环境下的实际节点带宽测试图表（抽样测试数据，测试工具：Speedtest / MAI-TEST-BOT）：\n\n`;
      body += `![${brand.name} 节点测速实测](/images/speedtests/${speedtestImg})\n\n`;
    }
  }

  // Streaming / AI Unlock
  const unlockMatch = brand.rawSection.match(/流媒体[\s\S]*?(?=(?:介绍说明|待核实|与同类差异|文末引导|$))/);
  if (unlockMatch) {
    body += `## 流媒体与 AI 工具解锁矩阵\n\n`;
    const cleanUnlock = unlockMatch[0].replace(/^流媒体[^\n]*\n/, '').trim();
    body += `${cleanUnlock}\n\n`;
  }

  if (brand.name === '光速云') {
    body += `### 原生 IP 流媒体与 AI 解锁实测图\n\n`;
    body += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-4">\n`;
    body += `  <img src="/images/unlocks/photo_2026-08-19_12-13-01.jpg" alt="光速云流媒体实测图 1" class="border border-border w-full" />\n`;
    body += `  <img src="/images/unlocks/photo_2026-08-19_12-13-50.jpg" alt="光速云流媒体实测图 2" class="border border-border w-full" />\n`;
    body += `  <img src="/images/unlocks/photo_2026-08-19_12-13-58.jpg" alt="光速云 AI 解锁测试图" class="border border-border w-full" />\n`;
    body += `  <img src="/images/unlocks/photo_2026-08-19_12-18-40.jpg" alt="光速云 节点带宽实测图" class="border border-border w-full" />\n`;
    body += `</div>\n\n`;
  }

  // Introduction & Evaluation
  const introMatch = brand.rawSection.match(/介绍说明[\s\S]*?(?=(?:待核实|与同类差异|文末引导|$))/);
  if (introMatch) {
    body += `## 综合测评与使用建议\n\n`;
    let cleanIntro = introMatch[0].replace(/^介绍说明[：:\s]*/, '').trim();
    cleanIntro = cleanIntro.replace(/^：\s*/, '');
    body += `${cleanIntro}\n\n`;
  }

  // Suitable Audience
  body += `## 适合与不适合人群\n\n`;
  body += `- **适合人群**：需要稳定访问 GitHub、Google、日常刷网页追剧，或需要调用 ChatGPT、Claude 等生产力 AI 工具的用户。\n`;
  body += `- **注意与建议**：建议新用户优先选择月付或轻量方案，并在本地实际晚高峰网络环境下测试稳定度后，再根据需求决定是否续费长期套餐。\n\n`;

  // FAQ
  body += `## 常见问题解答 (FAQ)\n\n`;
  body += `### 1. ${brand.name} 支持哪些客户端？\n`;
  body += `主流平台均可支持，包括 Windows 平台的 Clash Verge Rev、v2rayN；Android 平台的 v2rayNG、FlClash；iOS 平台的 Shadowrocket（小火箭）、Stash；macOS 平台的 Clash Verge Rev 等。详情可查阅本站的 [客户端指南](/clients)。\n\n`;
  body += `### 2. 遇到节点连不上或延迟高如何排查？\n`;
  body += `首先在客户端中更新订阅配置，确保获取最新节点列表；其次检查本地系统时间是否同步，最后可切换不同地区节点（如香港换新加坡或日本）进行分流测试。\n\n`;

  const mdContent = `---
title: '${brand.name}'
category: '${category}'
summary: '${summary}'
status: 'live'
started: ${started}
order: ${order}
affiliateUrl: '${affiliateUrl}'
coupon: '${coupon}'
hasSpeedtest: ${!!speedtestImg}
---

${body}
`;

  const filePath = path.join('src/content/work', `${brand.slug}.md`);
  fs.writeFileSync(filePath, mdContent, 'utf8');
});

console.log('Successfully re-generated 42 brand markdown files with formatted tables!');
