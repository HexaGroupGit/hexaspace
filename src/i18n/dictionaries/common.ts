// ─────────────────────────────────────────────────────────────────────────────
// Shared chrome copy — header, footer, CTA band, site metadata.
// `COMMON[locale]` returns the full namespace for that language.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

const en = {
  meta: {
    title: 'Hexa Space — Luxury Workspaces in Box Hill, Melbourne',
    description:
      'A luxury workspace and members club in Box Hill. Private offices, dedicated desks, meeting rooms, event spaces, media and podcast studios — designed for those who value how they work.',
    ogDescription: 'A luxury workspace and members club in Box Hill, Melbourne.',
  },
  nav: {
    workspaces: 'Memberships',
    spaces: 'Space Hire',
    community: 'Community',
    merch: 'Merch',
    about: 'About',
    book: 'Book',
    bookARoom: 'Book a Room',
    memberLogin: 'Member Login',
    enquire: 'Enquire',
    homeAria: 'Hexa Space home',
    toggleMenu: 'Toggle menu',
    poa: 'POA',
  },
  footer: {
    appKicker: 'Coming soon — app.hexaspace.com.au',
    appTitle: 'Your space,',
    appTitleItalic: 'orchestrated.',
    appBody:
      'A members companion that manages the everyday — bookings, onboarding, correspondence and community — so the work of running your workspace quietly takes care of itself.',
    colWorkspaces: 'Memberships',
    colSpaces: 'Space Hire',
    colHexa: 'Hexa',
    community: 'Community',
    merch: 'Merch',
    podcast: 'Podcast',
    about: 'About',
    contact: 'Contact',
    memberLogin: 'Member Login',
    legal: '© {year} Hexa Space · A Hexa Group company',
  },
  cta: {
    eyebrow: 'Visit · Box Hill',
    title: 'Come and see',
    titleItalic: 'the space.',
    body: 'The best way to understand Hexa Space is to stand in it. Arrange a private tour and we’ll show you the floor, the lounge and the studios.',
    primaryLabel: 'Book a private tour',
  },
};

export type CommonDict = typeof en;

const zh: CommonDict = {
  meta: {
    title: 'Hexa Space — 墨尔本博士山高端办公空间',
    description:
      '坐落于博士山的高端办公空间与会员俱乐部。独立办公室、专属工位、会议室、活动场地、影像与播客工作室 — 为珍视工作方式的人而设。',
    ogDescription: '坐落于墨尔本博士山的高端办公空间与会员俱乐部。',
  },
  nav: {
    workspaces: '会员方案',
    spaces: '场地租赁',
    community: '社区',
    merch: '品牌周边',
    about: '关于我们',
    book: '预订',
    bookARoom: '预订房间',
    memberLogin: '会员登录',
    enquire: '咨询',
    homeAria: 'Hexa Space 首页',
    toggleMenu: '切换菜单',
    poa: '面议',
  },
  footer: {
    appKicker: '即将上线 — app.hexaspace.com.au',
    appTitle: '您的空间，',
    appTitleItalic: '从容有序。',
    appBody:
      '一款为会员而生的日常助手 — 预订、入驻、往来事务与社区动态，皆可安心交托，让空间的运营悄然自理。',
    colWorkspaces: '会员方案',
    colSpaces: '场地租赁',
    colHexa: 'Hexa',
    community: '社区',
    merch: '品牌周边',
    podcast: '播客',
    about: '关于我们',
    contact: '联系我们',
    memberLogin: '会员登录',
    legal: '© {year} Hexa Space · Hexa Group 旗下公司',
  },
  cta: {
    eyebrow: '到访 · 博士山',
    title: '欢迎亲临，',
    titleItalic: '感受空间。',
    body: '了解 Hexa Space 最好的方式，是亲身站在这里。预约一次私人参观，我们将带您走进办公楼层、会员休息室与各个工作室。',
    primaryLabel: '预约私人参观',
  },
};

export const COMMON: Record<Locale, CommonDict> = { en, zh };
