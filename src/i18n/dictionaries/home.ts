// ─────────────────────────────────────────────────────────────────────────────
// Home page copy — hero, pillars, workspace/space teasers, podcast, community,
// location. `HOME[locale]` returns the namespace for that language.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

const en = {
  hero: {
    eyebrow: 'Box Hill · Melbourne',
    title: 'A workspace,',
    titleItalic: 'elevated.',
    lead: 'Hexa Space is a luxury workspace and members club — bringing clarity, hospitality and intention to the working day, for those who value how they work as much as what they do.',
    explore: 'Explore Hexa Space',
    tour: 'Book a private tour',
    imageAlt: 'Hexa Space interior, Box Hill',
  },
  pillars: {
    eyebrow: 'The Hexa system',
    titleA: 'Three settings for a',
    titleB: 'considered working life.',
    explore: 'Explore',
    items: [
      {
        name: 'Studio',
        copy: 'Private offices, dedicated desks and flexible space — composed environments designed for focus and daily excellence.',
      },
      {
        name: 'Lounge',
        copy: 'The members lounge — a place to meet, host and spend time together, with the warmth of considered hospitality.',
      },
      {
        name: 'Atelier',
        copy: 'A setting for ideas, events, media and podcasting — shared moments that reach beyond the working day.',
      },
    ],
  },
  workspaces: {
    eyebrow: 'Memberships',
    title: 'Membership, at every scale.',
    body: 'From a business address to a private suite — transparent pricing, month-to-month, with every membership including access to the lounge, meeting rooms and members programming.',
    view: 'View membership',
    unsure: 'Not sure which fits?',
    tourCard: 'Book a private tour of Hexa Space.',
    arrange: 'Arrange a visit',
  },
  spaces: {
    eyebrow: 'Space hire',
    title: 'More than desks — a place to host, gather and create.',
    checkAvailability: 'Check availability',
    enquire: 'Enquire',
    items: [
      {
        name: 'Meeting Rooms',
        detail: '4 – 12 guests',
        copy: 'Six named rooms with floor-to-ceiling windows and advanced AV — from an intimate consulting room to a traditional Chinese tearoom.',
      },
      {
        name: 'Event Space',
        detail: '20 – 100 guests',
        copy: 'A versatile setting for launches, seminars and gatherings — full AV, IT and catering, framed by the Box Hill skyline.',
      },
      {
        name: 'Media Studios',
        detail: 'Photo · Video',
        copy: 'Purpose-built studios for video, photography and content — professional equipment, on tap, by the hour.',
      },
    ],
  },
  podcast: {
    eyebrow: 'New — The Podcast Studio',
    title: 'Find your',
    titleItalic: 'voice.',
    lead: 'A broadcast-ready studio inside Hexa Space — soundproofed, beautifully lit and fully equipped for podcasting, interviews and long-form conversation.',
    body: 'Members record, edit and publish in-house. We also produce the Hexa Space podcast — conversations with the founders, makers and thinkers who share our floor.',
    book: 'Book the studio',
    listen: 'Listen',
    imageAlt: 'Hexa Space podcast studio',
  },
  community: {
    eyebrow: 'The Hexa community',
    title: 'A community, not just a membership.',
    explore: 'Explore the community',
    values: [
      {
        title: 'Belong, beyond the desk',
        copy: 'Events, workshops and conversations that reach past the working day — calligraphy evenings, founder talks and seasonal celebrations, all on one floor.',
      },
      {
        title: 'Hospitality at the core',
        copy: 'A members club sensibility — you are hosted, not merely accommodated, from the front desk to the lounge.',
      },
      {
        title: 'A global network',
        copy: 'Through our Ucommune partnership, the community reaches a network of workspaces across Australia, China and beyond.',
      },
    ],
  },
  location: {
    eyebrow: 'Visit · Box Hill',
    title: 'Come and see',
    titleItalic: 'the space.',
    lead: 'The best way to understand Hexa Space is to stand in it. Send an enquiry and we’ll arrange a private tour of the floor, the lounge and the studios.',
    tour: 'Book a private tour',
    addressLabel: 'Address',
    contactLabel: 'Contact',
  },
};

export type HomeDict = typeof en;

