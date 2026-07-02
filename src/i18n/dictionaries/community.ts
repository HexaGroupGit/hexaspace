// ─────────────────────────────────────────────────────────────────────────────
// Community page copy (replaces the old Membership page).
// Gallery photos live in /public/photos/community/.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

export type GalleryItem = {
  src: string;
  alt: string;
  event: string;
  date: string;
};

const en = {
  meta: {
    title: 'Community — Hexa Space',
    description:
      'The Hexa Space community in Box Hill — events, workshops, member stories and a global Ucommune network. More than a membership: a place to belong.',
  },
  hero: {
    kicker: 'Community',
    title: 'Belong to',
    titleItalic: 'something more.',
    intro:
      'Hexa Space is more than a workspace — it’s a community of founders, makers and thinkers. Events, conversations and friendships that reach well past the working day.',
  },
  gallery: {
    eyebrow: 'Life at Hexa',
    title: 'Moments from the floor.',
    body: 'Grand openings, founder talks, calligraphy evenings and Christmas parties — a look at the community that fills the space.',
    items: [
      { src: '/photos/community/grand-opening-1.jpg', alt: 'Guests arriving at the Hexa Space grand opening', event: 'Grand Opening', date: 'February 2023' },
      { src: '/photos/community/seminar-1.jpg', alt: 'Speaker presenting at a business seminar', event: 'Business Seminars', date: 'Ongoing series' },
      { src: '/photos/community/christmas-1.jpg', alt: 'Members celebrating at the Christmas party', event: 'Christmas Party', date: 'December 2023' },
      { src: '/photos/community/calligraphy-1.jpg', alt: 'Guests at the Lunar New Year calligraphy event', event: 'Calligraphy & Lunar New Year', date: 'January 2023' },
      { src: '/photos/community/hexa-talk-1.jpg', alt: 'Guests at Hexa Talk', event: 'Hexa Talk', date: 'Chapter series' },
      { src: '/photos/community/hightea-1.jpg', alt: 'High tea catering at a members event', event: 'Members High Tea', date: 'Hexa Talk Chapter 1' },
      { src: '/photos/community/networking-1.jpg', alt: 'Members mingling at a networking night', event: 'Networking Nights', date: 'September 2023' },
      { src: '/photos/community/grand-opening-2.jpg', alt: 'Hexa Space raffle at the grand opening', event: 'Grand Opening', date: 'February 2023' },
      { src: '/photos/community/seminar-2.jpg', alt: 'Guest speaker at an e-commerce masterclass', event: 'Masterclasses', date: 'August 2024' },
      { src: '/photos/community/christmas-2.jpg', alt: 'Games at the members Christmas party', event: 'Christmas Party', date: 'December 2023' },
      { src: '/photos/community/eofy-1.jpg', alt: 'End of financial year celebration at Hexa Space', event: 'EOFY Party', date: 'June 2023' },
      { src: '/photos/community/grand-opening-3.jpg', alt: 'Members at the Hexa Space grand opening', event: 'Grand Opening', date: 'February 2023' },
    ] as GalleryItem[],
  },
  programming: {
    eyebrow: 'What’s on',
    title: 'A calendar that never sits still.',
    items: [
      {
        title: 'Hexa Talk',
        copy: 'Our flagship conversation series — founders, specialists and community leaders sharing what they’ve built and learned, recorded in-house.',
      },
      {
        title: 'Networking nights',
        copy: 'Regular evenings that bring the floor together with the wider Box Hill business community — introductions made easy.',
      },
      {
        title: 'Culture & celebration',
        copy: 'Lunar New Year calligraphy, Christmas parties, EOFY celebrations — moments that honour both sides of our community’s heritage.',
      },
      {
        title: 'Workshops & masterclasses',
        copy: 'Practical sessions on e-commerce, media, migration and more — expertise drawn from the members on our own floor.',
      },
    ],
  },
  voices: {
    eyebrow: 'Member voices',
    title: 'What members say.',
    items: [
      {
        quote:
          'I came for the desk and stayed for the people — the events calendar means I meet someone new every week.',
        role: 'Founder · E-commerce',
      },
      {
        quote:
          'Hexa feels like a members club that happens to be a workspace. Clients notice the difference the moment they step out of the lift.',
        role: 'Director · Consulting',
      },
      {
        quote:
          'From the Chinese tearoom to the podcast studio, this is a community that understands both cultures I do business in.',
        role: 'Principal · Advisory',
      },
    ],
  },
  benefits: {
    eyebrow: 'What’s included',
    title: 'Every membership opens the whole of Hexa.',
  },
  ucommune: {
    eyebrow: 'In partnership with Ucommune',
    title: 'A desk in',
    titleItalic: 'every city.',
    body: 'As a Ucommune partner, your Hexa Space membership extends to one of the world’s largest workspace networks — so wherever business takes you, there’s a place to work waiting.',
    cta: 'Ask about global access',
    imageAlt: 'The global Ucommune network',
  },
  hub: {
    eyebrow: 'The Hexa ecosystem',
    title: 'Connected through Hexa Hub.',
    body: 'The community lives beyond the floor. Hexa Hub — our members platform — will bring profiles, business showcases, event RSVPs and community stories into one place, connecting everything Hexa builds.',
    note: 'Member profiles & showcases · Event photos & videos · Interviews & success stories — coming to Hexa Hub.',
  },
  tiers: {
    eyebrow: 'Choose your home base',
    title: 'Memberships at a glance.',
    viewAll: 'View all memberships',
    details: 'Details',
  },
  cta: {
    eyebrow: 'Join the community',
    title: 'Come as a guest,',
    titleItalic: 'stay as a member.',
    body: 'The best introduction to the Hexa community is an afternoon in it. Arrange a visit, join an event, and see who you might be working beside.',
    primary: 'Book a private tour',
  },
};

