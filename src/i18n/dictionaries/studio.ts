// ─────────────────────────────────────────────────────────────────────────────
// Podcast studio page copy — the dedicated /podcast-studio page, its policies,
// the guest guide and the request-a-session form.
//
// This is a separate namespace from `pages.podcastPage`, which is the SHOW
// (episodes, listen-on). This one is the room you hire.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

const en = {
  meta: {
    title: 'The Podcast Studio — Hexa Space',
    description:
      'A three-camera podcast studio in Box Hill, Melbourne, run by our team. Broadcast microphones, cinema lenses and an operator on every session. Request a session — we confirm within one business day.',
  },
  hero: {
    kicker: 'Suite 25, Level 2 · Box Hill',
    title: 'The Podcast',
    titleItalic: 'Studio.',
    intro:
      'Three cameras, broadcast microphones and an operator who runs the whole session for you. You turn up and talk — we handle everything else, and you leave with your footage.',
  },
  rig: {
    eyebrow: 'The rig',
    title: 'Built to look and sound like broadcast.',
    lead:
      'Everything is set to documented presets before you arrive, so every episode you record here matches the last one.',
    items: [
      {
        title: 'Three cameras',
        body: 'Sony ZV-E10 II bodies on host, guest and a wide centre angle. Sigma 56mm f/1.4 primes on the close angles, a 16mm f/1.4 on the wide. 4K, 10-bit, S-Cinetone.',
      },
      {
        title: 'Broadcast audio',
        body: 'Two Shure SM7B microphones into a RØDECaster console. Every microphone is recorded to its own track plus a mixed one, so nothing is baked in before you edit.',
      },
      {
        title: 'Considered lighting',
        body: 'Key lights on host and guest at a consistent 4500K, with backlights and tunable accent lighting. Angled to cut glare for anyone in glasses.',
      },
      {
        title: 'An operator, always',
        body: 'A member of our team runs cameras, sound and lighting for the whole session, watches the levels, and handles your files at the end.',
      },
    ],
  },
  session: {
    eyebrow: 'How a session runs',
    title: 'Your booking includes the setup.',
    lead:
      'This is the one thing worth reading twice. Setup, briefing and file handover all happen inside your booked time — not before it, and not after.',
    phases: [
      { label: 'Setup & briefing', time: '~30 min', body: 'Cameras, sound and lighting checked, seating and microphones set, and a quick brief for you and your guests.' },
      { label: 'Recording', time: 'the rest', body: 'The session itself. In a one-hour booking that is realistically under fifteen minutes.' },
      { label: 'Transfer & reset', time: '~15 min', body: 'Your files copied, verified and handed over, cards logged, and the studio reset.' },
    ],
    note:
      'So if you want a 45-minute episode, book two hours. Tell us the recording length you have in mind when you request a session and we will tell you honestly whether it fits.',
  },
  policies: {
    eyebrow: 'Studio policies',
    title: 'What to expect, before you ask.',
    lead:
      'The studio is staffed, so it works a little differently to booking a meeting room. These are the terms every session runs under.',
    items: [
      { title: 'Requesting a session', body: 'The studio is staff-operated and cannot be booked instantly. Every session is a request — we confirm within one business day. Your slot is held while we confirm, and nothing is charged until we do.' },
      { title: 'What your booking includes', body: 'Minimum booking is one hour. Setup, briefing and file handover happen inside your booking, not before or after it — allow about 30 minutes to set up and 15 to transfer files and reset. A one-hour booking typically leaves under 15 minutes of actual recording. If you need more recording time, book a longer session.' },
      { title: 'Arriving on time', body: 'Please arrive at the start of your booked time. Setup time is part of your booking, so a late arrival shortens your recording rather than extending the session.' },
      { title: 'Our team operates the equipment', body: 'Cameras, audio and lighting are set to documented studio presets and operated by our team. Please do not move or adjust the microphones, cameras or lights — tell the operator what you need and they will handle it.' },
      { title: 'During the recording', body: 'Stay seated within the marked area so you remain in frame, speak toward the microphone rather than across it, and avoid tapping the table or handling the mic stand. Phones on silent. Water is welcome at the table but must be kept away from cables and equipment.' },
      { title: 'Your files', body: 'Recordings are copied and verified before you leave, and handed over as raw files — multi-camera video and multi-track audio. Bring a USB drive or portable SSD if you can. We keep a working copy for 14 days as a safety net, then delete it, so please confirm you have everything you need within that window.' },
      { title: 'Studio hours', body: 'The studio operates during business hours, 9:00am – 5:00pm on weekdays, because every session needs an operator on site.' },
      { title: 'Changes and cancellations', body: 'Let us know as early as you can if you need to move or cancel a session — an operator is rostered for your slot. Changing the time of a confirmed session returns it to pending while we re-check operator availability.' },
      { title: 'Care of the studio', body: 'You are responsible for any damage to the studio or its equipment caused by you or your guests. Please leave the space as you found it.' },
    ],
  },
  guests: {
    eyebrow: 'For your guests',
    title: 'Send this to anyone appearing with you.',
    lead:
      'Two minutes of reading makes a visible difference to how the episode turns out. We email this guide with every confirmation, too.',
    groups: [
      {
        title: 'Microphone',
        items: [
          'Speak toward the microphone, not across it.',
          'Please don’t move the microphone or its stand once you’re set up.',
          'Avoid tapping the table or handling the stand while recording — both are very audible.',
        ],
      },
      {
        title: 'Staying in frame',
        items: [
          'Stay seated within the marked area so you remain in shot.',
          'Keep your face toward the camera or the host when you speak.',
          'Small, natural movement is fine — just avoid leaning far forward or sideways.',
          'Need a break? Tell the operator. Please don’t adjust the equipment yourself.',
        ],
      },
      {
        title: 'What to wear',
        items: [
          'Mid-tone colours record best — avoid pure white and pure black.',
          'Avoid tight, busy patterns like fine stripes; they shimmer on camera.',
          'Glasses are no problem — the lighting is angled to cut glare.',
          'Skip large jewellery that can knock the microphone or rattle.',
        ],
      },
      {
        title: 'On the day',
        items: [
          'Arrive at the start of your booked time — setup is inside your booking.',
          'Phones on silent, please.',
          'Water is welcome at the table, just away from cables and equipment.',
        ],
      },
    ],
  },
  request: {
    eyebrow: 'Request a session',
    title: 'Tell us what you’re recording.',
    lead:
      'The studio isn’t instant-book — an operator has to be rostered for your session. Send a request and we’ll confirm within one business day. Nothing is charged now.',
    fields: {
      name: 'Your name',
      email: 'Email',
      phone: 'Phone',
      businessName: 'Business or show name',
      date: 'Preferred date',
      startTime: 'Preferred start',
      hours: 'How long do you need the studio?',
      recordingType: 'What are you recording?',
      peopleOnCamera: 'People on camera',
      expectedRecordingMins: 'Expected recording length (minutes)',
      ownCrew: 'Bringing your own camera or audio operator?',
      ownCards: 'Bringing your own SD cards?',
      transferHelp: 'Would you like help transferring the files?',
      specialRequirements: 'Anything else we should set up?',
      optional: 'optional',
    },
    recordingTypes: ['Interview', 'Solo / monologue', 'Video podcast', 'Remote guest', 'Other'],
    hourOptions: (n: number) => (n === 1 ? '1 hour' : `${n} hours`),
    yes: 'Yes',
    no: 'No',
    filesNote:
      'You’ll leave with raw footage — multi-camera video and multi-track audio, copied and verified before you go. Bring a USB drive or portable SSD if you can.',
    fitsNote: (mins: number) =>
      `That leaves about ${mins} minutes of recording once setup and file handover are allowed for.`,
    tooShort: (want: number, have: number) =>
      `${want} minutes of recording won’t fit — this booking allows about ${have}. Add another hour, or shorten the recording.`,
    policyAccept: 'I have read and agree to the studio policies above.',
    submit: 'Request session',
    submitting: 'Sending…',
    successTitle: 'Request received.',
    successBody:
      'Your slot is held while we confirm an operator — we’ll come back to you within one business day. Nothing has been charged. Check your inbox for a confirmation of what you asked for.',
    successRef: (ref: string) => `Reference ${ref}`,
    errorGeneric: 'Something went wrong sending your request. Please try again, or email info@hexaspace.com.au.',
    required: 'Please fill in the required fields.',
  },
  cta: {
    eyebrow: 'Not sure yet?',
    title: 'Come and see the',
    titleItalic: 'studio.',
    body:
      'Book a tour and we’ll walk you through the room, show you the setup and talk through what your episode would look like.',
    primary: 'Book a tour',
  },
};

