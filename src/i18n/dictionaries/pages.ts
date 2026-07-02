// ─────────────────────────────────────────────────────────────────────────────
// Page copy — about, workspaces (index + detail), spaces (index + detail),
// podcast. `PAGES[locale]` returns the full namespace for that language.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

const en = {
  about: {
    metaTitle: 'About — Hexa Space',
    metaDescription:
      'Hexa Space is a luxury workspace and members club in Box Hill, Melbourne — part of the Hexa Group. Built on people, place, culture and legacy.',
    heroKicker: 'About',
    heroTitle: 'More than a',
    heroTitleItalic: 'workspace.',
    heroIntro:
      'Hexa Space is a luxury workspace and members club in the heart of Box Hill — bringing clarity, hospitality and intention to the working day.',
    storyEyebrow: 'Our story',
    storyTitle: 'A considered home for Melbourne’s east.',
    storyLead:
      'We set out to build the kind of workspace we wanted to work in — one that felt less like a serviced office and more like a private members club.',
    storyBody1:
      'Spread across a light-filled floor on Whitehorse Road, Hexa Space pairs architecturally designed offices and desks with a hosted lounge, six named meeting rooms, media and podcast studios, and a function space for everything from board dinners to product launches. Every detail — the fluted joinery, the natural light, the premium tea service — is there to make the work feel effortless.',
    storyBody2:
      'As part of the Hexa Group, a diversified Australian property and funds management group, we’re built on a simple belief: that extraordinary spaces are built on people, place, culture and legacy.',
    pillarsEyebrow: 'What we’re built on',
    pillarsTitle: 'People. Place. Culture. Legacy.',
    pillars: [
      {
        title: 'People',
        copy: 'Success through collaboration. We hero the members, founders and teams who share our floor — and host them the way you’d host a guest, not a tenant.',
      },
      {
        title: 'Place',
        copy: 'Distinctly Box Hill, distinctly Melbourne’s east. We’re embedded in our locale — its energy, its diversity and its growing role as a place to build a business.',
      },
      {
        title: 'Culture',
        copy: 'A sensitive balance of Anglo and Asian influence runs through everything — from the tearoom to the programming — reflecting the community we build for.',
      },
      {
        title: 'Legacy',
        copy: 'As part of the Hexa Group, we build spaces meant to endure — considered, quietly luxurious, and made to matter for years rather than months.',
      },
    ],
    placeEyebrow: 'The place · Box Hill',
    placeTitle: 'Rooted in',
    placeTitleItalic: 'the locale.',
    placeLead:
      'Box Hill is one of Melbourne’s most dynamic centres — a meeting point of cultures, transport and ambition. Hexa Space sits at its heart on Level 4, 830 Whitehorse Road, with floor-to-ceiling windows framing the skyline.',
    placeBody:
      'It’s a short walk from the station, surrounded by some of the city’s best food, and connected — through our Ucommune partnership — to a workspace network that spans the globe.',
    placeImageAlt: 'Hexa Space reception, Box Hill',
    stats: [
      { value: '5', label: 'Membership tiers' },
      { value: '6', label: 'Named meeting rooms' },
      { value: '20–100', label: 'Event capacity' },
      { value: 'Global', label: 'Ucommune network' },
    ],
    groupEyebrow: 'Part of something larger',
    groupTitle: 'A Hexa Group company.',
    groupBody:
      'Hexa Space is the workspace arm of the Hexa Group — a diversified Australian property and funds management group creating enduring value through innovation and collaboration. It’s a lineage that shapes how we design, host and build for the long term.',
    groupCta: 'Get in touch',
  },

  workspacesPage: {
    metaTitle: 'Memberships — Hexa Space',
    metaDescription:
      'Virtual offices, flexible and dedicated desks, private offices and enterprise suites in Box Hill, Melbourne — with transparent pricing and full inclusions.',
    heroKicker: 'Memberships',
    heroTitle: 'Membership, at',
    heroTitleItalic: 'every scale.',
    heroIntro:
      'From a business address to a self-contained suite — month-to-month, transparently priced, and designed around how you actually want to work.',
    includedEyebrow: 'Always included',
    includedTitle: 'Every membership, beautifully serviced.',
    includedBody:
      'Whichever workspace you choose, the essentials are handled — so you can arrive, settle in and get to work.',
    inclusionsLabel: 'Inclusions',
    everythingIn: (name: string) => `Everything in ${name}, plus`,
    viewMembership: 'View membership',
    enquire: 'Enquire',
    ctaEyebrow: 'Not sure which fits?',
    ctaTitle: 'Let’s find your',
    ctaTitleItalic: 'space.',
    ctaBody:
      'Tell us about your team and how you like to work, and we’ll tailor the right membership — then show you around in person.',
  },

  workspaceDetail: {
    membershipKicker: (capacity: string) => `Membership · ${capacity}`,
    pricing: 'Pricing',
    from: 'From',
    term: 'Term',
    capacity: 'Capacity',
    enquire: 'Enquire',
    overviewEyebrow: 'Overview',
    idealFor: 'Ideal for',
    whatsIncluded: 'What’s included',
    everythingIn: (name: string) => `Everything in ${name}, plus`,
    whyEyebrow: 'Why this membership',
    whyTitle: 'The detail that makes the difference.',
    galleryEyebrow: 'The space',
    alwaysEyebrow: 'Always included',
    alwaysTitle: 'Every membership, beautifully serviced.',
    alwaysBody:
      'Whichever workspace you choose, the essentials — and the community — come as standard.',
    ctaTitle: 'Make it',
    ctaTitleItalic: 'yours.',
    ctaBody:
      'Tell us a little about how you work and we’ll tailor the right membership — then show you the floor in person.',
    ctaPrimary: 'Enquire now',
    othersEyebrow: 'Other memberships',
  },

  spacesPage: {
    metaTitle: 'Space Hire — Hexa Space',
    metaDescription:
      'The Function Space, meeting rooms, media studios and podcast studio at Hexa Space, Box Hill — for events from 20 to 150, meetings from 4 to 26, and broadcast-ready production.',
    heroKicker: 'Space Hire',
    heroTitle: 'A place to host,',
    heroTitleB: 'gather ',
    heroTitleItalic: 'and create.',
    heroIntro:
      'More than desks — a versatile function space, light-filled meeting rooms and purpose-built studios for media and podcasting, all under one roof in Box Hill.',
    whatsIncluded: 'What’s included',
    viewSpace: (name: string) => `View ${name}`,
    ctaEyebrow: 'Host with Hexa',
    ctaTitle: 'Plan your',
    ctaTitleItalic: 'event.',
    ctaBody:
      'From an intimate boardroom session to a 150-guest launch, our team will help you shape the space, the catering and the run of show.',
    ctaPrimary: 'Enquire about hosting',
  },

  spaceDetail: {
    capacity: 'Capacity',
    overviewEyebrow: 'Overview',
    overviewTitle: 'A space that works as hard as you do.',
    whatsIncluded: 'What’s included',
    roomsEyebrow: 'The rooms',
    roomsTitle: 'Seven rooms, each with its own character.',
    roomAlt: (name: string) => `${name} room`,
    bookNow: 'Book now',
    configEyebrow: 'Configurations',
    configTitle: 'One room, arranged your way.',
    galleryEyebrow: 'The space',
    ctaTitle: 'Ready to',
    ctaTitleItalic: 'book?',
    ctaBody:
      'Tell us your dates and what you have in mind — our team will confirm availability and tailor the space to suit.',
    moreEyebrow: 'More spaces',
    view: 'View',
  },

  podcastPage: {
    metaTitle: 'The Podcast — Hexa Space',
    metaDescription:
      'The Hexa Space podcast — conversations with the founders, makers and thinkers who share our floor. Recorded in our broadcast-ready studio in Box Hill, Melbourne.',
    heroKicker: 'The Podcast',
    heroTitle: 'Conversations',
    heroTitleB: 'from ',
    heroTitleItalic: 'our floor.',
    heroIntro:
      'The Hexa Space podcast puts the founders, makers and thinkers who share our space at the centre of the story — recorded in our broadcast-ready studio in Box Hill.',
    listenOn: 'Listen on',
    latestEyebrow: 'Latest episode',
    episode: (n: number) => `Episode ${n}`,
    playEpisode: 'Play episode',
    playAria: 'Play episode',
    moreEyebrow: 'More episodes',
    backCatalogue: 'The back catalogue.',
    recordTitle: 'Record your',
    recordTitleItalic: 'own.',
    recordLead:
      'The same studio we record in is yours to book — soundproofed, beautifully lit and fully equipped, with in-house production to take you from idea to published episode.',
    bookStudio: 'Book the studio',
    studioDetails: 'Studio details',
    ctaEyebrow: 'Be a guest',
    ctaTitle: 'Have a story',
    ctaTitleItalic: 'to tell?',
    ctaBody:
      'We’re always looking for founders, makers and thinkers from our community to join us on the show. Tell us what you’re working on.',
    ctaPrimary: 'Pitch yourself as a guest',
  },
};

