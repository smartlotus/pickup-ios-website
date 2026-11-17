/* Bilingual copy and authentic demo seed data for Pickup for iOS & iPadOS 26 */
window.PICKUP_DATA = {
  zh: {
    locale: 'zh-CN',
    themeMono: '纯黑白',
    themePurple: '紫夜深色',
    themeSwitchedMono: '已切换至纯黑白 Monochrome 主题',
    themeSwitchedPurple: '已切换至紫夜 Purple Dark 主题',
    deviceSwitchedIphone: '已切换至 iPhone 17 Pro 液态玻璃视图',
    deviceSwitchedIpad: '已切换至 iPad Pro Split-View 三栏视图',
    copied: '已复制到剪贴板',
    copyFailed: '请手动选中复制',
    searchEmpty: '没有找到匹配该条件的记忆片段',
    liveBadge: 'LIVE · 实况照片',
    livePlaying: '正在回放 1.5s 实况动态瞬间…',
    pinAdded: '已加上星标',
    pinRemoved: '已取消星标',
    repliesLabel: '回看与回应',
    replyPlaceholder: '给当时的自己留一句回应…',
    replyAdded: '已写入一条新的时间回应',
    replyButton: '写入回看',
    revisitShuffled: '已为你随机拾起另一段旧日记忆',
    selectedDayLabel: '当日记录',
    noDayEntries: '这一天没有留下记录，去写一条新的吧。',
    onThisDayBadge: '往年今日 · 记忆回响',
    aiScopeLabels: {
      intelligent: '智能匹配 · 最近相关片段',
      all: '全部记录 · 完整记忆上下文',
      custom: '日期范围 · 近 7 天精选'
    },
    aiPreviewHeader: '发送前隐私披露预览 · 仅纯文本上下文',
    aiMediaZero: '0 bytes 媒体发送（图片、实况与视频绝不离开本机）',
    aiSimulatedAnswers: {
      calm: '从你最近的几条日记来看，让你感到安稳与松弛的时刻，都带着「主动放慢」的质地：下班绕远路买回家的洋甘菊、窗边阳光斜移时逐渐变凉的咖啡，以及深夜听着雨声写下的句子。你很懂得用微小的感官锚点，帮自己把紧绷的一天重新理顺。',
      songs: '这段时间陪着你的旋律大多偏安静与夜色感：《晚风 — 夜间电台》《晴天 — Acoustic Demo》《夜航船 — Lo-Fi Mix》和《Rainy Taxi》。音乐常常和你散步、独处阅读的片段绑在一起出现。',
      summary: '本周共有 4 条新片段、3 次跨时间回看与 1 份置顶安全快照。高频主题集中在「散步」「深夜」「阅读」，整体情绪曲线从周初的略微疲惫逐渐转向松弛与沉静。'
    },
    vaultStorageItems: [
      { key: 'images', label: '照片与实况', bytesLabel: '18.4 MB', pct: 46, color: '#A78BFA' },
      { key: 'videos', label: '片段视频', bytesLabel: '11.2 MB', pct: 28, color: '#7C4DFF' },
      { key: 'backups', label: '本地备份快照', bytesLabel: '7.6 MB', pct: 19, color: '#C5A86A' },
      { key: 'text', label: '日记 JSON & AI', bytesLabel: '2.8 MB', pct: 7, color: '#F46862' }
    ],
    vaultFreqLabels: {
      '6h': '每 6 小时',
      'daily': '每天 22:30',
      'weekly': '每周日'
    },
    vaultRetentionLabels: {
      '7': '保留最近 7 份',
      '15': '保留最近 15 份',
      'all': '永久保留全部'
    },
    vaultFormats: {
      zip: {
        title: 'Android v2 互通标准包 (.zip)',
        ext: '.zip',
        badge: '100% 跨端无损',
        lines: [
          'pickup-auto-20261117-223000.zip',
          '├── backup.json          # pickup-portable-backup v2 (Android / iOS 通用)',
          '├── ios-extensions.json  # mood / weather / tags / isPinned 增强字段',
          '└── media/               # media_0000.jpg + motionVideo (.mov)'
        ]
      },
      vault: {
        title: 'AES-256-GCM 加密保险箱 (.pickupvault)',
        ext: '.pickupvault',
        badge: 'CryptoKit 零明文',
        lines: [
          'pickup-vault-20261117-223000.pickupvault',
          '├── format: "pickup-ios-vault" · version: 1',
          '├── kdf: "pbkdf2-hmac-sha256" · 80,000 iterations · 16B salt',
          '└── cipher: AES-256-GCM (96-bit nonce + 128-bit auth tag)'
        ]
      },
      markdown: {
        title: '可读排版 Markdown 文集 (.md.zip)',
        ext: '.md.zip',
        badge: '百年可读归档',
        lines: [
          'pickup-anthology-20261117.md.zip',
          '├── README.md            # 总目录、统计与生成时间',
          '├── 2026/11/entries.md   # 日期标题 + 正文 + 音乐 + 回看批注',
          '└── media/               # 原始高画质图片与视频附件'
        ]
      }
    },
    vaultSimulatedToast: '模拟备份完成：已生成 SHA-256 校验快照并写入「文件 App / iCloud Drive」外部目录',
    vaultSnapPrefix: 'pickup-manual-20261117',
    filmChapters: [
      { time: 0, label: '00:00 拾起日常' },
      { time: 8, label: '00:08 液态玻璃质感' },
      { time: 16, label: '00:16 红笔时间线与去留' },
      { time: 24, label: '00:24 AI 披露与数据金库' },
      { time: 32, label: '00:32 零成本免费装机' }
    ],
    entries: [
      {
        id: 'demo-1',
        day: 17,
        dateLabel: '今天 · 20:14',
        isoDate: '2026-11-17 20:14',
        isToday: true,
        hasPhoto: true,
        isLivePhoto: true,
        isPinned: true,
        mood: '松弛',
        weather: '微风 18°C',
        song: '晚风 — 夜间电台',
        tags: ['散步', '花店'],
        photoTitle: '转角花店的暖黄灯光',
        photoGradient: 'linear-gradient(135deg, #2B213A 0%, #52396A 48%, #C5A86A 100%)',
        content: '下班换了一条绕远的路。路过转角花店还亮着灯，挑了一束洋甘菊慢慢走回家。晚风把一天的紧绷都吹散了。',
        comments: [
          { time: '今天 20:48', text: '回头看，偶尔绕点远路是对的。' }
        ]
      },
      {
        id: 'demo-2',
        day: 16,
        dateLabel: '11月16日 · 15:40',
        isoDate: '2026-11-16 15:40',
        isToday: false,
        hasPhoto: true,
        isLivePhoto: true,
        isPinned: false,
        mood: '平静',
        weather: '晴',
        song: '晴天 — Acoustic Demo',
        tags: ['阅读', '咖啡'],
        photoTitle: '斜移过书页的午后光线',
        photoGradient: 'linear-gradient(135deg, #1E1C26 0%, #3E3654 55%, #F46862 100%)',
        content: '在窗边读了几页书，咖啡渐渐凉掉，阳光从桌面这一头斜斜地移到了另一头。没有赶时间的一整个下午。',
        comments: [
          { time: '11月16日 21:05', text: '这一刻值得被红笔圈起来。' }
        ]
      },
      {
        id: 'demo-3',
        day: 14,
        dateLabel: '11月14日 · 22:55',
        isoDate: '2026-11-14 22:55',
        isToday: false,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: false,
        mood: '温暖',
        weather: '多云',
        song: '夜航船 — Lo-Fi Mix',
        tags: ['朋友', '深夜'],
        content: '和很久没联系的老朋友通了半小时电话。聊的都是琐碎小事，挂断后却觉得今晚格外充实。',
        comments: []
      },
      {
        id: 'demo-4',
        day: 11,
        dateLabel: '11月11日 · 02:18',
        isoDate: '2026-11-11 02:18',
        isToday: false,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: false,
        mood: '沉静',
        weather: '夜雨',
        song: 'Rainy Taxi',
        tags: ['雨夜'],
        content: '凌晨两点下了一场急雨，打开阳台的窗听雨声敲在空调外机上，顺手记下这句：生活不必每页都波澜壮阔。',
        comments: []
      },
      {
        id: 'demo-last-year',
        day: 5,
        dateLabel: '去年今日 · 17:42',
        isoDate: '2025-11-17 17:42',
        isToday: false,
        isOnThisDay: true,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: true,
        mood: '怀旧',
        weather: '海风',
        song: 'Sea Glass',
        tags: ['海边', '往年今日'],
        content: '去年今日在海边吹风到日落，沙子灌满了帆布鞋。那时许愿说希望一年后还能保持对日常的敏感。',
        comments: [
          { time: '今天 09:10', text: '一年后的今天，依然在好好拾起日子。' }
        ]
      }
    ],
    recordedDays: [2, 5, 8, 11, 14, 16, 17]
  },
  en: {
    locale: 'en',
    themeMono: 'Monochrome',
    themePurple: 'Purple Dark',
    themeSwitchedMono: 'Switched to Monochrome theme',
    themeSwitchedPurple: 'Switched to Purple Dark theme',
    deviceSwitchedIphone: 'Switched to iPhone 17 Pro Liquid Glass view',
    deviceSwitchedIpad: 'Switched to iPad Pro Split-View',
    copied: 'Copied to clipboard',
    copyFailed: 'Select text manually to copy',
    searchEmpty: 'No memories matched your filter or query',
    liveBadge: 'LIVE · Motion Photo',
    livePlaying: 'Replaying 1.5s Live Photo clip…',
    pinAdded: 'Pinned memory',
    pinRemoved: 'Unpinned memory',
    repliesLabel: 'Reflections',
    replyPlaceholder: 'Write a reply to your past self…',
    replyAdded: 'Saved new reflection to this memory',
    replyButton: 'Add Reply',
    revisitShuffled: 'Picked another past memory for you',
    selectedDayLabel: 'Selected Day',
    noDayEntries: 'No memories recorded on this date yet.',
    onThisDayBadge: 'On This Day · Memory Echo',
    aiScopeLabels: {
      intelligent: 'Smart Match · Relevant Moments',
      all: 'All Entries · Full Context',
      custom: 'Date Range · Past 7 Days'
    },
    aiPreviewHeader: 'Pre-Send Privacy Disclosure · Plain Text Only',
    aiMediaZero: '0 bytes media sent (Photos, Live Photos & Videos stay on device)',
    aiSimulatedAnswers: {
      calm: 'Looking through your recent entries, your calmest moments share an unhurried rhythm: taking the longer walk past the corner flower shop for chamomile, watching afternoon sunlight drift past cooling coffee, and listening to late-night rain from the balcony.',
      songs: 'Your recent soundtrack leans nocturnal and unhurried: "Evening Breeze — Night Radio", "Sunny Day — Acoustic Demo", "Night Ferry — Lo-Fi Mix", and "Rainy Taxi". Each track pairs directly with quiet walks and reading sessions.',
      summary: 'This week holds 4 new entries, 3 cross-time reflections, and 1 pinned safety snapshot. Frequent tags revolve around "walk", "reading", and "midnight", shifting gently from early-week tension into stillness.'
    },
    vaultStorageItems: [
      { key: 'images', label: 'Photos & Live', bytesLabel: '18.4 MB', pct: 46, color: '#A78BFA' },
      { key: 'videos', label: 'Video Clips', bytesLabel: '11.2 MB', pct: 28, color: '#7C4DFF' },
      { key: 'backups', label: 'Local Snapshots', bytesLabel: '7.6 MB', pct: 19, color: '#C5A86A' },
      { key: 'text', label: 'Entries & AI JSON', bytesLabel: '2.8 MB', pct: 7, color: '#F46862' }
    ],
    vaultFreqLabels: {
      '6h': 'Every 6 Hours',
      'daily': 'Daily 22:30',
      'weekly': 'Weekly'
    },
    vaultRetentionLabels: {
      '7': 'Keep Last 7',
      '15': 'Keep Last 15',
      'all': 'Keep All'
    },
    vaultFormats: {
      zip: {
        title: 'Android v2 Portable Archive (.zip)',
        ext: '.zip',
        badge: '100% Lossless Sync',
        lines: [
          'pickup-auto-20261117-223000.zip',
          '├── backup.json          # pickup-portable-backup v2 schema',
          '├── ios-extensions.json  # mood / weather / tags / isPinned metadata',
          '└── media/               # media_0000.jpg + motionVideo (.mov)'
        ]
      },
      vault: {
        title: 'Encrypted Vault (.pickupvault)',
        ext: '.pickupvault',
        badge: 'CryptoKit Zero-Plaintext',
        lines: [
          'pickup-vault-20261117-223000.pickupvault',
          '├── format: "pickup-ios-vault" · version: 1',
          '├── kdf: "pbkdf2-hmac-sha256" · 80,000 iterations · 16B salt',
          '└── cipher: AES-256-GCM (96-bit nonce + 128-bit auth tag)'
        ]
      },
      markdown: {
        title: 'Readable Markdown Anthology (.md.zip)',
        ext: '.md.zip',
        badge: 'Future-Proof Archive',
        lines: [
          'pickup-anthology-20261117.md.zip',
          '├── README.md            # Index, counts & export timestamp',
          '├── 2026/11/entries.md   # Formatted prose, songs & reflections',
          '└── media/               # Original full-resolution photos & clips'
        ]
      }
    },
    vaultSimulatedToast: 'Simulated backup complete: SHA-256 verified snapshot written to Files / iCloud Drive folder',
    vaultSnapPrefix: 'pickup-manual-20261117',
    filmChapters: [
      { time: 0, label: '00:00 Keep the Little Things' },
      { time: 8, label: '00:08 Liquid Glass Craft' },
      { time: 16, label: '00:16 Red-Pen Timeline & Revisit' },
      { time: 24, label: '00:24 AI Disclosure & Data Vault' },
      { time: 32, label: '00:32 Zero-Fee Sideload' }
    ],
    entries: [
      {
        id: 'demo-1',
        day: 17,
        dateLabel: 'Today · 20:14',
        isoDate: '2026-11-17 20:14',
        isToday: true,
        hasPhoto: true,
        isLivePhoto: true,
        isPinned: true,
        mood: 'Unwound',
        weather: 'Breeze 18°C',
        song: 'Evening Breeze — Night Radio',
        tags: ['walk', 'flowers'],
        photoTitle: 'Corner florist glowing after dusk',
        photoGradient: 'linear-gradient(135deg, #2B213A 0%, #52396A 48%, #C5A86A 100%)',
        content: 'Took the long way home after work. The corner flower shop still had its warm lights on, so I picked up chamomile and walked back slowly in the cool breeze.',
        comments: [
          { time: 'Today 20:48', text: 'Looking back, taking the detour was the right call.' }
        ]
      },
      {
        id: 'demo-2',
        day: 16,
        dateLabel: 'Nov 16 · 15:40',
        isoDate: '2026-11-16 15:40',
        isToday: false,
        hasPhoto: true,
        isLivePhoto: true,
        isPinned: false,
        mood: 'Calm',
        weather: 'Clear',
        song: 'Sunny Day — Acoustic Demo',
        tags: ['reading', 'coffee'],
        photoTitle: 'Sunlight drifting across the desk',
        photoGradient: 'linear-gradient(135deg, #1E1C26 0%, #3E3654 55%, #F46862 100%)',
        content: 'Read a few chapters by the window while my coffee cooled. Sunlight slid slowly from one corner of the desk to the other—an afternoon with nowhere to rush.',
        comments: [
          { time: 'Nov 16 21:05', text: 'Worth circling in red ink.' }
        ]
      },
      {
        id: 'demo-3',
        day: 14,
        dateLabel: 'Nov 14 · 22:55',
        isoDate: '2026-11-14 22:55',
        isToday: false,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: false,
        mood: 'Warm',
        weather: 'Cloudy',
        song: 'Night Ferry — Lo-Fi Mix',
        tags: ['friends', 'midnight'],
        content: 'Talked on the phone with an old friend for thirty minutes. Nothing monumental—just tiny everyday updates that made the night feel full.',
        comments: []
      },
      {
        id: 'demo-4',
        day: 11,
        dateLabel: 'Nov 11 · 02:18',
        isoDate: '2026-11-11 02:18',
        isToday: false,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: false,
        mood: 'Still',
        weather: 'Rain',
        song: 'Rainy Taxi',
        tags: ['rain'],
        content: 'Sudden rain at 2 a.m. Opened the balcony window to listen and jotted down one line: life does not need fireworks on every single page.',
        comments: []
      },
      {
        id: 'demo-last-year',
        day: 5,
        dateLabel: '1 Year Ago · 17:42',
        isoDate: '2025-11-17 17:42',
        isToday: false,
        isOnThisDay: true,
        hasPhoto: false,
        isLivePhoto: false,
        isPinned: true,
        mood: 'Nostalgic',
        weather: 'Sea Wind',
        song: 'Sea Glass',
        tags: ['coast', 'on-this-day'],
        content: 'Stayed by the shoreline until sunset a year ago, canvas shoes full of sand. Remember making a quiet wish to stay attentive to ordinary days.',
        comments: [
          { time: 'Today 09:10', text: 'One year later, still picking up the quiet moments.' }
        ]
      }
    ],
    recordedDays: [2, 5, 8, 11, 14, 16, 17]
  }
};