export type StudioDict = typeof en;

const zh: StudioDict = {
  meta: {
    title: '播客录音室 — 六合空间',
    description:
      '位于墨尔本 Box Hill 的三机位播客录音室，由我们的团队全程操作。广播级麦克风、电影定焦镜头，每场录制均配备操作员。提交预约申请，我们将在一个工作日内确认。',
  },
  hero: {
    kicker: 'Box Hill · 二楼 25 室',
    title: '播客',
    titleItalic: '录音室。',
    intro:
      '三台摄影机、广播级麦克风，以及全程为您操作的技术人员。您只需前来专注对话 — 其余交给我们，结束时即可带走全部素材。',
  },
  rig: {
    eyebrow: '设备配置',
    title: '为广播级画面与声音而生。',
    lead: '所有设备在您抵达前均已按既定参数调校完毕，因此每一期节目都与上一期保持一致。',
    items: [
      {
        title: '三机位拍摄',
        body: '主持人、嘉宾及中央广角三个机位，均采用 Sony ZV-E10 II 机身。近景机位配 Sigma 56mm f/1.4 定焦，广角机位配 16mm f/1.4。4K、10-bit、S-Cinetone。',
      },
      {
        title: '广播级音频',
        body: '两支 Shure SM7B 麦克风接入 RØDECaster 调音台。每支麦克风独立成轨并另存一条混音轨，剪辑前不做任何不可逆处理。',
      },
      {
        title: '专业布光',
        body: '主持人与嘉宾位主灯统一 4500K 色温，另配背光与可调氛围灯。灯位经过调整，可减少眼镜反光。',
      },
      {
        title: '全程有人操作',
        body: '我们的团队成员全程操作摄影、收音与灯光，实时监看电平，并在结束后处理您的文件。',
      },
    ],
  },
  session: {
    eyebrow: '录制流程',
    title: '预约时段已包含前期准备。',
    lead: '这一点值得读两遍：设备调试、拍前说明与文件交接，全部包含在您预约的时段之内，而非额外附加。',
    phases: [
      { label: '调试与说明', time: '约 30 分钟', body: '检查摄影、收音与灯光，安排座位与麦克风，并为您和嘉宾做简短说明。' },
      { label: '正式录制', time: '剩余时间', body: '录制本身。若预约一小时，实际录制时间通常不足十五分钟。' },
      { label: '导出与复位', time: '约 15 分钟', body: '复制并校验您的文件后交付，登记存储卡，并将录音室复位。' },
    ],
    note:
      '因此，若您计划录制 45 分钟的节目，建议预约两小时。提交申请时请告知预期录制时长，我们会如实告知该时段是否足够。',
  },
  policies: {
    eyebrow: '录音室规定',
    title: '在您询问之前，先说清楚。',
    lead: '录音室配备专人操作，因此流程与预订会议室略有不同。以下为每场录制均适用的条款。',
    items: [
      { title: '预约方式', body: '录音室由专人操作，无法即时预订。每场录制均为申请制 — 我们将在一个工作日内确认。确认期间我们会为您保留该时段，确认前不会产生任何费用。' },
      { title: '预约时段包含什么', body: '最短预约为一小时。设备调试、拍前说明与文件交接均包含在您的时段内，而非额外附加 — 请预留约 30 分钟调试、15 分钟导出文件与复位。一小时的预约通常仅剩不足 15 分钟的实际录制时间。若需要更长录制时间，请预约更长时段。' },
      { title: '准时抵达', body: '请于预约时段开始时抵达。前期准备已包含在您的时段内，迟到将压缩录制时间，而非顺延结束时间。' },
      { title: '设备由我们操作', body: '摄影、收音与灯光均按既定参数设置，并由我们的团队操作。请勿移动或调整麦克风、摄影机与灯具 — 告知操作员您的需求，我们会为您处理。' },
      { title: '录制期间', body: '请坐在标记区域内以保持在画面中；对着麦克风说话而非从侧面掠过；避免敲击桌面或触碰麦克风支架。请将手机静音。桌上可以放水，但须远离线材与设备。' },
      { title: '您的文件', body: '录制素材会在您离开前完成复制与校验，并以原始文件形式交付 — 多机位视频与多轨音频。如有条件，请自备 U 盘或移动固态硬盘。我们会保留一份工作副本 14 天作为备份，之后即予删除，请在此期间确认您已取得所需的全部素材。' },
      { title: '开放时间', body: '录音室于工作日 9:00 至 17:00 运营，因为每场录制都需要操作员在场。' },
      { title: '变更与取消', body: '如需更改或取消场次，请尽早告知 — 我们已为您的时段安排了操作员。更改已确认场次的时间后，该场次将回到待确认状态，我们会重新核对操作员的可用时间。' },
      { title: '爱护录音室', body: '您与您的嘉宾对录音室及其设备造成的任何损坏由您负责。请保持空间原状。' },
    ],
  },
  guests: {
    eyebrow: '致您的嘉宾',
    title: '请转发给所有出镜的人。',
    lead: '两分钟的阅读，会让成片效果明显不同。每次确认函中我们也会附上这份指南。',
    groups: [
      {
        title: '麦克风',
        items: [
          '请对着麦克风说话，而非从侧面掠过。',
          '就位后请勿移动麦克风或支架。',
          '录制期间请避免敲击桌面或触碰支架 — 这些声音非常明显。',
        ],
      },
      {
        title: '保持在画面内',
        items: [
          '请坐在标记区域内，以确保始终在画面中。',
          '发言时请面向摄影机或主持人。',
          '自然的小幅动作没有问题 — 只需避免大幅前倾或侧倾。',
          '需要休息请告知操作员，请勿自行调整设备。',
        ],
      },
      {
        title: '着装建议',
        items: [
          '中间色调上镜最佳 — 请避免纯白与纯黑。',
          '避免细条纹等紧密繁复的图案，上镜会产生摩尔纹。',
          '戴眼镜无妨 — 灯位已作调整以减少反光。',
          '请勿佩戴容易碰撞麦克风或产生声响的大件首饰。',
        ],
      },
      {
        title: '当天注意',
        items: [
          '请于预约时段开始时抵达 — 前期准备包含在您的时段内。',
          '请将手机调至静音。',
          '桌上可以放水，但请远离线材与设备。',
        ],
      },
    ],
  },
  request: {
    eyebrow: '预约录制',
    title: '告诉我们您要录什么。',
    lead:
      '录音室无法即时预订 — 我们需要为您的场次安排操作员。请提交申请，我们将在一个工作日内确认。此刻不会产生任何费用。',
    fields: {
      name: '您的姓名',
      email: '电子邮箱',
      phone: '联系电话',
      businessName: '公司或节目名称',
      date: '期望日期',
      startTime: '期望开始时间',
      hours: '您需要使用录音室多久？',
      recordingType: '录制类型',
      peopleOnCamera: '出镜人数',
      expectedRecordingMins: '预期录制时长（分钟）',
      ownCrew: '是否自带摄影或音频操作人员？',
      ownCards: '是否自带 SD 存储卡？',
      transferHelp: '是否需要协助传输文件？',
      specialRequirements: '还有其他需要我们准备的吗？',
      optional: '选填',
    },
    recordingTypes: ['访谈', '个人口播', '视频播客', '远程连线嘉宾', '其他'],
    hourOptions: (n: number) => `${n} 小时`,
    yes: '是',
    no: '否',
    filesNote:
      '您将带走原始素材 — 多机位视频与多轨音频，离开前已完成复制与校验。如有条件，请自备 U 盘或移动固态硬盘。',
    fitsNote: (mins: number) => `扣除前期准备与文件交接后，约剩余 ${mins} 分钟的实际录制时间。`,
    tooShort: (want: number, have: number) =>
      `${want} 分钟的录制时长不够 — 该时段约可录制 ${have} 分钟。请增加一小时，或缩短录制时长。`,
    policyAccept: '我已阅读并同意上述录音室规定。',
    submit: '提交申请',
    submitting: '提交中…',
    successTitle: '已收到您的申请。',
    successBody:
      '我们已为您保留该时段，正在安排操作员 — 将在一个工作日内回复您。目前尚未产生任何费用。请查收邮件确认申请内容。',
    successRef: (ref: string) => `编号 ${ref}`,
    errorGeneric: '提交时出现问题，请重试，或发送邮件至 info@hexaspace.com.au。',
    required: '请填写必填项。',
  },
  cta: {
    eyebrow: '还在考虑？',
    title: '欢迎前来',
    titleItalic: '实地参观。',
    body: '预约参观，我们将带您了解这个空间、展示设备配置，并一起聊聊您的节目可以呈现的样子。',
    primary: '预约参观',
  },
};

export const STUDIO: Record<Locale, StudioDict> = { en, zh };