const zh: HomeDict = {
  hero: {
    eyebrow: '博士山 · 墨尔本',
    title: '办公空间，',
    titleItalic: '自此不同。',
    lead: 'Hexa Space 是一间高端办公空间与会员俱乐部 — 以清晰、款待与用心，成就每一个工作日，献给珍视工作方式的您。',
    explore: '探索 Hexa Space',
    tour: '预约私人参观',
    imageAlt: 'Hexa Space 博士山空间内景',
  },
  pillars: {
    eyebrow: 'Hexa 体系',
    titleA: '三种场景，',
    titleB: '成就从容有度的工作生活。',
    explore: '探索',
    items: [
      {
        name: 'Studio',
        copy: '独立办公室、专属工位与灵活空间 — 沉静有序的环境，为专注与日常的卓越而设。',
      },
      {
        name: 'Lounge',
        copy: '会员休息室 — 会面、待客与共处的所在，浸润着体贴入微的款待。',
      },
      {
        name: 'Atelier',
        copy: '为创意、活动、影像与播客而设的舞台 — 让共同的时刻延伸至工作日之外。',
      },
    ],
  },
  workspaces: {
    eyebrow: '会员方案',
    title: '会员方案，丰俭由人。',
    body: '从一个商务地址到一间独立套间 — 价格透明、按月签约，每一种会员均可享用休息室、会议室与会员活动。',
    view: '查看方案',
    unsure: '不确定哪种适合？',
    tourCard: '预约一次 Hexa Space 私人参观。',
    arrange: '安排到访',
  },
  spaces: {
    eyebrow: '场地租赁',
    title: '不止于工位 — 更是待客、相聚与创作之所。',
    checkAvailability: '查询可预订时段',
    enquire: '咨询',
    items: [
      {
        name: '会议室',
        detail: '4 – 12 位宾客',
        copy: '六间独具风格的会议室，落地窗与先进影音设备俱备 — 从静谧的咨询室到传统中式茶室。',
      },
      {
        name: '活动空间',
        detail: '20 – 100 位宾客',
        copy: '发布会、讲座与聚会的多变场地 — 影音、IT 与餐饮一应俱全，博士山天际线尽收眼底。',
      },
      {
        name: '影像工作室',
        detail: '摄影 · 视频',
        copy: '为视频、摄影与内容创作而建的专业工作室 — 专业设备随时待命，按小时预订。',
      },
    ],
  },
  podcast: {
    eyebrow: '全新 — 播客工作室',
    title: '让世界听见',
    titleItalic: '您的声音。',
    lead: 'Hexa Space 内的广播级录音棚 — 隔音精良、灯光考究，为播客、访谈与深度对话准备就绪。',
    body: '会员可在此完成录制、剪辑与发布。我们也在这里制作 Hexa Space 播客 — 与同在这层楼的创始人、创作者与思考者对话。',
    book: '预订工作室',
    listen: '收听',
    imageAlt: 'Hexa Space 播客工作室',
  },
  community: {
    eyebrow: 'Hexa 社区',
    title: '不止会员身份，更是一个社区。',
    explore: '走进社区',
    values: [
      {
        title: '归属，不止于工位',
        copy: '书法雅集、创始人对谈、节庆聚会 — 活动、工作坊与对话，让联结延伸至工作日之外。',
      },
      {
        title: '款待为本',
        copy: '会员俱乐部式的体贴 — 从前台到休息室，您是被款待的宾客，而非仅仅入驻的租户。',
      },
      {
        title: '全球网络',
        copy: '通过与 Ucommune 的合作，这个社区延伸至横跨澳大利亚、中国及更远地区的办公空间网络。',
      },
    ],
  },
  location: {
    eyebrow: '到访 · 博士山',
    title: '欢迎亲临，',
    titleItalic: '感受空间。',
    lead: '了解 Hexa Space 最好的方式，是亲身站在这里。发送咨询，我们将为您安排一次私人参观 — 走进办公楼层、会员休息室与各个工作室。',
    tour: '预约私人参观',
    addressLabel: '地址',
    contactLabel: '联系方式',
  },
};

export const HOME: Record<Locale, HomeDict> = { en, zh };
