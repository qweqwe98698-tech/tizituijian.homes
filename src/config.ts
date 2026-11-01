// src/config.ts — single entry point for site settings. Everything site-specific lives here; never hardcode in components.
export const site = {
  name: '梯子推荐',
  description: '2026 精选高速稳定梯子机场推荐、IEPL专线节点实测与主流代理客户端使用指南。',
  url: 'https://tizituijian.homes',
  locale: 'zh',
  author: '梯子推荐',
  defaultOgImage: '/og-default.png',
} as const;

export const nav = {
  header: [
    { label: '机场推荐', href: '/work' },
    { label: '测速评测', href: '/notes' },
    { label: '客户端指南', href: '/clients' },
  ],
  footer: [
    {
      title: '网站导航',
      links: [
        { label: '机场推荐', href: '/work' },
        { label: '测速评测', href: '/notes' },
        { label: '客户端指南', href: '/clients' },
        { label: '关于我们', href: '/about' },
      ],
    },
    {
      title: '深度专题矩阵',
      links: [
        { label: '免费资源大全', href: '/free' },
        { label: '机场选购FAQ', href: '/faq' },
        { label: '跑路避坑预警', href: '/warnings' },
      ],
    },
    {
      title: '合规与支持',
      links: [
        { label: '隐私政策', href: '/privacy' },
        { label: '服务条款', href: '/terms' },
        { label: '联系我们', href: '/contact' },
      ],
    },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/tizituijian', icon: 'lucide:github' },
  ],
} as const;

export const seo = {
  titleTemplate: '%s · 梯子推荐',
  twitterHandle: '',
  jsonLd: { type: 'Organization' as 'Person' | 'Organization', name: site.name },
  verification: {
    google: '', // Google Search Console: e.g. <meta name="google-site-verification" content="..." />
    bing: '', // Bing Webmaster Tools: e.g. <meta name="msvalidate.01" content="..." />
    baidu: '', // 百度搜索资源平台: e.g. <meta name="baidu-site-verification" content="..." />
    shenma: '', // 神马站长平台: e.g. <meta name="shenma-site-verification" content="..." />
  },
};

/*
  Categories (Max 4 ceiling per AGENTS.md).
  Maps 1-4 to --accent-1...4 in src/styles/tokens.css.
*/
export const categories = [
  {
    name: '专线旗舰',
    slug: 'iepl',
    accent: 1,
    blurb: 'IEPL / IPLC 专线架构，低延迟与晚高峰高可用抗封锁。',
  },
  {
    name: '性价比入门',
    slug: 'budget',
    accent: 2,
    blurb: '预算友好，月付门槛低至数元，适合学生党与轻度需求。',
  },
  {
    name: 'AI与流媒体',
    slug: 'ai-stream',
    accent: 3,
    blurb: '原生 IP 解锁，畅享 ChatGPT、Claude 与 Netflix 4K。',
  },
  {
    name: '跨境办公',
    slug: 'cross-border',
    accent: 4,
    blurb: '大带宽稳定通道，跨境电商、直播与远程工作首选。',
  },
] as const;

export const work = {
  leaderRule: 'line' as 'line' | 'none',
  showBuilding: true,
};

export const blog = {
  postsPerPage: 10,
  showReadingTime: true,
};

export const contact = {
  endpoint: '',
  email: 'support@tizituijian.homes',
};

export const features = {
  darkMode: true,
};

export const analytics = {
  provider: null as null | 'plausible' | 'ga4' | 'umami',
  id: '',
  host: '',
};