export type PagesDict = typeof en;

const zh: PagesDict = {
  about: {
    metaTitle: '关于我们 — Hexa Space',
    metaDescription:
      'Hexa Space 是位于墨尔本博士山的高端办公空间与会员俱乐部，隶属 Hexa Group — 以人、地、文化与传承为本。',
    heroKicker: '关于我们',
    heroTitle: '不止是一处',
    heroTitleItalic: '办公空间。',
    heroIntro:
      'Hexa Space 是坐落于博士山核心地段的高端办公空间与会员俱乐部 — 以清晰、款待与用心，成就每一个工作日。',
    storyEyebrow: '我们的故事',
    storyTitle: '为墨尔本东区悉心营造的家。',
    storyLead:
      '我们想建造的，是自己也愿意在其中工作的空间 — 它更像一间私人会员俱乐部，而非传统的服务式办公室。',
    storyBody1:
      'Hexa Space 坐落于 Whitehorse Road 上一整层光线充盈的楼面，将经建筑设计的办公室与工位，与有人打理的休息室、六间独立命名的会议室、影像与播客工作室，以及一处可承办董事晚宴至产品发布的多功能场地融为一体。每一处细节 — 凹槽木饰、自然光线、精选茶艺 — 都为了让工作更从容。',
    storyBody2:
      '作为 Hexa Group — 一家多元化的澳大利亚地产与基金管理集团 — 的一员，我们信奉一个朴素的理念：非凡的空间，建立在人、地、文化与传承之上。',
    pillarsEyebrow: '我们的根基',
    pillarsTitle: '人。地。文化。传承。',
    pillars: [
      {
        title: '人',
        copy: '成功源于协作。我们让同在这层楼的会员、创始人与团队成为主角 — 并以待客之道相待，而非视作租户。',
      },
      {
        title: '地',
        copy: '深植博士山，深植墨尔本东区。我们融入这片街区 — 它的活力、它的多元，以及它作为创业之地日益重要的角色。',
      },
      {
        title: '文化',
        copy: '中西文化的细腻平衡贯穿始终 — 从茶室到活动策划 — 映照着我们所服务的社区。',
      },
      {
        title: '传承',
        copy: '作为 Hexa Group 的一员，我们建造经得起时间的空间 — 深思熟虑、低调雅奢，为经年而非一时而作。',
      },
    ],
    placeEyebrow: '所在 · 博士山',
    placeTitle: '深植',
    placeTitleItalic: '于这片街区。',
    placeLead:
      '博士山是墨尔本最具活力的中心之一 — 文化、交通与抱负在此交汇。Hexa Space 位于其核心的 Level 4, 830 Whitehorse Road，落地窗框起城市天际线。',
    placeBody:
      '距车站仅数步之遥，环绕着全城数一数二的美食，并通过我们与 Ucommune 的合作，连接遍布全球的办公空间网络。',
    placeImageAlt: 'Hexa Space 博士山前台',
    stats: [
      { value: '5', label: '种会员方案' },
      { value: '6', label: '间独立命名会议室' },
      { value: '20–100', label: '活动容纳人数' },
      { value: '全球', label: 'Ucommune 网络' },
    ],
    groupEyebrow: '更大格局的一部分',
    groupTitle: 'Hexa Group 旗下公司。',
    groupBody:
      'Hexa Space 是 Hexa Group 的办公空间板块 — 这家多元化的澳大利亚地产与基金管理集团，以创新与协作创造恒久价值。这份传承，塑造着我们设计、待客与着眼长远的方式。',
    groupCta: '联系我们',
  },

  workspacesPage: {
    metaTitle: '会员方案 — Hexa Space',
    metaDescription:
      '墨尔本博士山的虚拟办公室、灵活与专属工位、独立办公室及企业定制套间 — 价格透明，配套齐全。',
    heroKicker: '会员方案',
    heroTitle: '会员方案，',
    heroTitleItalic: '丰俭由人。',
    heroIntro:
      '从一个商务地址到一间独立套间 — 按月签约、价格透明，围绕您真正想要的工作方式而设计。',
    includedEyebrow: '始终包含',
    includedTitle: '每一种会籍，皆有周到服务。',
    includedBody:
      '无论您选择哪种办公空间，日常所需皆已备妥 — 您只需到来、安顿，然后开始工作。',
    inclusionsLabel: '会籍权益',
    everythingIn: (name: string) => `${name}的全部权益，另加`,
    viewMembership: '查看详情',
    enquire: '咨询',
    ctaEyebrow: '不确定哪种适合？',
    ctaTitle: '让我们为您找到',
    ctaTitleItalic: '合适的空间。',
    ctaBody:
      '告诉我们您的团队与偏好的工作方式，我们将为您量身推荐合适的会籍 — 并邀请您亲临参观。',
  },

  workspaceDetail: {
    membershipKicker: (capacity: string) => `会籍 · ${capacity}`,
    pricing: '价格',
    from: '起价',
    term: '签约方式',
    capacity: '容纳人数',
    enquire: '咨询',
    overviewEyebrow: '空间概览',
    idealFor: '适合人群',
    whatsIncluded: '会籍包含',
    everythingIn: (name: string) => `${name}的全部权益，另加`,
    whyEyebrow: '为何选择这一会籍',
    whyTitle: '于细节之处，见格调不同。',
    galleryEyebrow: '空间实景',
    alwaysEyebrow: '始终包含',
    alwaysTitle: '每一种会籍，皆有周到服务。',
    alwaysBody: '无论您选择哪种办公空间，日常所需与社区生活皆为标配。',
    ctaTitle: '让它成为',
    ctaTitleItalic: '您的空间。',
    ctaBody:
      '告诉我们您的工作方式，我们将为您量身推荐合适的会籍 — 并邀请您亲临楼层参观。',
    ctaPrimary: '立即咨询',
    othersEyebrow: '其他会籍方案',
  },

  spacesPage: {
    metaTitle: '场地租赁 — Hexa Space',
    metaDescription:
      '博士山 Hexa Space 的多功能活动空间、会议室、影像工作室与播客工作室 — 活动可容纳 20 至 150 位宾客，会议 4 至 26 人，并具备广播级制作能力。',
    heroKicker: '场地租赁',
    heroTitle: '一处可以待客、',
    heroTitleB: '相聚',
    heroTitleItalic: '与创作的空间。',
    heroIntro:
      '不止于工位 — 灵活多变的活动空间、光线充盈的会议室，以及为影像与播客而建的专业工作室，尽在博士山同一屋檐下。',
    whatsIncluded: '空间配置',
    viewSpace: (name: string) => `查看${name}`,
    ctaEyebrow: '与 Hexa 共襄盛会',
    ctaTitle: '筹备您的',
    ctaTitleItalic: '活动。',
    ctaBody:
      '从私密的董事会议到 150 位宾客的发布会，我们的团队将协助您打点空间、餐饮与活动流程。',
    ctaPrimary: '咨询活动承办',
  },

  spaceDetail: {
    capacity: '容纳人数',
    overviewEyebrow: '空间概览',
    overviewTitle: '一处与您同样全力以赴的空间。',
    whatsIncluded: '空间配置',
    roomsEyebrow: '会议室一览',
    roomsTitle: '七间会议室，各具气质。',
    roomAlt: (name: string) => `${name}会议室`,
    bookNow: '立即预订',
    configEyebrow: '布局方案',
    configTitle: '一个空间，随您所需而布置。',
    galleryEyebrow: '空间实景',
    ctaTitle: '准备好',
    ctaTitleItalic: '预订了吗？',
    ctaBody:
      '告诉我们您的日期与设想 — 我们的团队将确认可用时段，并为您妥帖安排空间。',
    moreEyebrow: '更多空间',
    view: '查看',
  },

  podcastPage: {
    metaTitle: '播客 — Hexa Space',
    metaDescription:
      'Hexa Space 播客 — 与同在这层楼的创始人、创作者与思考者对话，录制于我们位于墨尔本博士山的广播级工作室。',
    heroKicker: '播客',
    heroTitle: '来自我们这层楼',
    heroTitleB: '的',
    heroTitleItalic: '对话。',
    heroIntro:
      'Hexa Space 播客让共享这片空间的创始人、创作者与思考者成为故事的主角 — 录制于我们位于博士山的广播级工作室。',
    listenOn: '收听平台',
    latestEyebrow: '最新一期',
    episode: (n: number) => `第 ${n} 期`,
    playEpisode: '播放本期',
    playAria: '播放本期节目',
    moreEyebrow: '更多节目',
    backCatalogue: '往期节目。',
    recordTitle: '录制',
    recordTitleItalic: '您自己的节目。',
    recordLead:
      '我们录制节目的这间工作室，同样向您开放 — 隔音精良、灯光考究、设备齐全，内部制作团队伴您从构想走到发布。',
    bookStudio: '预订工作室',
    studioDetails: '工作室详情',
    ctaEyebrow: '成为嘉宾',
    ctaTitle: '有故事',
    ctaTitleItalic: '想讲？',
    ctaBody:
      '我们始终期待社区中的创始人、创作者与思考者做客节目。告诉我们您正在做的事。',
    ctaPrimary: '自荐成为嘉宾',
  },
};

export const PAGES: Record<Locale, PagesDict> = { en, zh };