export type CommunityDict = typeof en;

const zh: CommunityDict = {
  meta: {
    title: '社区 — Hexa Space',
    description:
      '博士山 Hexa Space 社区 — 活动、工作坊、会员故事与 Ucommune 全球网络。不止会员身份，更是一个归属之地。',
  },
  hero: {
    kicker: '社区',
    title: '归属于',
    titleItalic: '更广阔的所在。',
    intro:
      'Hexa Space 不止是办公空间 — 更是创始人、创作者与思考者汇聚的社区。活动、对话与情谊，延伸至工作日之外。',
  },
  gallery: {
    eyebrow: '社区掠影',
    title: '这层楼上的时光。',
    body: '开业庆典、创始人对谈、书法雅集与圣诞派对 — 一览让这个空间生动起来的社区。',
    items: [
      { src: '/photos/community/grand-opening-1.jpg', alt: 'Hexa Space 开业庆典宾客签到', event: '开业庆典', date: '2023 年 2 月' },
      { src: '/photos/community/seminar-1.jpg', alt: '商业讲座演讲现场', event: '商业讲座', date: '系列活动' },
      { src: '/photos/community/christmas-1.jpg', alt: '会员圣诞派对', event: '圣诞派对', date: '2023 年 12 月' },
      { src: '/photos/community/calligraphy-1.jpg', alt: '迎新春书法雅集', event: '书法雅集 · 迎新春', date: '2023 年 1 月' },
      { src: '/photos/community/hexa-talk-1.jpg', alt: 'Hexa Talk 对谈嘉宾', event: 'Hexa Talk 对谈', date: '系列活动' },
      { src: '/photos/community/hightea-1.jpg', alt: '会员活动高端茶歇', event: '会员下午茶', date: 'Hexa Talk 第一期' },
      { src: '/photos/community/networking-1.jpg', alt: '社交之夜宾客交流', event: '社交之夜', date: '2023 年 9 月' },
      { src: '/photos/community/grand-opening-2.jpg', alt: '开业庆典抽奖', event: '开业庆典', date: '2023 年 2 月' },
      { src: '/photos/community/seminar-2.jpg', alt: '电商大师课演讲嘉宾', event: '大师课', date: '2024 年 8 月' },
      { src: '/photos/community/christmas-2.jpg', alt: '圣诞派对互动游戏', event: '圣诞派对', date: '2023 年 12 月' },
      { src: '/photos/community/eofy-1.jpg', alt: '财年收官派对', event: '财年收官派对', date: '2023 年 6 月' },
      { src: '/photos/community/grand-opening-3.jpg', alt: '开业庆典会员合影', event: '开业庆典', date: '2023 年 2 月' },
    ] as GalleryItem[],
  },
  programming: {
    eyebrow: '活动日历',
    title: '全年不歇的社区日程。',
    items: [
      {
        title: 'Hexa Talk 对谈',
        copy: '我们的旗舰对谈系列 — 创始人、行业专家与社区领袖分享他们的所建与所悟，并在自家工作室完成录制。',
      },
      {
        title: '社交之夜',
        copy: '定期举办的联谊之夜，让这层楼与更广阔的博士山商业社群相聚 — 结识新朋友，从未如此自然。',
      },
      {
        title: '文化与节庆',
        copy: '迎新春书法雅集、圣诞派对、财年收官庆典 — 致敬社区文化传承的每一个时刻。',
      },
      {
        title: '工作坊与大师课',
        copy: '电商、媒体、移民等领域的实战课程 — 智慧就来自这层楼上的会员。',
      },
    ],
  },
  voices: {
    eyebrow: '会员之声',
    title: '听听会员怎么说。',
    items: [
      {
        quote: '最初为一张工位而来，留下却是因为这里的人 — 丰富的活动让我每周都能结识新朋友。',
        role: '创始人 · 电商',
      },
      {
        quote: 'Hexa 更像一间恰好可以办公的会员俱乐部。客户走出电梯的那一刻，就能感受到不同。',
        role: '总监 · 咨询',
      },
      {
        quote: '从中式茶室到播客工作室，这个社区懂得我经营事业所在的两种文化。',
        role: '合伙人 · 顾问服务',
      },
    ],
  },
  benefits: {
    eyebrow: '会员权益',
    title: '每一种会员，都能享有 Hexa 的全部。',
  },
  ucommune: {
    eyebrow: '与 Ucommune 携手',
    title: '每一座城市，',
    titleItalic: '都有您的一张办公桌。',
    body: '作为 Ucommune 的合作伙伴，您的 Hexa Space 会员身份可通行全球最大的办公空间网络之一 — 无论业务去往何处，总有一处办公之所等候。',
    cta: '咨询全球通行',
    imageAlt: 'Ucommune 全球网络',
  },
  hub: {
    eyebrow: 'Hexa 生态',
    title: '由 Hexa Hub 连接。',
    body: '社区的生命力不止于这层楼。Hexa Hub — 我们的会员平台 — 将把会员档案、企业展示、活动报名与社区故事汇聚一处，连接 Hexa 打造的一切。',
    note: '会员档案与企业展示 · 活动照片与视频 · 专访与成功故事 — 即将登陆 Hexa Hub。',
  },
  tiers: {
    eyebrow: '选择您的主场',
    title: '会员方案一览。',
    viewAll: '查看全部会员方案',
    details: '了解详情',
  },
  cta: {
    eyebrow: '加入社区',
    title: '以宾客之名而来，',
    titleItalic: '以会员之名留下。',
    body: '认识 Hexa 社区最好的方式，是在这里度过一个下午。安排一次到访，参加一场活动，看看您未来的邻座会是谁。',
    primary: '预约私人参观',
  },
};

export const COMMUNITY: Record<Locale, CommunityDict> = { en, zh };
